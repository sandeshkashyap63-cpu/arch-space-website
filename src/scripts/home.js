/* Home: header inversion, hero parallax, hero slideshow, stat count-up. */
(function () {
  'use strict';

  var reduced = function () {
    return window.archSpace && window.archSpace.reducedMotion();
  };

  /* ---- Header state + hero parallax ------------------------------------
     One rAF-throttled scroll listener drives both. */
  var header = document.querySelector('[data-header][data-home]');
  var parallax = document.querySelector('[data-parallax]');

  if (header || parallax) {
    var ticking = false;

    var apply = function () {
      ticking = false;
      var y = window.scrollY;

      if (header) {
        header.classList.toggle('is-scrolled', y > 30);
        // 86vh is where the light Statement section starts.
        header.classList.toggle('is-inverted', y > window.innerHeight * 0.86);
      }

      if (parallax && !reduced()) {
        if (y < window.innerHeight) {
          parallax.style.setProperty('--parallax', (y * 0.07).toFixed(1) + 'px');
        }
      }
    };

    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(apply);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    apply();
  }

  /* ---- Hero slideshow --------------------------------------------------
     Four cross-fading layers. Auto-advance pauses on hover and on keyboard
     focus, and does not run at all under reduced motion — the manual
     controls still work in that case. */
  var stage = document.querySelector('[data-slideshow]');

  if (stage) {
    var slides = Array.prototype.slice.call(stage.querySelectorAll('[data-slide]'));
    var dots = Array.prototype.slice.call(stage.querySelectorAll('[data-dot]'));
    var INTERVAL = 5200;
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
    };

    var start = function () {
      if (timer || reduced() || slides.length < 2) return;
      timer = window.setInterval(function () {
        show(current + 1);
      }, INTERVAL);
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

  /* ---- Stat count-up ---------------------------------------------------
     Final values are already in the markup; this only animates up to them. */
  var statement = document.querySelector('[data-statement]');
  var numbers = Array.prototype.slice.call(document.querySelectorAll('[data-count-to]'));

  if (statement && numbers.length && !reduced() && 'IntersectionObserver' in window) {
    var countUp = function (el) {
      var target = Number(el.getAttribute('data-count-to'));
      var suffix = el.getAttribute('data-count-suffix') || '';
      var pad = el.getAttribute('data-count-pad') === 'true';
      var duration = 1600;
      var started = null;

      var tick = function (now) {
        if (started === null) started = now;
        var k = Math.min(1, (now - started) / duration);
        var eased = 1 - Math.pow(1 - k, 3);
        var value = Math.round(target * eased);
        el.textContent =
          (pad && value < 10 ? '0' + value : String(value)) + (k === 1 ? suffix : '');
        if (k < 1) window.requestAnimationFrame(tick);
      };

      window.requestAnimationFrame(tick);
    };

    var statsObserver = new IntersectionObserver(
      function (entries) {
        var hit = entries.some(function (entry) {
          return entry.isIntersecting;
        });
        if (!hit) return;
        numbers.forEach(countUp);
        statsObserver.disconnect();
      },
      { threshold: 0.4 }
    );

    statsObserver.observe(statement);
  }
})();
