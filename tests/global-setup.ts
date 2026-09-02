import fs from 'node:fs';
import { AUTH_FILE, BASE_URL } from '../playwright.config';

/** Hosts sitting behind the Cloudflare Access gate, which need a saved session. */
const GATED_HOSTS = ['develop.shari.sa'];

/**
 * Fail fast with an actionable message. Without this, a missing session just
 * redirects every test to the Cloudflare Access login page and you get a pile
 * of confusing "expected heading, got sign-in form" assertion errors instead.
 */
export default function globalSetup() {
  const host = new URL(BASE_URL).hostname;

  if (GATED_HOSTS.includes(host) && !fs.existsSync(AUTH_FILE)) {
    throw new Error(
      `\n${host} is behind Cloudflare Access and no saved session was found at .auth/state.json.\n\n` +
        `Capture one first:\n\n` +
        `    npm run auth\n\n` +
        `A browser opens — sign in through Cloudflare Access, then close the browser.\n` +
        `The session is written to .auth/state.json (gitignored) and reused by every test.\n` +
        `Re-run it whenever the session expires and tests start landing on the login page.\n`
    );
  }
}
