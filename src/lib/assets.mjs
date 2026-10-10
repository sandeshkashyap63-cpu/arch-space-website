/**
 * Content-hashed asset names.
 *
 * The CSS and JS bundles are written as `site.<hash>.css` etc, so the filename
 * changes whenever the contents do. Without that, a browser holding the
 * previous `site.css` keeps using it — GitHub Pages serves these with
 * `max-age=600` and the name gives no hint that anything changed, so a deploy
 * can appear to do nothing for ten minutes or until a hard reload.
 *
 * Pages reference the logical name ('/assets/site.css'); the build registers
 * the hashed one and `asset()` resolves it.
 */
const hashed = new Map();

export function registerAsset(logicalPath, actualPath) {
  hashed.set(logicalPath, actualPath);
}

/** Logical path in, real (hashed) path out. Unregistered paths pass through. */
export function asset(logicalPath) {
  return hashed.get(logicalPath) ?? logicalPath;
}
