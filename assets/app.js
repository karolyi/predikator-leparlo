'use strict';
/*global jQuery*/
/**
 * Made by http://linkedin.com/in/karolyi
 */
(function ($) {
  var audioElement;
  var ledTimeoutId;
  var litLedId = 0;
  var swingDirection;
  var maxMenuCount;
  var actualMenuId = 1;
  var jqMenuLeds;
  var jqMenuLamps;
  var jqMenuUl;
  var jqMenuBgs;
  var jqContentPages;

  var onClickMenu = function () {
    var jqLiMenuElement = $(this);
    actualMenuId = parseInt(jqLiMenuElement.data('menuid'), 10);
    if (audioElement.pause && audioElement.play) {
      audioElement.pause();
      audioElement.play();
    }
    swingDirection = 'forward';
    swingLedsToMenu();
    var jqThisLamp = jqLiMenuElement.find('.lamp');
    var jqThisMenuBg = jqLiMenuElement.find('.menubg');
    var jqThisContentPage = jqContentPages.filter(
      '.page-' + jqLiMenuElement.data('menuid'));
    jqMenuLamps.not(jqThisLamp)
      .find('img')
      .attr('src', '/images/lampa_inactive.png');
    jqThisLamp.find('img').attr('src', '/images/lampa_animation.gif');
    jqMenuBgs.not(jqThisMenuBg).removeClass('active');
    jqThisMenuBg.addClass('active');
    jqContentPages.not(jqThisContentPage).removeClass('active');
    jqThisContentPage.addClass('active');
  };

  var swingLedsToMenu = function () {
    if (ledTimeoutId) {
      // Clear if there's any running swing
      clearTimeout(ledTimeoutId);
      ledTimeoutId = null;
    }
    litLedId = 0;
    lightUpNextLed();
  };

  var lightUpNextLed = function () {
    var doNextCycle = false;
    litLedId += swingDirection === 'forward' ? 1 : -1;
    if (
      (actualMenuId === maxMenuCount && litLedId === maxMenuCount) ||
      (swingDirection == 'backward' && litLedId === actualMenuId)) {
      doNextCycle = false;
    } else {
      doNextCycle = true;
    }
    if (swingDirection === 'forward' && litLedId === maxMenuCount && doNextCycle) {
      swingDirection = 'backward';
    }
    jqMenuLeds.removeClass('active');
    var jqMenuLedToLight = $(jqMenuLeds.get(litLedId - 1));
    jqMenuLedToLight.addClass('active');
    if (doNextCycle) {
      ledTimeoutId = setTimeout(lightUpNextLed, 30);
    } else {
      ledTimeoutId = null;
    }
  };

  var onReadyDocument = function () {
    // Startup functions
    $('.mainContent').height($(window).height());
    audioElement = $('#beep-three')[0];
    $('#menu-chooser li').click(onClickMenu);
    jqMenuLeds = $('#menu-chooser li .gomb');
    jqMenuLamps = $('#menu-chooser li .lamp');
    jqMenuBgs = $('#menu-chooser li .menubg');
    jqMenuUl = $('#menu-chooser');
    jqContentPages = $('.content-center-wrapper .page');
    maxMenuCount = jqMenuLeds.length;
    $('.page').perfectScrollbar({
      suppressScrollX: true
    });
  };

  // function menuClick(obj){
  //     var src = "images/lampa_animation.gif";
  //     obj.attr('src', src);
  //     var t = setTimeout(function(){
  //         var src = obj.attr('src')=="/images/lampa_animation.gif"?"/images/lampa_active.gif":"images/lampa_active.png";
  //         obj.attr('src', src);
  //         window.location = obj.data('location');
  //     }, 3000);
  // }

  $(document).ready(onReadyDocument);
})(jQuery);
