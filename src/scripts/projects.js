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
