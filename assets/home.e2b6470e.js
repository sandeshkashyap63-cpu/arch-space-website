/* Shared behaviour: reduced-motion helper, mobile nav, scroll reveal. */
(function () {
  'use strict';

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  /** Single source of truth for "should this move?". */
  window.siteMotion = window.siteMotion || {};
  window.siteMotion.reducedMotion = function () {
    return motionQuery.matches;
  };

  /* ---- Mobile nav ------------------------------------------------------ */
  var toggle = document.querySelector('[data-nav-toggle]');
  var navPanel = document.getElementById('site-nav');

  if (toggle && navPanel) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navPanel.classList.toggle('is-open', open);
    };

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    navPanel.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener('click', function (event) {
      if (
        toggle.getAttribute('aria-expanded') === 'true' &&
        !event.target.closest('.site-header')
      ) {
        setOpen(false);
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) setOpen(false);
    });
  }

  /* ---- Scroll reveal ---------------------------------------------------
     The un-revealed state lives in CSS behind `.js`, so content is visible
     when JS is off. Under reduced motion everything reveals immediately. */
  var targets = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

  var revealAll = function () {
    targets.forEach(function (el) {
      el.style.setProperty('--reveal-delay', '0ms');
      el.classList.add('is-revealed');
    });
  };

  if (!targets.length) {
    // nothing to do
  } else if (!('IntersectionObserver' in window) || motionQuery.matches) {
    revealAll();
  } else {
    var stagger = document.querySelector('.page--home') ? 90 : 80;

    var reveal = function (el, delay) {
      el.style.setProperty('--reveal-delay', delay + 'ms');
      el.classList.add('is-revealed');
      observer.unobserve(el);
    };

    var observer = new IntersectionObserver(
      function (entries) {
        var shown = 0;
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          // Anything earlier in the document that never got its turn — the
          // viewport jumped past it (restored scroll, anchor, fast fling) —
          // is shown straight away, so there is never a blank gap above
          // content that has appeared.
          var index = targets.indexOf(entry.target);
          for (var i = 0; i < index; i++) {
            if (!targets[i].classList.contains('is-revealed')) reveal(targets[i], 0);
          }

          reveal(entry.target, shown * stagger);
          shown += 1;
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );
    targets.forEach(function (el) {
      observer.observe(el);
    });

    // Safety net: if the observer never fires (very short pages, odd
    // viewports), show everything rather than leaving it invisible.
    window.setTimeout(function () {
      targets.forEach(function (el) {
        var box = el.getBoundingClientRect();
        if (box.top < window.innerHeight && !el.classList.contains('is-revealed')) {
          el.classList.add('is-revealed');
          observer.unobserve(el);
        }
      });
    }, 1200);
  }
})();

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

/* Home: header inversion, hero parallax, stat count-up, marquee sizing.
   The hero slideshow itself lives in slideshow.js, shared with the gallery. */
(function () {
  'use strict';

  var reduced = function () {
    return window.siteMotion && window.siteMotion.reducedMotion();
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

  /* ---- Marquee sizing --------------------------------------------------
     A marquee loops by translating the track -50%, which only looks seamless
     while half the track is at least as wide as its container. With few items
     — or on a very wide display — one set is too narrow and a gap swings past.
     Repeat the set (always an even count) until half the track covers the
     container. */
  var marquees = Array.prototype.slice.call(document.querySelectorAll('[data-marquee]'));

  function fillMarquee(track) {
    var container = track.parentElement;
    if (!container || !track.firstElementChild) return;

    var sets = Array.prototype.slice.call(track.children);
    var original = sets[0];
    var setWidth = original.getBoundingClientRect().width;
    if (!setWidth) return;

    var styles = window.getComputedStyle(track);
    var gap = parseFloat(styles.columnGap || styles.gap) || 0;
    var unit = setWidth + gap;
    var needed = Math.max(2, 2 * Math.ceil(container.getBoundingClientRect().width / unit));

    while (track.children.length < needed) {
      var clone = original.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      Array.prototype.forEach.call(clone.querySelectorAll('a, button, input'), function (el) {
        el.setAttribute('tabindex', '-1');
      });
      track.appendChild(clone);
    }
    while (track.children.length > needed && track.children.length > 2) {
      track.removeChild(track.lastElementChild);
    }
  }

  if (marquees.length) {
    var sizeMarquees = function () {
      marquees.forEach(fillMarquee);
    };
    sizeMarquees();
    // Webfonts change the measured width, so re-run once they land.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizeMarquees);

    var resizeTimer = null;
    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(sizeMarquees, 200);
    });
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
