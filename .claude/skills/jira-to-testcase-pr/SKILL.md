---
name: jira-to-testcase-pr
description: Generate a test-case markdown file for a Jira ticket (SHAR-NNNN) and open a PR for it in this repo. Use when the user gives a Jira ticket key and asks for test cases, or asks to turn a ticket into test cases and submit them via the repo's branch/PR workflow.
---

# Jira ticket → test cases → PR

This repo (`ShariTraining-TC`) is QA documentation used to practice the Git/GitHub PR workflow — see the repo's `CLAUDE.md` for full context. This skill captures the end-to-end steps used to go from a Jira ticket to a merged-ready PR of test cases.

## 1. Fetch the ticket

- Get the Atlassian cloud ID once per session: call `getAccessibleAtlassianResources` (no args) and use the returned `id` as `cloudId` for subsequent calls.
- Fetch the ticket: `getJiraIssue` with `cloudId`, `issueIdOrKey: "SHAR-NNNN"`, `fields: ["*all"]`, `responseContentFormat: "markdown"`.
- Read: `summary`, `description` (this is where acceptance criteria usually live), `parent` (epic context), and `comment.comments` — **comments frequently contain open concerns, blockers, or scope changes that aren't reflected in the description** (e.g. "postponed until X", "needs validation against Y"). Treat these as must-surface, not skippable.

## 2. Write the test-case file

Follow the conventions in this repo's `CLAUDE.md`:

- One file per ticket: `SHAR-NNNN-testcases.md` in the repo root.
- Header: `# Test Cases — SHAR-NNNN: <ticket summary>`. If there's an epic parent or a referenced spec ticket (e.g. SLA targets defined in a separate ticket), note it right under the header.
- Each case: `## TC-NN: <title>` with `- Preconditions:`, `- Steps:`, `- Expected:` bullets. Zero-pad and number sequentially starting at `TC-01` within the new file.
- Cover, in order: the happy-path/core behavior described in the acceptance criteria; then boundary conditions; then edge cases the spec doesn't explicitly address.
- **Never silently resolve ambiguity.** Any case where the ticket's acceptance criteria don't specify the expected behavior, or where a comment flagged an open concern, gets written as a real test case with `[Flagged for PO]` in its Expected line explaining exactly what needs confirmation. Do not guess an answer and present it as fact.
- If the ticket's own comments raise a scope/validity concern (postponement, dependency on other work, "needs validation against X flow"), add a dedicated test case for it near the end, also flagged, rather than burying it in a note.

## 3. Branch, commit, push, PR

```bash
git checkout main && git pull
git checkout -b SHAR-NNNN-testcases
git add SHAR-NNNN-testcases.md
git commit -m "Add test cases for SHAR-NNNN: <short summary>"
git push -u origin SHAR-NNNN-testcases
gh pr create --base main --head SHAR-NNNN-testcases \
  --title "Add test cases for SHAR-NNNN: <short summary>" \
  --body "Summary of what's covered + call out how many cases are [Flagged for PO] and why."
```

Use a fresh branch per ticket rather than piling onto an unrelated open PR/branch.

## Auth prerequisites (one-time, per machine)

This repo's workflow needs both of these working — see `CLAUDE.md` for the full rationale:

- **Git operations (clone/push/pull):** SSH. Check with `git remote -v` (should be `git@github.com:...`, not `https://`). If not, add an SSH key and `git remote set-url origin git@github.com:<owner>/<repo>.git`.
- **`gh` CLI (API calls: `gh pr create`, etc.):** OAuth login, not a manually-scoped fine-grained PAT. Run `gh auth login` → GitHub.com → HTTPS or SSH → "Login with a web browser". Fine-grained PATs created via the tokens page have repeatedly caused `403`/`GraphQL: Resource not accessible` errors in this repo from missing Contents/Pull-requests scopes — prefer OAuth to sidestep that entirely.

Quick health check before starting: `gh auth status` (look for a `gho_...` token, not `github_pat_...`) and `git remote -v` (look for `git@github.com`).
