// ==UserScript==
// @name           Bnter Post Keyboard Navigator
// @namespace      http://bwong.net/
// @description    Adds post keyboard navigation for Bnter
// @include        http://bnter.com/*
// @include        http://www.bnter.com/*
// ==/UserScript==

var BnterNavigator = function() {
  var Keys = {
    c: 99,
    g: 103,
    j: 106,
    k: 107,
    l: 108,
    r: 114,
    v: 118,
    slash: 47
  };

  var Bnter;
  if (!Bnter) Bnter = {};

  Bnter.Convo = {
    view: function() {
      var currentElement = Bnter.Window.closestElements('.convo').current;
      if ($(currentElement).hasClass('convo')) {
        var viewElems = $(currentElement).find('.timestamp');
        if (viewElems.length > 0)
          document.location = viewElems[0].href;
      }
    }
  };

  Bnter.Navigator = {
    newPost: function() {
      document.location = 'http://bnter.com/conversation/create';
    },

    focusSearch: function(ev) {
      if (ev) { ev.preventDefault(); }
      $('.search .input input').focus();
      return false;
    },

    goToPrevious: function() {
      var prevElement = Bnter.Window.closestElements('.convo').previous;
      Bnter.Window.moveTo(prevElement, true);
    },

    goToNext: function() {
      var nextElement = Bnter.Window.closestElements('.convo').next;
      Bnter.Window.moveTo(nextElement, false);
    }
  };

  Bnter.Post = {
    reply: function(ev) {
      if (ev) { ev.preventDefault(); }

      if (document.location.href.match(/^https?:\/\/(www\.)?bnter\.com\/convo/)) {
        $('textarea[name=comment]').focus();
      }

      return false;
    }
  };

  Bnter.Window = {
    threshold: 1,

    closestElements: function(selector) {
      var topOfViewport = $(window).scrollTop();

      var nextElement = null;
      var currElement = null;
      var prevElement = null;

      $(selector).each(function(idx, element) {
        var topOfElement = $(element).offset().top;

        if ((topOfElement + Bnter.Window.threshold) < topOfViewport ) {
          prevElement = element;
        }
        else if (!nextElement &&  (topOfElement - Bnter.Window.threshold) > topOfViewport ) {
          nextElement = element;
        }
        else if (Math.abs(topOfViewport - topOfElement) <= Bnter.Window.threshold * 2) {
          currElement = element;
        }
      });

      return {
        current: currElement,
        next: nextElement,
        previous: prevElement
      };
    },

    moveTo: function(element, goToTopIfNull) {
      if (element) {
        window.scrollTo(0, $(element).offset().top);
      }
      else if (goToTopIfNull) {
        window.scrollTo(0, 0);
      }
    }
  };

  // For some reason, the jQuery keypress() event not working
  document.addEventListener("keypress", function(ev) {
    if ($('input:focus').length > 0 || $('textarea:focus').length > 0)
      return;

    if (!ev) ev = window.event;

    var key = ev.keyCode ? ev.keyCode : ev.which;

    switch (key) {
      case Keys.c:
        Bnter.Navigator.newPost(ev);
        break;
      case Keys.j:
        Bnter.Navigator.goToNext(ev);
        break;
      case Keys.k:
        Bnter.Navigator.goToPrevious(ev);
        break;
      case Keys.l:
        Bnter.Convo.toggleLike(ev);
        break;
      case Keys.r:
        Bnter.Post.reply(ev);
        break;
      case Keys.v:
        Bnter.Convo.view(ev);
        break;
      case Keys.slash:
        Bnter.Navigator.focusSearch(ev);
        break;
    }
  }, true);
};

// via http://erikvold.com/blog/index.cfm/2010/6/14/using-jquery-with-a-user-script
function addJQuery(callback) {
  var script = document.createElement("script");
  var loadCallback = function() {
    var script = document.createElement("script");
    script.textContent = "(" + callback.toString() + ")();";
    document.body.appendChild(script);
  };

  if (typeof($) !== undefined) {
    loadCallback();
  }
  else {
    script.setAttribute("src", "http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js");
    script.addEventListener('load', function() {
      loadCallback();
    }, false);

    document.body.appendChild(script);
  }
}

addJQuery(BnterNavigator);

