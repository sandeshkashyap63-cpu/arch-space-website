# Site photographs

**Put your work-site photos in this folder.** Past jobs, current jobs — anything
you want shown in the "On site" slider on the home page.

## How

1. Drop `.jpg` / `.jpeg` / `.png` files straight into this folder.
2. Run:

   ```bash
   npm run images && npm run build
   ```

3. Deploy with `npm run deploy`.

Nothing else to edit — every image in this folder appears in the slider
automatically.

## Naming matters

**Order** is alphabetical, so prefix numbers to control it:
`01-…`, `02-…`, `03-…`

**The filename becomes the image's description** for screen readers and for
Google, so name files in plain words rather than `IMG_4821.jpg`:

| Filename | Read as |
|---|---|
| `03-sector-17-slab-pour.jpeg` | "Sector 17 slab pour" |
| `04-courtyard-house-brickwork.jpeg` | "Courtyard house brickwork" |
| `IMG_4821.jpeg` | "IMG 4821" ← avoid |

Leading numbers and file extensions are stripped automatically.

## Which photos work best

- **Landscape** photos fit the frame best — it is a wide 16:10 crop, so very
  tall portrait shots lose their top and bottom.
- Aim for at least 1600px wide. Phone photos are fine; the build makes the
  smaller sizes for phones and tablets itself.
- Anything large is resized automatically — no need to shrink them first.

## The two files here now

`01-rebar-and-columns.jpeg` and `02-site-walkthrough.jpeg` are your own
photographs, used as a starting point. Delete them once you have put your own
selection in.
