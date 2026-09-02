# Playwright suite

Automated checks against the Shari front end. The written test cases in the repo
root stay the source of truth; this suite automates the parts worth re-running.

## One-time setup

```bash
npm install
npx playwright install chromium
```

## Capture a login session (required for develop)

`https://develop.shari.sa/` sits behind Cloudflare Access, so tests need a saved
browser session:

```bash
npm run auth
```

A browser opens — sign in through Cloudflare Access, then close it. The session
is written to `.auth/state.json` and reused by every test.

`.auth/` is gitignored. **Never commit it** — it is a live credential for
develop. Re-run `npm run auth` when the session expires (tests will fail with a
message telling you to).

## Running

```bash
npm test                                  # whole suite, both projects
npm run test:ui                           # visual runner with watch mode — best for authoring
npm run test:headed                       # watch a real browser drive itself
npm test -- --project=chromium-desktop    # one project only
npm test -- -g "BUG-01"                   # filter by test title
npm run report                            # open the HTML report from the last run
```

Point the suite at another environment with `BASE_URL`:

```bash
BASE_URL=https://staging.shari.sa npm test
```

## Reading the output

- `test-results/` — traces, screenshots, and video for failures (gitignored).
- `playwright-report/` — the HTML report `npm run report` opens (gitignored).

Failure artifacts are the evidence to attach to a bug report. To keep one
permanently, copy it into `evidence/` and reference it from the bug markdown,
the way `landing-page-bugs.md` does.

## Conventions

- **Traceability.** A test that comes from a written case or bug carries its id
  in the title (`BUG-01: …`, `TC_REG_001: …`), so markdown and automation can be
  cross-referenced by grep.
- **Never assert on `[Flagged for PO]` items.** Where the expected behaviour
  isn't confirmed, the repo's rule is to flag it, not guess it. Encode that as a
  `test.skip()` whose title states what needs confirming — the gap stays visible
  in every run. Do not invent an expected value to make a test go green.
- **Pin known-open defects with `test.fail()`.** An open bug gets a test that is
  expected to fail, so a red run never hides a *new* break. When the fix lands,
  Playwright reports "expected to fail but passed" — that's the signal to
  convert the pin into a normal assertion.
- **Prefer role- and text-based locators** over Tailwind class names, which churn.

## Not covered yet

- Mobile/tablet viewports beyond the `chromium-mobile` project stub.
- `/register`, `/contact`, and the footer policy pages.
- The 69 registration cases in `Registration_Flow_Test_Cases.xlsx`.
- CI. Unattended runs need a Cloudflare Access **service token**
  (`CF-Access-Client-Id` / `CF-Access-Client-Secret` headers) — a saved browser
  session can't be refreshed by a runner.
