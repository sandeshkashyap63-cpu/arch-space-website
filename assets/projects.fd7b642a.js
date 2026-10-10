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

/* Projects: discipline filter, mirrored to the URL and announced politely. */
(function () {
  'use strict';

  var bar = document.querySelector('[data-filters]');
  var grid = document.querySelector('[data-grid]');
  var status = document.querySelector('[data-filter-status]');
  if (!bar || !grid) return;

  var buttons = Array.prototype.slice.call(bar.querySelectorAll('[data-filter]'));
  var tiles = Array.prototype.slice.call(grid.querySelectorAll('[data-category]'));
  var valid = buttons.map(function (button) {
    return button.getAttribute('data-filter');
  });

  var reduced = function () {
    return window.siteMotion && window.siteMotion.reducedMotion();
  };

  function apply(category, options) {
    var pushUrl = !options || options.pushUrl !== false;
    var animate = !options || options.animate !== false;
    var shown = 0;

    tiles.forEach(function (tile) {
      var on = category === 'all' || tile.getAttribute('data-category') === category;
      tile.hidden = !on;
      if (!on) return;
      shown += 1;
      if (animate && !reduced()) {
        tile.classList.remove('is-refiltered');
        // Force a reflow so the animation restarts on every filter change.
        void tile.offsetWidth;
        tile.classList.add('is-refiltered');
      }
      // Tiles revealed on scroll may still be at opacity 0 when filtered in.
      tile.classList.add('is-revealed');
    });

    buttons.forEach(function (button) {
      var selected = button.getAttribute('data-filter') === category;
      button.setAttribute('aria-selected', selected ? 'true' : 'false');
      if (selected) grid.setAttribute('aria-labelledby', button.id);
    });

    if (status) {
      var label = category === 'all' ? 'all disciplines' : category;
      status.textContent =
        shown + (shown === 1 ? ' project' : ' projects') + ' shown — ' + label + '.';
    }

    if (pushUrl) {
      var url = new URL(window.location.href);
      if (category === 'all') url.searchParams.delete('category');
      else url.searchParams.set('category', category);
      window.history.replaceState({ category: category }, '', url);
    }
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      apply(button.getAttribute('data-filter'));
    });
  });

  // Left/right arrows move between tabs, per the tablist pattern.
  bar.addEventListener('keydown', function (event) {
    var index = buttons.indexOf(document.activeElement);
    if (index === -1) return;
    var next = null;
    if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = buttons.length - 1;
    if (next === null) return;
    event.preventDefault();
    buttons[next].focus();
    apply(buttons[next].getAttribute('data-filter'));
  });

  // A filtered URL is linkable: ?category=interiors restores that view.
  var initial = new URL(window.location.href).searchParams.get('category');
  if (initial && valid.indexOf(initial) !== -1 && initial !== 'all') {
    apply(initial, { pushUrl: false, animate: false });
  }
})();
