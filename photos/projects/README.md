# Project photographs

One photograph per project on the Projects page, unlike `photos/work/` which is
a photo stream.

These are **not** picked up automatically, because a project also needs a name,
a location and a category for the filter. To add one:

1. Put the photograph here.
2. Add an entry in `src/data/images.mjs` pointing at it.
3. Add the project in `src/data/projects.mjs` — name, meta, category, image.
4. `npm run images && npm run build`, then `npm run deploy`.

Location is written as the **state only** — "Haryana", "Punjab", "Chandigarh" —
never a street, sector or town.
