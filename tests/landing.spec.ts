import { test, expect, type Page } from '@playwright/test';

/**
 * Landing page — automated regressions for the findings in landing-page-bugs.md.
 *
 * Test titles carry their source id (BUG-NN) so the markdown report and this
 * suite stay cross-referenceable by grep. Items marked [Flagged for PO] in the
 * report get NO assertions — see the skipped block at the bottom.
 */

/** Console errors the report identified as environmental, not app defects. */
const ENVIRONMENTAL_ERRORS = [/manifest\.json/i, /cloudflareaccess/i];

/** Seed the locale before first paint, so the page renders in it directly. */
async function gotoLanding(page: Page, locale: 'ar' | 'en' = 'ar') {
  await page.addInitScript((value) => {
    window.localStorage.setItem('shari-locale', value);
  }, locale);
  await page.goto('/', { waitUntil: 'load' });
}

/** Walk the full page so lazy-loaded images and below-fold sections render. */
async function scrollThroughPage(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 150));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState('networkidle');
}

test.describe('landing page', () => {
  test('BUG-01: no stat value ends in a dangling separator', async ({ page }) => {
    // Known open defect: the revenue tile renders "234 ألف/" (AR) and "234 K/"
    // (EN) — a unit ending in a slash with nothing after it. Expected to fail
    // until fixed; if it starts passing, Playwright flags that so this pin can
    // be converted into a normal assertion.
    test.fail(true, 'BUG-01 is open — revenue tile unit ends in "/"');

    await gotoLanding(page, 'ar');
    await scrollThroughPage(page);

    // Selector-independent on purpose: any short numeric label ending in "/" is
    // the defect, so this survives Tailwind class churn in the tile markup.
    const dangling = await page.evaluate(() => {
      const hits = new Set<string>();
      for (const el of document.querySelectorAll('p, span, div, h1, h2, h3, h4')) {
        const text = (el.textContent ?? '').trim();
        if (!text || text.length > 40) continue;
        if (/\d/.test(text) && /\/$/.test(text)) hits.add(text);
      }
      return [...hits];
    });

    expect(dangling, 'stat values must carry a complete unit, not a trailing "/"').toEqual([]);
  });

  test('every image carries an alt attribute', async ({ page }) => {
    await gotoLanding(page);
    await scrollThroughPage(page);

    // A deliberate alt="" on a decorative image is correct and passes here; the
    // defect would be a missing attribute entirely.
    const missingAlt = await page.evaluate(() =>
      [...document.images].filter((img) => !img.hasAttribute('alt')).map((img) => img.currentSrc || img.src)
    );

    expect(missingAlt, 'images missing the alt attribute').toEqual([]);
  });

  test('no broken images', async ({ page }) => {
    await gotoLanding(page);
    await scrollThroughPage(page);

    const broken = await page.evaluate(() =>
      [...document.images]
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.currentSrc || img.src)
    );

    expect(broken, 'images that failed to load').toEqual([]);
  });

  test('language toggle flips lang and dir, and the choice persists', async ({ page }) => {
    await gotoLanding(page, 'ar');

    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'ar');
    await expect(html).toHaveAttribute('dir', 'rtl');

    // The toggle is a header control labelled with the *other* language.
    const toEnglish = page.getByRole('button', { name: /english/i }).or(page.getByRole('link', { name: /english/i }));
    await toEnglish.first().click();

    await expect(html).toHaveAttribute('lang', 'en');
    await expect(html).toHaveAttribute('dir', 'ltr');
    expect(await page.evaluate(() => localStorage.getItem('shari-locale'))).toBe('en');

    // Persists across reload for the same browser (BUG-02 covers the fact that
    // it is NOT reflected in the URL — that one is [Flagged for PO], not here).
    await page.reload({ waitUntil: 'load' });
    await expect(html).toHaveAttribute('lang', 'en');

    // And back to Arabic.
    const toArabic = page.getByRole('button', { name: 'العربية' }).or(page.getByRole('link', { name: 'العربية' }));
    await toArabic.first().click();
    await expect(html).toHaveAttribute('lang', 'ar');
    await expect(html).toHaveAttribute('dir', 'rtl');
  });

  test('no unexpected console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() !== 'error') return;
      const text = msg.text();
      if (ENVIRONMENTAL_ERRORS.some((pattern) => pattern.test(text))) return;
      errors.push(text);
    });

    await gotoLanding(page);
    await scrollThroughPage(page);

    expect(errors, 'console errors beyond the known Cloudflare Access ones').toEqual([]);
  });

  /**
   * BUG-03 — [Flagged for PO]. The footer phone (+966 11 000 0000) and the hero
   * metrics (+500 transactions / 98% approval / +10 merchants) are unconfirmed
   * placeholders. The report states outright that tests must not assert against
   * them until Product confirms. Kept as a visible skip so the gap shows up in
   * every run instead of being silently absent.
   */
  test.skip('BUG-03: footer contact and hero metrics match confirmed values', async () => {
    // Unskip once PO confirms the real phone number and whether the figures are
    // final, then assert on the confirmed values.
  });
});
