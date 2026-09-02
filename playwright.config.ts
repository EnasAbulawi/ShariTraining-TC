import { defineConfig, devices } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

/**
 * The environment under test. Override to point the same suite elsewhere:
 *   BASE_URL=https://staging.shari.sa npx playwright test
 */
export const BASE_URL = process.env.BASE_URL ?? 'https://develop.shari.sa/';

/**
 * Cloudflare Access session captured by `npm run auth`. Gitignored — it is a
 * live credential for the develop environment, never commit it.
 */
export const AUTH_FILE = path.join(__dirname, '.auth', 'state.json');

const hasAuthFile = fs.existsSync(AUTH_FILE);

export default defineConfig({
  testDir: './tests',
  globalSetup: './tests/global-setup.ts',

  // No CI-specific retry/forbidOnly split yet: this suite cannot run unattended
  // until there is a Cloudflare Access service token. See tests/README.md.
  fullyParallel: true,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: BASE_URL,
    // Only attach the session when it exists, so a localhost BASE_URL works
    // without one. global-setup.ts is what refuses a gated URL with no session.
    storageState: hasAuthFile ? AUTH_FILE : undefined,

    // Failures should explain themselves — this is a QA repo, and these
    // artifacts are the evidence you attach to a bug report.
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      // 1280px desktop Chrome — matches how landing-page-bugs.md was gathered,
      // so findings stay comparable to that pass.
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 } },
    },
    {
      // landing-page-bugs.md lists mobile/tablet as NOT covered. Defining the
      // project marks that gap even before specs fill it.
      name: 'chromium-mobile',
      use: { ...devices['Pixel 5'] },
    },
  ],
});
