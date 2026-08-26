# Bug Report — Shari Landing Page

- **Environment:** Develop — https://develop.shari.sa/ (behind Cloudflare Access)
- **Tested:** 2026-08-26
- **Browser:** Chrome (desktop, 1280px viewport)
- **Locales checked:** Arabic (default) and English

---

## BUG-01: Revenue stat shows a dangling slash with no currency or period

- Severity: Medium
- Location: "الأداء والتحليلات" / "Performance & Analytics" section — Revenue tile
- Preconditions: Landing page loaded
- Steps: Scroll to the analytics section and read the third stat tile ("الإيرادات" / "Revenue")
- Actual: Value renders as `234 ألف/` in Arabic and `234 K/` in English — the unit ends in a slash with nothing after it
- Expected: A complete unit, e.g. `234 ألف ر.س` (currency) or `234 ألف/شهر` (per period) — no trailing separator
- Notes: The string is hardcoded in the unit span (`<span class="text-[#b4b4b4] ...">ألف/</span>`), and reproduces in both locales, so it is one bad string rather than a missing translation
- Reproducible: Yes, every load, both locales

## BUG-02: Most images have no alt text

- Severity: Medium (accessibility)
- Location: Whole page
- Preconditions: Landing page loaded
- Steps: Inspect all `<img>` elements and check for an `alt` attribute
- Actual: 59 of 75 images have no `alt` attribute
- Expected: Every meaningful image carries a descriptive `alt`; purely decorative images are marked `alt=""` (or `aria-hidden`) so screen readers skip them deliberately
- Reproducible: Yes

## BUG-03: Testimonial names, footer links, and solution bullets are not exposed to assistive tech

- Severity: Medium (accessibility)
- Location: "يثق بنا التجار في المنطقة" (testimonials), footer link columns ("عن شاري" / "الدعم"), "الحل" bullet list
- Preconditions: Landing page loaded
- Steps: Inspect the page's accessibility tree (or navigate the page with a screen reader)
- Actual: The text exists in the DOM — testimonial authors ("أحمد الشمري / مدير التجارة الإلكترونية"), the footer's Terms / Privacy / Security Awareness / Customer Protection links, and all four solution bullets — but none of it surfaces in the accessibility tree. Screen-reader users get testimonials with no attribution and a footer with no navigable links
- Expected: All visible text and links are exposed to assistive technology with correct roles
- Reproducible: Yes

## BUG-04: Language selection is not reflected in the URL

- Severity: Low
- Location: Header language toggle (English / العربية)
- Preconditions: Landing page loaded
- Steps: Switch the language, then check the address bar; copy the URL and open it in a new browser profile
- Actual: The URL stays `https://develop.shari.sa/` in both languages — no `/en` path segment and no `?lang=` parameter. The choice is stored in `localStorage['shari-locale']`, so it persists on reload for that browser only, but a link cannot carry it
- Expected: [Flagged for PO] Confirm whether each locale needs its own addressable URL, so a language can be deep-linked and shared, and so search engines can index both
- Reproducible: Yes

## BUG-05: Placeholder contact details and metrics are live on develop

- Severity: Low
- Location: Footer contact block; hero and social-proof stat rows
- Preconditions: Landing page loaded
- Steps: Read the footer phone number and the stat figures in the hero and "يثق بنا التجار" sections
- Actual: Footer phone reads `+966 11 000 0000`; stats read `+10 تاجر نشط`, `+500 معاملة ناجحة`, `98% معدل الموافقة`
- Expected: [Flagged for PO] Confirm the real contact number and whether these figures are final. Tests should not assert against them until confirmed
- Reproducible: Yes

---

## Verified working

- Language toggle switches both ways and sets `lang` / `dir` correctly (`ar`/`rtl` ↔ `en`/`ltr`)
- Translation coverage on the English page is complete — the only Arabic text remaining is the toggle's own label ("العربية"), which is correct
- Language choice persists across reload via `localStorage['shari-locale']`
- No broken images (0 of 75 failed to load)
- All CTAs point to `/register`; contact links point to `/contact`

## Not a bug — environment only

The page logs 2 console errors for `/manifest.json` (CORS, blocked by `axelerated.cloudflareaccess.com`). This is the Cloudflare Access gate in front of the develop environment, not an application defect. Testers should not log it.
