# Decks Interior — website

Marketing site for a Dublin bespoke-interiors studio: media walls, kitchens,
bedrooms, wall panelling. Colours and copy follow the client's flyer
(ink `#091624`, deep green `#154d34`→`#13432d`, mint accent `#7ee3ab`).

**Three files, no build step, no dependencies.**

```
index.html      the whole site — one page, sections linked from the nav
thanks.html     the page people land on after sending the enquiry form
images/         photos
```

**There are no prices anywhere on the site, by design.** Enquiries land in the
owner's email; he rings the customer back with a figure. The "How you get a
price" section explains that to the visitor so the missing price list reads as
deliberate rather than as something unfinished.

---

## 1. See it on your machine

```bash
python3 -m http.server 4321
```

Then open <http://localhost:4321>. Every change is live on refresh — there is
nothing to install, compile or restart.

---

## 2. Everything the owner will want to change

All of it is in **one block at the top of `index.html`**, marked `EDIT ME`
(search the file for that phrase):

```js
const CONFIG = {
  phone:     "+353 89 976 0153",
  email:     "decksandfurnitures@gmail.com",
  whatsapp:  "https://wa.me/message/4G7BTPDAHQ4GO1",
  instagram: "...",
  facebook:  "...",
  hours:     "09:00 – 18:00",
  services:  ["Media wall", "Fitted kitchen", ...]   // the form's dropdown
};
```

Change a number there and it updates everywhere — nav, hero, contact section,
WhatsApp buttons, the enquiry dropdown.

Before the site goes live, remove this line from `<head>` so Google can list it:

```html
<meta name="robots" content="noindex">
```

---

## 3. Photos, video clips and the gallery

The gallery on the Work section is driven by one list in the `CONFIG` block — add a
line per item and it appears, with a filter chip, a lightbox and lazy loading:

```js
gallery: [
  {src:"images/work/wardrobe-oak.jpg", cat:"Wardrobes", feature:true,
   caption:"Fitted wardrobe · oak, brass handles"},
  {video:"clips/media-wall.mp4", poster:"images/work/media-wall.jpg",
   cat:"Media walls", caption:"Media wall · marble and slats"}
]
```

- `cat` groups items. Filter buttons appear automatically once there are 2+ categories.
- `feature: true` makes a tile double-size — use it for the best two or three shots.
- Video items play on hover in the grid and with sound controls in the lightbox.
- Photos: roughly 4:5 or landscape, at least 1400px on the long edge.
- Clips: MP4 (H.264), muted, under ~4 MB and under ~10 seconds each. Anything bigger
  makes the page slow on mobile data.

### Where the current photos and clips came from

The client had no photo library, only 78 phone videos. Those were deduplicated to
39 unique clips, surveyed as contact sheets, and the stills were pulled straight out
of the video at full resolution.

There is **no ffmpeg on this machine and the Swift toolchain is broken** (SDK/compiler
mismatch), so the tooling is three small Objective-C programs against AVFoundation,
in `scratchpad/vid/`:

| Tool | Does |
|---|---|
| `grab.m` | Pulls frames at given timestamps, scores each for sharpness |
| `sheet.m` | Builds labelled contact sheets so a whole batch can be reviewed at once |
| `export.m` | Trims a clip, drops the audio track, transcodes to streaming MP4 |

Sharpness scoring matters more than it sounds: handheld phone video is motion-blurred
through most of a pan, so frames are sampled around each chosen moment and the
crispest one wins automatically.

The raw `.mov` files live in `_source-media/` and are gitignored — only the exports
are committed.

**Clips are 640px, muted, 4–5 seconds, 0.7–2 MB each.** They carry `preload="metadata"`,
so a visitor downloads a few KB until they actually hover one.

### Why the hero is two images

Every clip the client supplied is 9:16 portrait, shot handheld and close in. Cropped
to a wide desktop hero, a portrait frame becomes a narrow horizontal band that lands
on a television or a doorway rather than the joinery — four candidates were tested
and all failed the same way.

So `<picture>` serves `hero-portrait.jpg` (his footage, composes perfectly on a phone)
below 860px, and `hero.jpg` above it. `hero.jpg` came from the flyer PDF but **is
his own work** — the same media wall — and is the only well-composed wide shot that
exists. Replace it the moment he takes a landscape photo of a finished job.

## 3b. Logo

`images/logo.svg` is the real mark, **traced from the client's original**
(`_source-media/decks-logo-new.PNG`). That PNG is black on a transparent
background — the shape lives entirely in its alpha channel — so it was
thresholded, contour-traced along the pixel boundary, and simplified with
Douglas-Peucker at a 2px tolerance. 72 points, 1.3 KB, and visually identical
to the original at any size.

It's applied as a **CSS mask**, not an `<img>`, so the single file recolours
to mint, paper or ink wherever it sits — header, footer, thanks page — and it
also serves as the SVG favicon. The mark is very close to square (200 × 198.8),
so keep boxes square when placing it.

To change it, overwrite `images/logo.svg` and every placement updates at once.

## 4. Turning the form on

The enquiry form is plain HTML and doesn't send anywhere until it's pointed at
a form service. It's currently wired for **Netlify Forms** — free, handles the
two optional photo uploads, and gives the client a dashboard as well as email.

### Option A — Netlify (recommended, handles photo uploads)

1. Push this repo to GitHub (already done, see §5).
2. <https://app.netlify.com> → **Add new site → Import an existing project** →
   pick the `decks-interior` repo. Build command: *(leave empty)*.
   Publish directory: `.`
3. Deploy. Netlify finds the form automatically — no code change needed.
4. Site settings → **Forms → Form notifications → Email notification** →
   enter `decksandfurnitures@gmail.com`.

Free tier: 100 enquiries a month, file uploads included. Submissions are also
listed in the dashboard, so nothing is lost if an email is missed.

### Option B — any other host (Vercel, Cloudflare Pages, GitHub Pages)

Those hosts have no built-in form handling, so use **Web3Forms** (free, no
account — you give an email address and they send you an access key):

1. Get a key at <https://web3forms.com>.
2. In `index.html`, find the `<form>` in the hero and change:

```html
<!-- from -->
<form class="panel" name="quote-request" method="POST" action="/thanks.html"
      enctype="multipart/form-data" data-netlify="true" netlify-honeypot="company">
  <input type="hidden" name="form-name" value="quote-request">

<!-- to -->
<form class="panel" method="POST" action="https://api.web3forms.com/submit"
      enctype="multipart/form-data">
  <input type="hidden" name="access_key" value="YOUR-KEY-HERE">
  <input type="hidden" name="redirect" value="https://decksinterior.ie/thanks.html">
```

Check Web3Forms' current file-size limit before relying on the photo uploads.
If attachments aren't on their free plan, delete the two `<input type="file">`
fields — the "send it all on WhatsApp" line under the button already covers it.

**Either way: send yourself a test enquiry before telling the client it's live.**
Check it arrives in his inbox with the phone number and Eircode readable.

---

## 5. GitHub

The repo is already set up and pushed:

<https://github.com/saijaideeppaka-lab/decks-interior>

Normal working loop:

```bash
git add -A
git commit -m "Describe what changed"
git push
```

### Handing the repo over to the client

When the site is finished and paid for:

1. The client makes a free GitHub account.
2. Repo → **Settings → General → Danger Zone → Transfer ownership** →
   type their username.
3. Once transferred the hosted site keeps deploying, but **add the client to
   the hosting account too** (or redeploy from their own account), otherwise
   they can't change anything without you.

Realistically most clients never touch GitHub. The practical handover is:
the hosting login, the form-service login, and this README.

---

## 6. Pointing the Shopify domain at this site

The client owns `decksinterior.ie` through Shopify. A Shopify-bought domain can
point anywhere — you just change its DNS records.

1. **Deploy the site first** (§4). The host gives you a temporary address like
   `decks-interior.netlify.app`. Check the site works there.
2. In the host: **Domains → Add custom domain →** `decksinterior.ie`.
   It shows you the DNS records it wants — usually:
   - an `A` record for `@` pointing at an IP, and
   - a `CNAME` for `www` pointing at `decks-interior.netlify.app`
3. In Shopify: **Settings → Domains →** click `decksinterior.ie` →
   **Domain settings → Edit DNS / Manage DNS**.
4. Delete or edit the existing `A` and `CNAME` records that point at Shopify,
   and enter the ones from step 2.
5. Save. DNS takes 10 minutes to a few hours. The host issues an HTTPS
   certificate automatically once it sees the records.

⚠ **Two warnings.**

- If the client has a live Shopify **store** on that domain, this replaces it.
  Confirm he wants the website at the root.
- Shopify only lets you edit DNS for domains **bought through Shopify**. If he
  bought it elsewhere (Blacknight, GoDaddy…) and merely connected it, the DNS
  lives at the original registrar instead.

---

## 7. What's on the page

| Section | Notes |
|---|---|
| Hero | Headline + enquiry form above the fold. `<picture>` serves a portrait shot to phones and the wide shot to desktop |
| Ticker | Scrolling band of the service names, generated from `CONFIG.services` |
| Why choose us | The 70% stat (counts up on scroll) and four assurances |
| Services | Photo beside a four-row list, so the row isn't four thin sparse columns |
| Work | 14 items across Media walls / Shelving / Wardrobes — 10 stills, 4 hover-play clips |
| How it works | Vertical timeline beside a sticky "Prefer to talk?" card |
| **Founder** | **Placeholder — see below** |
| Contact | Phone, WhatsApp, email, Instagram, Facebook, hours + closing CTA |

### The founder box needs filling in

`<section id="founder">` is a placeholder. Every bit of copy waiting on the
client is wrapped in square brackets — search `index.html` for `[` or for the
class `tbd` and you'll find all of them:

- a one-line quote from him
- his name
- three or four sentences of background
- the three pills: years' experience, based in, specialises in

There's also a dashed photo slot. When he sends a headshot, save it as
`images/founder.jpg` and swap the placeholder div for a real image — the exact
line to paste is in an HTML comment directly above that section.

Until it's filled in the brackets are visible on the page, which is deliberate:
it's obvious at a glance that it's unfinished, so it can't be published by
accident looking half-done.

## 8. Motion

Animations are plain CSS plus one `IntersectionObserver` — no library. Anything
with `data-reveal` springs in when it scrolls into view; `--i` on a child
staggers it. The bounce comes from one variable, `--spring`, at the top of the
stylesheet — turn the `1.35` down towards `1` for a calmer feel, up for more.

All of it is switched off automatically for visitors who have "reduce motion"
turned on in their operating system.

## 9. Checking the page

Open <http://localhost:4321/#selftest> and look at the browser console. It
verifies every phone/email/social link got wired up, the ticker filled, the
service dropdown matches `CONFIG`, the measurements block is open by default,
the scroll reveals are attached, and that no image is missing its `alt` text.
It logs `✓ page self-check passed` or lists what's wrong.

**Unverified — confirm with the client before launch:**

- Hours show `09:00 – 18:00` with no days. Ask which days he actually works.
- "70% of builds completed in a single day" is the flyer's own claim, reused.
- "Free consultation within Dublin" is the flyer's wording.
- "Covering all Ireland" came from his Instagram/WhatsApp profile.
- Delivery of products was on his wish-list but nothing on the page promises
  it yet, because the terms were never specified.
