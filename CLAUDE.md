# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A QA repo with two halves:

1. **Test-case documentation** — the original and still primary content. Markdown and xlsx test cases, plus bug reports. This is the source of truth for what gets tested.
2. **An executable Playwright suite** (`tests/`) that automates the parts of that documentation worth re-running.

It also serves as training for the Git/GitHub PR workflow (per `README.md`: "This for Training to Submit the TC to github"), so work here still goes through the branch → commit → push → PR flow.

There is deliberately **no build or lint tooling** — don't invent any. Test tooling, however, now exists: `npx playwright test` runs the suite (see `tests/README.md`). Running it against develop requires a saved Cloudflare Access session captured with `npm run auth`; without it, `tests/global-setup.ts` fails fast with instructions.

## Repo contents

- `SHAR-1643-testcases.md` — Markdown test cases (`TC-01`…`TC-NN`) for the Admin Finance "Cost & Revenue Insights" dashboard. Each entry follows a fixed shape: `## TC-NN: <title>` with `Preconditions`, `Steps`, `Expected` bullets. Items still needing Product Owner input are marked inline with `[Flagged for PO]`.
- `Registration_Flow_Test_Cases.xlsx` — Spreadsheet test cases (`TC_REG_001`…`TC_REG_069`) for the merchant registration flow, with columns `Test Case ID, Module, Scenario Type, Priority, Preconditions, Test Steps, Test Data, Expected Result`. A second sheet, `Legend`, documents the `Scenario Type` color coding (Positive/Negative/Boundary/Localization-AR/Localization-EN/Responsive) and lists open questions for the Product Owner to confirm before execution (e.g. unspecified max lengths, file-size limits, whether the dropdown matches live admin config). Reading this file requires `openpyxl` (`python3 -m pip install openpyxl`) since it's a binary format.
- `SHAR-1523-testcases.md` — same markdown shape as above, for its own ticket.
- `landing-page-bugs.md` — bug report from a manual pass over `https://develop.shari.sa/` (2026-08-26), with screenshots in `evidence/`. Includes an "investigated and confirmed NOT defects" table so settled questions aren't re-raised, and a "not covered by this pass" note. The Playwright seed suite is derived from this file.
- `README.md` — one-line repo purpose statement.
- `tests/` — the Playwright suite. `tests/README.md` is the runbook; `playwright.config.ts` holds `BASE_URL` (defaults to develop) and the desktop/mobile projects.
- `.playwright-mcp/` — page snapshots and console logs from interactive Playwright **MCP** browser sessions (Claude driving a live browser). Gitignored, unrelated to the `tests/` suite; don't confuse the two.

## Conventions to preserve when editing test cases

- IDs are sequential and zero-padded per file's own scheme (`TC-01`, `TC_REG_001`) — don't renumber existing entries; append new ones at the end of their section/module.
- Items explicitly flagged `[Flagged for PO]` or listed in the `Legend` sheet's open-items notes are known-unresolved — don't silently resolve them by guessing; surface them back to the user/PO.
- Keep the existing column set and ordering in the xlsx unchanged unless asked to restructure it.

## Playwright conventions

The suite exists to serve the documentation, so the docs' rules about unresolved items carry over into code:

- **Traceability.** A test derived from a written case or bug carries that id in its title (`BUG-01: …`, `TC_REG_001: …`), so markdown and automation stay greppable against each other.
- **Never assert on `[Flagged for PO]` items.** The same rule as the docs: don't guess an expected value to make a test pass. Write it as a `test.skip()` whose title states what needs confirming, so the gap is visible in every run.
- **Pin known-open defects with `test.fail()`** rather than deleting or skipping them. A red run then never masks a *new* break, and when the fix ships Playwright reports "expected to fail but passed" — the cue to convert the pin into a real assertion.
- **Prefer role/text locators over Tailwind class names**, which churn in this app.
- Never commit `.auth/state.json` — it's a live credential for develop.

## Git/GitHub workflow used here

- Feature work happens on branches off `main` (e.g. `Login-TC`), merged back via PR (`gh pr create --base main --head <branch>`), not direct pushes to `main`.
- Remote auth uses SSH for git operations (`git@github.com:EnasAbulawi/ShariTraining-TC.git`) and OAuth (`gh auth login`, browser flow) for the `gh` CLI's API calls — fine-grained PATs have repeatedly caused permission friction here (missing repo/PR scopes) and should be avoided in favor of `gh auth login`'s OAuth flow.
