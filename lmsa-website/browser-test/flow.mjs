// Browser smoke test — drives local MS Edge headlessly via playwright-core.
// Not committed; harness only. Usage: node browser-test/flow.mjs <email> <password>
//
// Coverage:
//   T35 — auth redirect race fixes (protected routes, welcome state, refresh).
//   T36 — portal flows per docs/13-member-portal-spec.md: homepage member
//         strip → portal, dashboard widgets, profile save round-trip, the
//         cancel-registration dialog (SAFE MODE: only "Keep registration" is
//         clicked — no real registration is ever cancelled), priority-card
//         dismissal persistence, mobile drawer, portal sign-out.
//
// Requires the dev server (npm run dev) and the API running. The profile
// save test performs two net-zero PUTs (append a space, then restore) so it
// exercises the real round-trip without changing the member's data.
import { chromium } from 'playwright-core';
import fs from 'node:fs';

const BASE = process.env.BASE_URL || 'http://localhost:5173';
const SHOTS = new URL('./shots/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
fs.mkdirSync(SHOTS, { recursive: true });

const results = [];
const consoleErrors = [];
function record(name, ok, detail = '') {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
}

const email = process.argv[2];
const password = process.argv[3];

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', (err) => consoleErrors.push(`PAGEERROR: ${err.message}`));

async function shot(name) {
  await page.screenshot({ path: SHOTS + name, fullPage: false });
}

const portalNav = page.getByRole('navigation', { name: 'Portal' });

// ── Test 1: signed-out visitor hitting /portal/dashboard is sent to /login ──
await page.goto(`${BASE}/portal/dashboard`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
const urlAfterProtected = page.url();
const onLoginForm = await page.locator('input[type="email"]').first().isVisible().catch(() => false);
record(
  'signed-out /portal/dashboard -> /login',
  urlAfterProtected.includes('/login') && onLoginForm,
  `landed: ${urlAfterProtected}`
);
await shot('01-protected-redirect.png');

// ── Test 2: signed-out visitor hitting /admin/dashboard is sent to /login ──
await page.goto(`${BASE}/admin/dashboard`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
record(
  'signed-out /admin/dashboard -> /login',
  page.url().includes('/login'),
  `landed: ${page.url()}`
);

// ── Test 3: wrong password shows an error, stays on the form ──
if (email) {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  await page.locator('input[type="email"]').first().fill(email);
  await page.locator('input[type="password"]').first().fill('definitely-not-the-password');
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForTimeout(2500);
  const toast = await page
    .locator('text=/invalid|incorrect|failed|wrong|error/i')
    .first()
    .isVisible()
    .catch(() => false);
  record('wrong password -> visible error, still on /login', toast && page.url().includes('/login'), `url: ${page.url()}`);
  await shot('02-bad-password.png');
} else {
  record('wrong password -> visible error, still on /login', false, 'SKIPPED (no credentials)');
}

// ── Test 4: full happy path (needs real credentials) ──
if (email && password) {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  await page.locator('input[type="email"]').first().fill(email);
  await page.locator('input[type="password"]').first().fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();

  // Welcome state: spinner + "Welcome back" should replace the form.
  const welcomeAppeared = await page
    .locator('text=/welcome back/i')
    .first()
    .isVisible()
    .catch(() => false);
  await page.waitForTimeout(300);
  await shot('03-welcome-state.png');

  const formGone = !(await page.locator('input[type="password"]').first().isVisible().catch(() => false));
  record('welcome state appeared', welcomeAppeared, welcomeAppeared ? 'welcome heading + spinner visible' : 'never saw welcome heading');
  record('form replaced during transition', formGone);

  // Redirect: wait up to 8s for the URL to leave /login.
  try {
    await page.waitForURL((u) => !u.pathname.includes('/login'), { timeout: 8000 });
  } catch {
    /* handled below */
  }
  await page.waitForTimeout(1000); // let the destination settle
  const dest = page.url();
  await shot('04-destination.png');
  record(
    'redirect destination',
    !dest.includes('/login'),
    `landed: ${dest}`
  );

  // Logged-in hard refresh on the destination (regression scenario 1).
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const stillThere = !page.url().includes('/login');
  await shot('05-after-refresh.png');
  record('logged-in refresh keeps session (no bounce)', stillThere, `url: ${page.url()}`);

  // ── T36 portal flows (students only — admin accounts have no member portal) ──
  const isAdminAccount = page.url().includes('/admin');
  if (isAdminAccount) {
    record('portal flows (strip, shell, profile, events, drawer)', false, 'SKIPPED (credentials belong to an admin account)');
  } else {
    // ── Homepage member strip (spec §4.1 / D1: students land on `/`) ──
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const stripVisible = await page
      .getByText(/Welcome back/)
      .first()
      .isVisible()
      .catch(() => false);
    record('homepage member strip visible when signed in', stripVisible);
    await shot('06-member-strip.png');

    const portalLink = page.getByRole('link', { name: /Open your portal/ });
    if (await portalLink.isVisible().catch(() => false)) {
      await portalLink.click();
      try {
        await page.waitForURL('**/portal/dashboard', { timeout: 8000 });
        record('member strip -> portal in one click', true);
      } catch {
        record('member strip -> portal in one click', false, `stuck at: ${page.url()}`);
      }
    } else {
      record('member strip -> portal in one click', false, 'strip link not found');
      await page.goto(`${BASE}/portal/dashboard`, { waitUntil: 'networkidle' });
    }
    await page.waitForTimeout(1500); // dashboard data settle

    // ── Dashboard: priority card, quick actions, door stat cards (§4.5) ──
    const priorityVisible = await page
      .getByText(/This month|Nothing due this month|caught up/)
      .first()
      .isVisible()
      .catch(() => false);
    record('priority card or all-clear visible', priorityVisible);

    const quickActionsOk =
      (await page.getByRole('link', { name: /Register for events/ }).isVisible().catch(() => false)) &&
      (await page.getByRole('link', { name: /Update profile/ }).isVisible().catch(() => false)) &&
      (await page.getByRole('link', { name: /View dues/ }).isVisible().catch(() => false));
    record('quick actions row rendered', quickActionsOk);

    const doorCard = page.getByRole('link', { name: /Events Registered/ });
    const doorIsLink = await doorCard.isVisible().catch(() => false);
    record('stat card is a door (Events Registered links out)', doorIsLink);
    await shot('07-portal-dashboard.png');

    // ── Priority dismissal persists across navigation (D6, sessionStorage) ──
    const dismissButton = page.getByRole('button', { name: /Dismiss this month's priority/ });
    if (await dismissButton.isVisible().catch(() => false)) {
      await dismissButton.click();
      await page.waitForTimeout(300);
      const goneAfterDismiss = !(await page.getByText(/This month/).first().isVisible().catch(() => false));
      await portalNav.getByRole('link', { name: 'My Profile' }).click();
      await page.waitForTimeout(600);
      await portalNav.getByRole('link', { name: 'Dashboard' }).click();
      await page.waitForTimeout(1200);
      const stillGone = !(await page.getByText(/This month/).first().isVisible().catch(() => false));
      record('priority dismissal persists across navigation', goneAfterDismiss && stillGone);
    } else if (priorityVisible) {
      record('priority dismissal persists across navigation', true, 'SKIPPED (all-clear state — nothing to dismiss)');
    } else {
      record('priority dismissal persists across navigation', false, 'no priority card found to dismiss');
    }

    // ── Profile (§4.4): seeded form, read-only email, net-zero save round-trip ──
    await page.getByRole('link', { name: /Update profile/ }).first().click();
    try {
      await page.waitForURL('**/portal/profile', { timeout: 8000 });
      record('quick action -> profile page', true);
    } catch {
      record('quick action -> profile page', false, `stuck at: ${page.url()}`);
      await page.goto(`${BASE}/portal/profile`, { waitUntil: 'networkidle' });
    }
    await page.waitForTimeout(800);

    const nameInput = page.locator('#full-name');
    const seededName = (await nameInput.inputValue().catch(() => '')) || '';
    record('profile form seeded with full name', seededName.trim().length > 0, `value: "${seededName}"`);

    const emailIdentity = await page
      .getByText(/Your email is your sign-in identity/)
      .isVisible()
      .catch(() => false);
    record('email presented as read-only identity', emailIdentity);

    // Net-zero save: append a space to the bio, save (real PUT), then restore.
    // Proves the round-trip + dirty tracking without changing real data.
    const bio = page.locator('#profile-bio');
    const saveButton = page.getByRole('button', { name: /Save changes/ });
    if ((await bio.isVisible().catch(() => false)) && (await saveButton.isDisabled().catch(() => true))) {
      const originalBio = await bio.inputValue();
      if (originalBio.length + 1 <= 500) {
        try {
          await bio.fill(`${originalBio} `);
          const becameDirty = !(await saveButton.isDisabled());
          await saveButton.click();
          await page.getByText('All changes saved').waitFor({ timeout: 8000 });
          await bio.fill(originalBio);
          await saveButton.click();
          await page.getByText('All changes saved').waitFor({ timeout: 8000 });
          const restored = (await bio.inputValue()) === originalBio;
          record(
            'profile save round-trip (PUT /users/me)',
            becameDirty && restored,
            restored ? 'dirty->save->aria-live->restore, net-zero data change' : 'bio did not restore to original'
          );
        } catch (err) {
          record('profile save round-trip (PUT /users/me)', false, `error: ${err.message.split('\n')[0]}`);
        }
      } else {
        record('profile save round-trip (PUT /users/me)', true, 'SKIPPED (bio at max length)');
      }
    } else {
      record('profile save round-trip (PUT /users/me)', false, 'bio field missing or Save unexpectedly enabled');
    }
    await shot('08-profile.png');

    // ── My Events (§4.3): list/empty state + cancel dialog SAFE path ──
    await portalNav.getByRole('link', { name: 'My Events' }).click();
    await page.waitForURL('**/portal/events', { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(1200);

    const eventsHeading = await page.getByRole('heading', { name: 'My Events' }).isVisible().catch(() => false);
    record('sidebar nav -> My Events page loads', eventsHeading);

    const cancelButtons = page.getByRole('button', { name: 'Cancel registration' });
    const cancelCount = await cancelButtons.count();
    if (cancelCount > 0) {
      const rowsBefore = cancelCount;
      await cancelButtons.first().click();
      const dialog = page.getByRole('dialog');
      const dialogShown = await dialog.isVisible().catch(() => false);
      const consequenceNamed =
        dialogShown &&
        (await dialog.getByText(/spot/i).isVisible().catch(() => false)) &&
        (await dialog.getByText(/re-register/i).isVisible().catch(() => false));
      await shot('09-cancel-dialog.png');
      // SAFE MODE: keep the registration — the destructive path is never fired.
      await dialog.getByRole('button', { name: 'Keep registration' }).click();
      await page.waitForTimeout(500);
      const dialogClosed = !(await dialog.isVisible().catch(() => false));
      const rowsAfter = await page.getByRole('button', { name: 'Cancel registration' }).count();
      record(
        'cancel dialog names consequence, keep-path closes intact',
        dialogShown && consequenceNamed && dialogClosed && rowsAfter === rowsBefore,
        `${rowsBefore} registration(s), all kept`
      );
    } else {
      const emptyState = await page
        .getByText(/No upcoming events registered/)
        .isVisible()
        .catch(() => false);
      record(
        'cancel dialog names consequence, keep-path closes intact',
        emptyState,
        'no registrations — empty state verified instead'
      );
    }
    await shot('10-my-events.png');

    // ── Mobile drawer (§4.2): top-bar pattern, Esc, nav-closes ──
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE}/portal/dashboard`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const hamburger = page.getByRole('button', { name: 'Open portal menu' });
    const drawer = page.locator('#portal-sidebar');
    const hamburgerVisible = await hamburger.isVisible().catch(() => false);
    record('mobile top bar with hamburger (floating button gone)', hamburgerVisible);

    if (hamburgerVisible) {
      await hamburger.click();
      await page.waitForTimeout(400);
      const drawerOpen = await drawer.isVisible();
      await shot('11-mobile-drawer.png');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
      const drawerEscClosed = !(await drawer.isVisible());
      record('mobile drawer opens and Esc closes it', drawerOpen && drawerEscClosed);

      await hamburger.click();
      await page.waitForTimeout(400);
      await drawer.getByRole('link', { name: 'My Profile' }).click();
      await page.waitForTimeout(800);
      const navClosedDrawer =
        !(await drawer.isVisible()) && page.url().includes('/portal/profile');
      record('drawer nav click navigates and closes drawer', navClosedDrawer, `url: ${page.url()}`);
    }
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(400);
  }

  // ── Logout via the portal sidebar (regression scenario 3) ──
  const logoutClicked = await (async () => {
    for (const candidate of [
      page.getByRole('button', { name: /sign out|log ?out/i }),
      page.getByRole('link', { name: /sign out|log ?out/i }),
    ]) {
      if (await candidate.first().isVisible().catch(() => false)) {
        await candidate.first().click();
        return true;
      }
    }
    return false;
  })();
  if (logoutClicked) {
    await page.waitForTimeout(2000);
    const loggedOut = !page.url().includes('/portal') && !page.url().includes('/admin');
    await shot('12-after-portal-signout.png');
    record('portal sign-out works, not stuck', loggedOut, `url: ${page.url()}`);

    // And the portal is protected again after sign-out.
    await page.goto(`${BASE}/portal/dashboard`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    record('signed-out portal re-protected after sign-out', page.url().includes('/login'), `landed: ${page.url()}`);
  } else {
    record('portal sign-out works, not stuck', false, 'could not find a sign-out control');
  }
} else {
  record('happy path (welcome -> redirect)', false, 'SKIPPED (no credentials)');
}

// ── Report ──
console.log('\n--- console errors seen during run ---');
const interesting = consoleErrors.filter(
  (e) => !/favicon|Download the React DevTools|net::ERR_FAILED.*supabase/i.test(e)
);
console.log(interesting.length ? interesting.join('\n') : '(none)');
console.log('\nRESULTS: ' + results.filter((r) => r.ok).length + '/' + results.length + ' passed');

await browser.close();
process.exit(results.every((r) => r.ok) ? 0 : 1);
