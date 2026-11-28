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

/* ---- Conversion tracking ------------------------------------------------
   Meta's standard events: "Contact" for someone reaching out by call,
   WhatsApp or email, "Lead" for a submitted enquiry form (fired from
   contact.js). Clarity gets the same names so recordings can be filtered to
   "people who tapped Call". Both are guarded: an ad blocker or a build with
   the ids switched off must never break the page. */
(function () {
  'use strict';

  window.siteTrack = function (metaEvent, params, clarityName) {
    try {
      if (typeof window.fbq === 'function') window.fbq('track', metaEvent, params || {});
    } catch (e) {}
    try {
      if (typeof window.clarity === 'function') window.clarity('event', clarityName || metaEvent);
    } catch (e) {}
  };

  document.addEventListener('click', function (event) {
    var link = event.target.closest ? event.target.closest('a[href]') : null;
    if (!link) return;
    var href = link.getAttribute('href') || '';
    var method = null;

    if (href.indexOf('tel:') === 0) method = 'call';
    else if (href.indexOf('wa.me/') !== -1) method = 'whatsapp';
    else if (href.indexOf('mailto:') === 0) method = 'email';
    if (!method) return;

    window.siteTrack('Contact', { method: method, page: location.pathname }, 'click_' + method);
  });
})();


/* ---- Project tile auto-slider ---------------------------------------
   Any .tile-slider gets its .is-active class cycled across its stacked
   slides while the tile is on screen. One IntersectionObserver per tile
   drives start/stop. Reduced motion holds on the first slide and never
   advances. */
(function () {
  'use strict';
  var sliders = document.querySelectorAll('[data-tile-slider]');
  if (!sliders.length) return;
  var reduced =
    window.siteMotion && window.siteMotion.reducedMotion && window.siteMotion.reducedMotion();
  if (reduced) return;
  if (typeof IntersectionObserver !== 'function') return;

  var INTERVAL = 3200; // ms per slide — matches the CSS crossfade budget

  sliders.forEach(function (sliderEl) {
    var slides = sliderEl.querySelectorAll('.tile-slide');
    if (slides.length < 2) return;
    var index = 0;
    var timer = null;

    function advance() {
      slides[index].classList.remove('is-active');
      index = (index + 1) % slides.length;
      slides[index].classList.add('is-active');
    }
    function start() {
      if (timer) return;
      timer = window.setInterval(advance, INTERVAL);
    }
    function stop() {
      if (!timer) return;
      window.clearInterval(timer);
      timer = null;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) start();
          else stop();
        });
      },
      { threshold: 0.25 }
    );
    io.observe(sliderEl);

    // Pause when the tab is hidden so the loop doesn't drift while off-screen.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else if (sliderEl.getBoundingClientRect().top < window.innerHeight) start();
    });
  });
})();
