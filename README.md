# Decks Interior

One-page site for a Dublin carpentry / interior design / construction studio.
Single file: `index.html`. No build step, no dependencies.

**Preview:** `python3 -m http.server 4321` in this folder.
**Deploy:** drag this folder onto Vercel or Netlify. It's static.

Shareable draft (system fonts, no photos yet):
https://claude.ai/code/artifact/e401cb49-72bc-4268-8a8d-977714770e14

---

## Real content already in the page

Taken from their Instagram bio and WhatsApp Business profile:

- Positioning: "Timeless & intentional interiors"
- Services, in their own order: Design · Fit-out · Bespoke media walls ·
  Kitchens & bedrooms · Project management
- Dublin based, covering all Ireland · 09:00–18:00
- WhatsApp: `wa.me/message/4G7BTPDAHQ4GO1` (their bio link, so it's the primary CTA)
- Email: `decksandfurnitures@gmail.com`
- Instagram `@decksinterior` · Facebook · Google reviews link

## Still needed

**Photos** — drop into `images/`. Until a file exists its slot shows a blueprint
grid with the filename; nothing breaks.

| File | Ratio | Currently labelled |
|---|---|---|
| `hero.jpg` | 4:5 | Hero — best single shot |
| `work-01.jpg` | 3:2 | Marble media wall |
| `work-02.jpg` | 3:4 | Slatted timber wall |
| `work-03.jpg` | 3:4 | Fitted kitchen |
| `work-04.jpg` | 3:2 | Feature wall with integrated fire |
| `work-05.jpg` | 1:1 | Fitted wardrobes |
| `work-06.jpg` | 1:1 | Full fit-out |
| `studio.jpg` | 4:5 | Team or workshop |

Prefer originals from the client — Instagram recompresses to ~1080px, which
shows on the two wide 3:2 slots.

Match each `<h3>` to whatever photo actually lands in that slot, fill the
`[Location]` / `[Year]` spans (or delete them), and write a real `alt=""` for
each image.

**Unverified, written as sensible defaults — check with the client:**

- The four process steps (Talk / Design / Fit-out / Handover)
- Service descriptions under each heading
- Hours show 09:00–18:00 but not which days
- Phone number isn't on the page — only WhatsApp and email were available

## Design notes

- Type: Archivo (display) · Source Serif 4 (body) · IBM Plex Mono (annotations),
  loaded from Google Fonts. The artifact version swaps in a system stack because
  artifact CSP blocks font CDNs.
- Colour tokens at top of `<style>`; light and dark themes both defined.
- Signature: the dimension line (`.dim`) — a ruled measure with end ticks,
  measuring the gap between "We design," and "we fit out."
