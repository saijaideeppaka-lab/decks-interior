# Decks Interior — website

Marketing site for a Dublin bespoke-interiors studio: media walls, kitchens,
bedrooms, wall panelling. Colours and copy follow the client's flyer
(ink `#091624`, mint `#7ee3ab`, deep green `#154d34`).

**Three files, no build step, no dependencies.**

```
index.html      the whole site — one page, sections linked from the nav
thanks.html     the page people land on after sending the booking form
images/         photos
```

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
(search the file for that phrase). It looks like this:

```js
const CONFIG = {
  phone:     "+353 89 976 0153",
  email:     "decksandfurnitures@gmail.com",
  whatsapp:  "https://wa.me/message/4G7BTPDAHQ4GO1",
  ...
  rates: { "Media wall": 650, ... }   // € per m², drives the instant quote
  finishes: { "Standard": 1, "Premium": 1.3, "Luxury": 1.6 }
  extras: { fireplace: 900, led: 350, tvmount: 150 }
}
```

Change a phone number or a rate there and it updates everywhere on the page —
nav, contact section, WhatsApp button, quote calculator, booking dropdowns.

### ⚠ Before this goes live

Two things are **placeholders and must be replaced with real numbers**:

| What | Where |
|---|---|
| Instant-quote rates (€/m², finishes, extras) | `CONFIG` block, top of `index.html` |
| "Price tags" cards (from €2,400, from €55/m² …) | `<section id="pricing">` in `index.html` |

There is a visible warning box on the pricing section saying they're examples.
Delete that box once the real prices are in — search for `⚠ <strong>Placeholder`.

Also remove this line from `<head>` so Google can find the site:

```html
<meta name="robots" content="noindex">
```

---

## 3. Photos

`images/` currently holds five photos **pulled out of the client's flyer PDF**:

| File | What it is | Real work? |
|---|---|---|
| `hero.jpg` | Slatted media wall, marble panel, integrated fire | ✅ yes |
| `media-walls.jpg` | Oak slatted media wall | ✅ yes |
| `kitchens.jpg` | Sage green kitchen | ❌ stock render |
| `bedrooms.jpg` | Green panelled bedroom | ❌ stock render |
| `panelling.jpg` | White moulded panelling | ❌ stock render |

Three of them are stock images the flyer designer used. **Ask the client for
real photos of their own kitchens, bedrooms and panelling** and overwrite the
files, keeping the same names — nothing else needs editing.

Photos should be roughly square or landscape, at least 1200px wide. Originals
from the client's phone, not Instagram downloads (Instagram recompresses).

---

## 4. Turning the forms on

The booking form is plain HTML and doesn't work until it's pointed at a form
service. It's currently wired for **Netlify Forms**, which is free, handles the
two photo uploads, and gives the client an inbox they can log into.

### Option A — Netlify (recommended, handles photo uploads)

1. Push this repo to GitHub (already done, see §5).
2. <https://app.netlify.com> → **Add new site → Import an existing project** →
   pick the `decks-interior` repo. Build command: *(leave empty)*.
   Publish directory: `.`
3. Deploy. Netlify finds the form automatically — no code change needed.
4. Site settings → **Forms → Form notifications → Email notification** →
   enter `decksandfurnitures@gmail.com`.

Free tier: 100 enquiries a month, file uploads included. Submissions are also
listed in the Netlify dashboard, so nothing is lost if an email is missed.

### Option B — any other host (Vercel, Cloudflare Pages, GitHub Pages)

Those hosts have no built-in form handling, so use **Web3Forms** (free, no
account — you enter an email address and they send you an access key):

1. Get a key at <https://web3forms.com>.
2. In `index.html`, find the booking `<form>` and change:

```html
<!-- from -->
<form class="panel" name="consultation" method="POST" action="/thanks.html"
      enctype="multipart/form-data" data-netlify="true" netlify-honeypot="company">
  <input type="hidden" name="form-name" value="consultation">

<!-- to -->
<form class="panel" method="POST" action="https://api.web3forms.com/submit"
      enctype="multipart/form-data">
  <input type="hidden" name="access_key" value="YOUR-KEY-HERE">
  <input type="hidden" name="redirect" value="https://decksinterior.ie/thanks.html">
```

Check Web3Forms' current file-size limit before relying on the photo uploads —
if attachments aren't included on their free plan, delete the two
`<input type="file">` fields and lean on the "send them on WhatsApp" line
that's already under them.

**Either way: send yourself a test enquiry before telling the client it's live.**

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
3. Once transferred, the Netlify (or Vercel) site keeps deploying — but
   **the client should also be added to the hosting account**, or the site
   should be redeployed from their own hosting account, otherwise they can't
   change anything without you.

Realistically, most clients won't touch GitHub. The practical handover is:
give them the hosting login, the form-service login, and this README.

---

## 6. Pointing the Shopify domain at this site

The client owns `decksinterior.ie` through Shopify. A Shopify-bought domain
can point anywhere — you just change its DNS records.

1. **Deploy the site first** (§4). The host gives you a temporary address like
   `decks-interior.netlify.app`. Check the site works there.
2. In the host: **Domains → Add custom domain →** `decksinterior.ie`.
   It will show you the DNS records it wants — usually:
   - an `A` record for `@` pointing at an IP, and
   - a `CNAME` for `www` pointing at `decks-interior.netlify.app`
3. In Shopify: **Settings → Domains →** click `decksinterior.ie` →
   **Domain settings → Edit DNS / Manage DNS**.
4. Delete or edit the existing `A` and `CNAME` records that point at Shopify,
   and enter the ones the host gave you in step 2.
5. Save. DNS takes anywhere from 10 minutes to a few hours. The host issues an
   HTTPS certificate automatically once it sees the records.

⚠ **Two warnings.**

- If the client has a live Shopify **store** on that domain, this replaces it.
  Confirm they want the website at the root and not, say, at `www` with the
  shop somewhere else.
- Shopify only lets you edit DNS for domains **bought through Shopify**. If
  they bought it elsewhere (Blacknight, GoDaddy…) and only connected it to
  Shopify, the DNS lives at the original registrar instead.

Alternative if they'd rather not touch DNS: transfer the domain out of Shopify
to the registrar of your choice. Slower (up to 7 days), rarely worth it.

---

## 7. What's on the page

| Section | Notes |
|---|---|
| Hero | Flyer headline, "Bespoke interiors. Built around you." |
| Why choose us | The 70% stat and four assurances, straight off the flyer |
| Services | Four categories + a note about delivery-only orders |
| Work | Photo gallery, links out to Instagram |
| Pricing | "Price tags" — guide prices ⚠ placeholders |
| Instant quote | Live calculator: type × size × finish + extras → a range |
| Book | Consultation form: name, phone, email, Eircode, dimensions, 2 photos |
| Contact | Phone, WhatsApp, email, Instagram, Facebook, hours |

The instant quote feeds its result into a hidden field on the booking form, so
every enquiry email arrives with the figure the customer was shown.

**Unverified — check with the client before launch:**

- Hours show *Mon–Sat 09:00–18:00*. The flyer only said 09:00–18:00.
- "70% of builds completed in a single day" is the flyer's claim, reused.
- "Free consultation within Dublin" — the flyer's wording; confirm what
  happens outside Dublin (the booking form offers it as an option).
- Delivery is described as free within Dublin, quoted by county elsewhere.
  That was inferred, not stated. Confirm or change it in `<section id="services">`.

## 8. Testing the quote calculator

Open <http://localhost:4321/#selftest> and check the browser console. It runs
five assertions on the pricing maths and logs `✓ quote self-check passed`.
Run it after changing any rate in `CONFIG`.
