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
