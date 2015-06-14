'use strict';
/*global jQuery*/
/**
 * Made by http://linkedin.com/in/karolyi
 */
(function ($) {
  var zapAudio;
  var hissAudio;
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

  var playHiss = function () {
    if (hissAudio.pause && hissAudio.play) {
      hissAudio.pause();
      hissAudio.play();
    }
    $('#smoke-1').smoke('start');
  };

  var onClickMenu = function () {
    var jqLiMenuElement = $(this);
    actualMenuId = parseInt(jqLiMenuElement.data('menuid'), 10);
    if (zapAudio.pause && zapAudio.play) {
      zapAudio.pause();
      zapAudio.play();
    }
    setTimeout(playHiss, 1800);
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
    swingDirection = 'forward';
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
      ledTimeoutId = setTimeout(lightUpNextLed, 100);
    } else {
      ledTimeoutId = null;
    }
  };

  var onReadyDocument = function () {
    // Startup functions
    $('.mainContent').height($(window).height());
    zapAudio = $('#audio-zap')[0];
    hissAudio = $('#audio-hiss')[0];
    $('#menu-chooser li').click(onClickMenu);
    jqMenuLeds = $('#menu-chooser li .gomb');
    jqMenuLamps = $('#menu-chooser li .lamp');
    jqMenuBgs = $('#menu-chooser li .menubg');
    jqMenuUl = $('#menu-chooser');
    jqContentPages = $('.content-center-wrapper .page');
    maxMenuCount = jqMenuLeds.length;
    $('.page, .gallery-wrapper').perfectScrollbar({
      suppressScrollX: true
    });
    swingLedsToMenu();
    $('#smoke-1').smoke({
      autoStart: false,
      smokeTime: 1000,
      spawnAfter: 10,
      emitterX: 10,
      emitterY: 48,
      particleLifeTime: 2000,
      flyAngle: 80,
      velXMultiplier: 2
    });
  };

  $(document).ready(onReadyDocument);
})(jQuery);
