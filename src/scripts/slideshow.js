/* Auto-advancing photo slideshow.
   Drives every [data-slideshow] on the page — the Home hero board and the
   "On site" gallery share this one implementation.

   Each one needs:
     [data-slideshow]            the container
       [data-interval]           optional, ms between frames (default 5200)
       [data-slide="0..n"]       the stacked layers, first one .is-active
       [data-dots] > [data-dot]  optional progress buttons

   It pauses on hover, on keyboard focus and while the tab is hidden, and it
   does not auto-advance at all under prefers-reduced-motion — the manual
   controls still work there. */
(function () {
  'use strict';

  var reduced = function () {
    return window.siteMotion && window.siteMotion.reducedMotion();
  };

  function initSlideshow(stage) {
    var slides = Array.prototype.slice.call(stage.querySelectorAll('[data-slide]'));
    var dots = Array.prototype.slice.call(stage.querySelectorAll('[data-dot]'));
    if (slides.length < 2) return;

    var interval = Number(stage.getAttribute('data-interval')) || 5200;
    var caption = stage.querySelector('[data-caption-target]');
    var captionIndex = stage.querySelector('[data-caption-index]');
    var current = 0;
    var timer = null;

    var show = function (next) {
      current = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        var on = i === current;
        slide.classList.toggle('is-active', on);
        if (on) slide.removeAttribute('aria-hidden');
        else slide.setAttribute('aria-hidden', 'true');
      });
      dots.forEach(function (dot, i) {
        dot.setAttribute('aria-current', i === current ? 'true' : 'false');
      });

      // The caption line, where there is one. It is aria-hidden: the same text
      // is already the active image's alt, so this would otherwise be read out
      // twice.
      if (caption) caption.textContent = slides[current].getAttribute('data-caption') || '';
      if (captionIndex) captionIndex.textContent = ('0' + (current + 1)).slice(-2);
    };

    var start = function () {
      if (timer || reduced()) return;
      timer = window.setInterval(function () {
        show(current + 1);
      }, interval);
    };

    var stop = function () {
      if (!timer) return;
      window.clearInterval(timer);
      timer = null;
    };

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        // A manual choice restarts the clock rather than cutting away early.
        stop();
        start();
      });
    });

    stage.addEventListener('mouseenter', stop);
    stage.addEventListener('mouseleave', start);
    stage.addEventListener('focusin', stop);
    stage.addEventListener('focusout', start);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else start();
    });

    start();
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-slideshow]'), initSlideshow);
})();
