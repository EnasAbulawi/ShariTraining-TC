# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

This is **not a software codebase** — there is no build, lint, or test tooling, and none should be invented. It's a QA documentation repo used for training on the Git/GitHub PR workflow (per `README.md`: "This for Training to Submit the TC to github"), where the content happens to be test-case documentation.

Work here consists of authoring/editing test-case documents and practicing the branch → commit → push → PR flow, not writing or executing code.

## Repo contents

- `SHAR-1643-testcases.md` — Markdown test cases (`TC-01`…`TC-NN`) for the Admin Finance "Cost & Revenue Insights" dashboard. Each entry follows a fixed shape: `## TC-NN: <title>` with `Preconditions`, `Steps`, `Expected` bullets. Items still needing Product Owner input are marked inline with `[Flagged for PO]`.
- `Registration_Flow_Test_Cases.xlsx` — Spreadsheet test cases (`TC_REG_001`…`TC_REG_069`) for the merchant registration flow, with columns `Test Case ID, Module, Scenario Type, Priority, Preconditions, Test Steps, Test Data, Expected Result`. A second sheet, `Legend`, documents the `Scenario Type` color coding (Positive/Negative/Boundary/Localization-AR/Localization-EN/Responsive) and lists open questions for the Product Owner to confirm before execution (e.g. unspecified max lengths, file-size limits, whether the dropdown matches live admin config). Reading this file requires `openpyxl` (`python3 -m pip install openpyxl`) since it's a binary format.
- `README.md` — one-line repo purpose statement.

## Conventions to preserve when editing test cases

- IDs are sequential and zero-padded per file's own scheme (`TC-01`, `TC_REG_001`) — don't renumber existing entries; append new ones at the end of their section/module.
- Items explicitly flagged `[Flagged for PO]` or listed in the `Legend` sheet's open-items notes are known-unresolved — don't silently resolve them by guessing; surface them back to the user/PO.
- Keep the existing column set and ordering in the xlsx unchanged unless asked to restructure it.

## Git/GitHub workflow used here

- Feature work happens on branches off `main` (e.g. `Login-TC`), merged back via PR (`gh pr create --base main --head <branch>`), not direct pushes to `main`.
- Remote auth uses SSH for git operations (`git@github.com:EnasAbulawi/ShariTraining-TC.git`) and OAuth (`gh auth login`, browser flow) for the `gh` CLI's API calls — fine-grained PATs have repeatedly caused permission friction here (missing repo/PR scopes) and should be avoided in favor of `gh auth login`'s OAuth flow.
