# Penn Golf Club website

A rebuild of [penngolfclub.co.uk](https://www.penngolfclub.co.uk/) using **Eleventy 3** and **Tailwind CSS 4**, hosted on **Netlify**. All the content from the original Club Systems site has been carried over, the club documents are now hosted locally, and the crest has been redrawn as a vector logo.

## Quick start

```bash
nvm use            # Node 22 (see .nvmrc; Node 20+ required)
npm install
npm run dev        # http://localhost:8080 — Eleventy + Tailwind in watch mode
npm run build      # production build into _site/
```

## Project structure

```
src/
  _data/            ← site content as JSON/JS (edit these to update the site)
    site.js           club details, phone numbers, booking links
    navigation.js     main menu
    courseStatus.json course open/closed, restrictions (PL, FM, NT, NB, TG)
    scorecard.json    yardages, pars, SIs, Course & Slope ratings for every tee
    holes.json        optional hole names/descriptions for the course guide
    greenFees.json, membership.json, societies.json, hospitality.json
    events.json       open competitions, diary and results
    officers.json, sponsors.json, documents.json
    handicapTables.js generates Course Handicap tables from scorecard.json
  _includes/        ← layouts and partials (header, footer, forms, gallery…)
  assets/
    brand/            ← redrawn crest SVGs, favicon, app icons
    css/main.css      Tailwind entry point + design tokens
    js/               progressive-enhancement scripts (no framework)
    images/           photography (optimised at build time to AVIF/WebP/JPEG)
  documents/        ← PDFs/Word docs (application form, policies, results…)
  news/posts/       ← news articles in Markdown
  admin/            ← Decap CMS (browser-based editing at /admin/)
  _redirects        ← 301s from every old Club Systems URL
netlify/functions/  ← scheduled daily rebuild
tools/logo/         ← script that generates the crest SVGs
```

## Site map

| Section | Pages |
|---|---|
| The Club | Clubhouse · History · Club Officials · Sponsors · Safeguarding · News |
| The Course *(new section)* | Course Guide (hole by hole) · Scorecard · Course Handicap & WHS Ratings · Course Status & Weather |
| Visitors | Green Fees & Tee Times · Societies · Open Competitions · Open Results · Dress Code |
| Hospitality | Food & Drink · Weddings · Family Occasions · Meeting Room |
| Membership | How to Join · Prices & Offers · PlayMoreGolf · Women in Golf Charter |
| Golf Shop | The Golf Shop · Coaching & Club Fitting |
| Diary · Contact | plus Privacy, Accessibility, 404, sitemap.xml, robots.txt, news feed, diary.ics |

Every old URL (e.g. `/food---drink`, `/membership-prices---offers`, `/scorecard`) has a 301 redirect in `src/_redirects`, so links and search rankings carry over.

## What's new compared with the old site

Built and working:

- **Course status everywhere**: a live status pill in the header of every page, plus a full status page with the restriction key (preferred lies, fairway mats, no trolleys/buggies, temporary greens) and buggy status. Staff update it from the CMS.
- **Live course weather**: current conditions and a 5-day forecast for Penn Common (wind, rain chance, sunset, a plain-English "golf verdict"). Uses Open-Meteo: free, no API key, no cookies.
- **Digital scorecard**: choose tees, enter a Handicap Index, and see the shots received on each hole. Gross scores turn into net scores and Stableford points as you type. The card is saved on the device and can be printed.
- **Course Handicap calculator**: Course Handicap and 95/90/85% Playing Handicaps for all four tee sets, using the WHS formula. The lookup tables are generated from the ratings and match the club's PDF table row for row.
- **Hole-by-hole course guide**: yardage bars for every tee, par and SI, with "tough hole" highlights. Hole names and descriptions can be added in the CMS.
- **Membership finder**: answer two questions (age, when you play) to get the right category, with weekly and monthly costs.
- **Enquiry forms (Netlify Forms)**: membership, society, wedding, party, meeting room, sponsorship and general contact. Each has spam protection and goes to a thank-you page.
- **Newsletter sign-up** in the footer (Netlify Forms; can be connected to Mailchimp etc.).
- **News section** with an Atom feed, and a **diary** with an `.ics` calendar feed people can subscribe to.
- **Society packages and catering menu** published as HTML (previously PDF only), with the PDFs still available to download.
- **Sponsors page** listing every sponsor by name, plus a "become a sponsor" enquiry form.
- **SEO**: GolfCourse/SportsClub structured data, Open Graph tags, canonical URLs, sitemap, redirects.
- **Performance**: responsive AVIF/WebP images, about 20 kB of JavaScript in total, loaded only where needed, no jQuery or Bootstrap.
- **Accessibility**: semantic landmarks, skip link, keyboard-operable menus, focus styles, reduced-motion support, and every page works without JavaScript.
- **Browser-based editing (Decap CMS)**: course status, news, diary/opens, green fees, membership prices, officials and hole descriptions.

### Further ideas for a golf club site (not yet built)

Ideas worth considering, roughly in order of value:

1. **Embedded tee sheet**: BRS offers an embeddable booking widget, so visitors could book without leaving the site.
2. **Live competition leaderboards**: embed HowDidiDo or Golf Genius leaderboards on open days.
3. **Gift vouchers and online payments** (Stripe Checkout): green fees, lessons and society deposits.
4. **Junior section page**: the club is home venue for Staffordshire junior boys, so a page on the junior academy, coaching times and safeguarding would help.
5. **Hole flyovers and photography**: a drone video or photo per hole for the course guide.
6. **Honours boards archive**: digitised winners boards and club champions, searchable by year (a great history asset).
7. **Local rules and course planner**: current local rules, temporary notices and a pace-of-play guide.
8. **Stay & Play**: partner with local hotels for golf-break packages.
9. **Reviews widget**: pull in Google reviews once there are enough to show.
10. **Privacy-friendly analytics**: e.g. Netlify Analytics or Plausible, with no cookie banner needed.

## Editing content

### Without the CMS
Edit the JSON files in `src/_data/` or add Markdown files to `src/news/posts/`, then commit. Netlify rebuilds automatically.

### With the CMS (`/admin/`)
1. In `src/admin/config.yml`, `backend.repo` is set to `stuup/penngolfclub` — change it if the repository moves.
2. Create a GitHub OAuth app (callback URL `https://api.netlify.com/auth/done`) and add its client ID and secret in Netlify under **Site configuration → Access & security → OAuth → Install provider → GitHub**.
3. Give club staff write access to the repository. They log in at `https://www.penngolfclub.co.uk/admin/` with GitHub.

## Deploying to Netlify

1. Push this repo to GitHub and choose **Add new site → Import an existing project** in Netlify. The build settings come from `netlify.toml` (`npm run build` → `_site`, Node 22).
2. **Forms**: Netlify detects the forms automatically. Under **Forms → Form notifications**, send each form to the right inbox (e.g. `society-enquiry` → Golf Shop, `wedding-enquiry` → catering@, `membership-enquiry` → admin@).
3. **Daily rebuild**, so "upcoming" diary entries roll over: create a build hook (**Build & deploy → Build hooks**) and save its URL as the `BUILD_HOOK_URL` environment variable. The scheduled function in `netlify/functions/` calls it at 05:00 every day.
4. Point the domain's DNS at Netlify and enable HTTPS.

## The logo

The only crest online was a 1535 px raster PNG, so it has been **redrawn as a vector** in `src/assets/brand/`:

| File | Use |
|---|---|
| `penn-golf-club-crest.svg` | Primary crest, brand teal `#6B9FA3` (transparent background) |
| `penn-golf-club-crest-badge.svg` | Teal crest on a white disc, for dark or photographic backgrounds |
| `penn-golf-club-crest-white.svg` | White crest for dark backgrounds |
| `penn-golf-club-crest-heath.svg` | Deep heath green `#1E3A34` |
| `penn-golf-club-crest-mono.svg` | `currentColor`; takes the CSS text colour when inlined |
| `favicon.svg`, `icon-*.png`, `apple-touch-icon.png` | Simplified crossed-clubs mark for small sizes |
| `penn-golf-club-crest.png` | 1200 px PNG for social media and email |

Every element, text included, is a true vector path, so the logo needs no fonts. The lettering is set in Arimo Bold (Apache 2.0), which is metrically equivalent to the Arial/Helvetica of the original. The woven knot uses transparent gaps rather than white outlines, so the crest works on any background. To tweak it, edit `tools/logo/generate-logo.mjs` and run `npm run logo`.

## Content to confirm with the club

- **Hole descriptions**: the course guide shows yardages, pars and SIs; add hole names and playing tips via the CMS (`holes.json`).
- **Social media links**: none were on the old site. Add them to `site.social` in `src/_data/site.js` and they appear in the footer.
- **Privacy notice** (`src/privacy.njk`): rewritten for this site, which uses no cookies, Netlify Forms and Open-Meteo. The club should review it.
- **Coaching page**: add the professional's name, lesson prices and booking details.
- **2027 open competition dates**: add them to `events.json` when they're released.
- **Membership weekly cost**: the old site said "under £27 a week", but £1,452 ÷ 52 = £27.92. The new site calculates it from the price.
- **Men's Open date**: the old site listed "Saturday 25th July 2025". The results confirm 2026, so it's corrected here.
