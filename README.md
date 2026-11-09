# Awan Brothers Services: Website

Static HTML/CSS/JS website for **awanbrothers.services**. It has no build step and no framework. Open `index.html` in a browser, or upload the folder to any web host.

## Pages

| File | Page |
|---|---|
| `index.html` | Home: hero with quick-quote form, services, TMS showcase, process, coverage, industries |
| `services.html` | Services in detail (Import, Export, Transport, Haulage, Heavy Vehicles & Earth Moving, Labour) and vehicle types |
| `tms.html` | Company's own Transport Management System: features, benefits, FAQ |
| `about.html` | Company story, mission/vision/values, location advantages |
| `track.html` | Shipment tracking (**demo data**; try `AB-482915` or `AB-482841`) |
| `quote.html` | Request a Quote form (**demo**: no backend yet) |
| `contact.html` | Contact details, message form (**demo**), Google Map |
| `credits.html` | Photo licences and attribution (required by the image licences, so keep it) |

## Folder structure

```
assets/
  css/style.css    all styles (brand colours are at the top as CSS variables)
  js/main.js       menu, animations, form handling, tracking demo
  img/             logos, favicons and photos
robots.txt, sitemap.xml
```

## Before going live

1. **Connect the forms.** Quote and contact forms currently only *pretend* to send.
   In `assets/js/main.js`, replace the body of `submitForm()` with a real request,
   for example a POST to Formspree, Web3Forms, or your own PHP/Node endpoint.
   Then remove the "Demo mode" notes from `quote.html` and `contact.html`.
2. **Connect tracking.** `track.html` generates sample journeys. Point it at the TMS API in `main.js` (the "Shipment tracking (DEMO)" section).
3. **Check these details:**
   - `+92-301-823993` has one digit fewer than a normal Pakistani mobile number. Confirm it.
   - The WhatsApp button and header "Call us" use `+92-300-2087527`.
   - The Google Map searches for "Jokia Market, Bin Qasim Town". Replace it with the exact pin if needed.
   - The About page story is a generic draft. Add real history (founding year, fleet size, clients).
   - The TMS dashboard numbers on the Home and TMS pages are illustrative sample data.
4. The header, footer and top bar are repeated in every page, so edit all pages when changing them.

## Images

Photos are from Wikimedia Commons under free licences (Free Art License, CC BY, CC BY-SA). They allow commercial use **with attribution**, which `credits.html` provides. Icons are from [Lucide](https://lucide.dev) (ISC), loaded from unpkg. Fonts are Barlow Semi Condensed and Inter from Google Fonts.
