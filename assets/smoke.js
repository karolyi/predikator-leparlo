'use strict';
/*global jQuery*/
/**
 * Smoke effect, created from http://codepen.io/seewona/pen/mDIae
 *
 * Updated by László Károlyi, http://linkedin.com/in/karolyi
 */
(function ($) {
  // Assign the proper requestAnimationFrame
  (function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
  })();

  var isSmokeImageLoaded = false;
  var smokeImage = new Image();
  smokeImage.src = '/images/smoke.png';
  smokeImage.onload = function () {
    isSmokeImageLoaded = true;
  };

  var Smoke = function (options) {
    this.options = options;
    this.x = options.emitterX;
    this.y = options.emitterY;

    this.size = 1;
    this.startSize = 32;
    this.endSize = 40;

    this.rotateAngle = Math.random() * 360;
    this.rotationAmount = Math.random() - 0.5;

    this.myStartTime = new Date().getTime();
    this.myLifeTime = 0;

    this.velX = -(Math.sin(((options.flyAngle - 180) / 180 % 1) * Math.PI) * Math.random() * options.velXMultiplier);
    this.velY = Math.sin(((options.flyAngle - 90) / 180 % 1) * Math.PI) * Math.random() * options.velXMultiplier;
    // Add random angle
    this.velX = this.velX + (Math.random() - 0.5) * options.velXMultiplier / 2;
    this.velY = this.velY + (Math.random() - 0.5) * options.velYMultiplier / 2;
  };

  Smoke.prototype.update = function () {
    this.myLifeTime = new Date().getTime() - this.myStartTime;
    this.rotateAngle += this.rotationAmount;

    var lifePercent = (this.myLifeTime / this.options.particleLifeTime);

    this.size = this.startSize + ((this.endSize - this.startSize) * lifePercent * 10);

    this.alpha = Math.max(1 - lifePercent, 0);

    this.x += this.velX;
    this.y += this.velY;
  };

  var initPrivate = function (element, options) {
    var jqElement = $(element);
    options = $.extend({}, options);
    options.ctx = element.getContext('2d');
    options.height = jqElement.height();
    options.width = jqElement.width();
    options.parts = [];
    options.spawnAfter = options.spawnAfter || 40;
    options.lastTime = new Date().getTime() - options.spawnAfter;
    options.particleLifeTime = options.particleLifeTime || Math.min(5000, (options.height / (1.5 * 60) * 1000));
    options.flyAngle = options.flyAngle || 0;
    if ($.type(options.emitterX) === 'undefined') {
      options.emitterX = options.width / 2;
    }
    if ($.type(options.emitterY) === 'undefined') {
      options.emitterY = options.height - 10;
    }
    options.fn = {
      render: render.bind(element),
      start: start.bind(element)
    };
    options.velXMultiplier = options.velXMultiplier || 2;
    options.velYMultiplier = options.velYMultiplier || 1;
    return options;
  };

  var start = function () {
    var options = this._smokePrivateData;
    options.startLife = new Date().getTime();
    options.lastTime = new Date().getTime() - options.spawnAfter;
    options.stopTime = 0;
    if ($.type(options.smokeTime) === 'number') {
      options.stopTime = options.startLife + options.smokeTime;
    }
    options.fn.render();
  };

  var render = function () {
    var options = this._smokePrivateData;
    var partsLen = options.parts.length;
    options.ctx.clearRect(0, 0, options.width, options.height + 10); // ... ?

    while (partsLen--) {
      var partsElement = options.parts[partsLen];
      // if (partsElement.y < 0 || partsElement.myLifeTime > options.particleLifeTime) {
      if (partsElement.myLifeTime > options.particleLifeTime) {
        options.parts.splice(partsLen, 1);
      } else {
        partsElement.update();

        options.ctx.save();
        var offsetX = -partsElement.size / 2;
        var offsetY = -partsElement.size / 2;

        // options.ctx.translate(
        //   partsElement.x + offsetX,
        //   partsElement.y + offsetY);
        options.ctx.translate(
          partsElement.x,
          partsElement.y);
        options.ctx.rotate(partsElement.rotateAngle / 180 * Math.PI);
        options.ctx.globalAlpha = partsElement.alpha;
        options.ctx.drawImage(
          smokeImage, offsetX, offsetY, partsElement.size,
          partsElement.size);
        options.ctx.restore();
        // console.debug('X Y', partsElement.x, partsElement.y);
      }
    }
    var currTime = new Date().getTime();
    if (
      currTime >= options.lastTime + options.spawnAfter &&
      (options.stopTime === 0 || currTime < options.stopTime)
    ) {
      options.lastTime = currTime;
      options.parts.push(new Smoke(options));
    }
    if (options.parts.length) {
      requestAnimationFrame(options.fn.render);
    }
  };

  // var resizeMe = function () {
  //   canvas.height = document.body.offsetHeight;
  // };

  // $(window).ready(resizeMe).resize(resizeMe);

  var jqCallback = function () {
    for (var idx = 0; idx < this.length; idx++) {
      var element = this[idx];
      if ($.type(arguments[0]) === 'object') {
        var passedOptions = arguments[0];
        // Options passed, init time?
        var options = initPrivate(element, passedOptions);
        element._smokePrivateData = options;
        if (passedOptions.autoStart) {
          options.fn.start();
        }
      } else if ($.type(arguments[0]) === 'string') {
        var firstArgument = arguments[0];
        if (firstArgument === 'start') {
          element._smokePrivateData.fn.start();
        }
      }
    }
  };

  $.fn.extend({
    smoke: jqCallback
  });
})(jQuery);
