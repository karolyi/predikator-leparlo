'use strict';
/*global jQuery*/
/**
 * Made by http://linkedin.com/in/karolyi
 */
(function ($) {
  var beepThree;
  var ledTimeoutId;
  var litLedId = 0;
  var swingDirection;
  var maxMenuCount;
  var actualMenuId = 1;
  var jqMenuLeds;

  var onClickMenu = function (event) {
    var jqLiMenuElement = $(this);
    actualMenuId = parseInt(jqLiMenuElement.data('menuid'), 10);
    if (beepThree.pause && beepThree.play) {
      beepThree.pause();
      beepThree.play();
    }
    swingDirection = 'forward';
    swingLedsToMenu();
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
    beepThree = $('#beep-three')[0];
    $('#menu-chooser li').click(onClickMenu);
    jqMenuLeds = $('#menu-chooser li .gomb');
    maxMenuCount = jqMenuLeds.length;
  };

  // function menuClick(obj){
  //     var src = "images/lampa_animation.gif";
  //     obj.attr('src', src);
  //     var t = setTimeout(function(){
  //         var src = obj.attr('src')=="/images/lampa_animation.png"?"/images/lampa_active.gif":"images/lampa_active.png";
  //         obj.attr('src', src);
  //         window.location = obj.data('location');
  //     }, 3000);
  // }

  $(document).ready(onReadyDocument);
})(jQuery);
