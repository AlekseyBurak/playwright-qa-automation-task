import { AdminPage } from '../../src';
import { expect, test } from './fixtures/ui.fixtures';
import { openAdminPanel } from './helpers/authenticated-pages';

test.describe('Admin UI', () => {
  test('Admin page renders login form', async ({ page }) => {
    const adminPage = new AdminPage(page);

    await adminPage.open();

    await expect(adminPage.loginForm).toBeVisible();
    await expect(adminPage.emailInput).toBeVisible();
    await expect(adminPage.passwordInput).toBeVisible();
    await expect(adminPage.loginButton).toBeEnabled();
  });

  test('Admin login opens overview panel', async ({ page, adminCredentials }) => {
    const adminPage = new AdminPage(page);

    await adminPage.open();
    await adminPage.login(adminCredentials.email, adminCredentials.password);

    await expect(adminPage.panel).toBeVisible();
    await expect(adminPage.users).toBeVisible();
    await expect(adminPage.userSearchInput).toBeVisible();
  });

  test('Admin login rejects invalid credentials', async ({ page }) => {
    const adminPage = new AdminPage(page);

    await adminPage.open();
    await adminPage.login('invalid-admin@example.com', 'invalid-password');

    await expect(adminPage.loginSection).toBeVisible();
    await expect(adminPage.loginForm).toBeVisible();
  });

  test('Admin user search keeps overview panel available', async ({
    page,
    adminToken,
    sharedUser,
  }) => {
    const adminPage = await openAdminPanel(page, adminToken);

    await adminPage.searchUser(sharedUser.email);

    await expect(adminPage.userSearchInput).toHaveValue(sharedUser.email);
    await expect(adminPage.panel).toBeVisible();
  });

  test('Admin event JSON modal opens and closes when event rows exist', async ({
    page,
    adminToken,
  }) => {
    const adminPage = await openAdminPanel(page, adminToken);

    if ((await adminPage.showEventJsonButtons.count()) === 0) {
      test.skip(true, 'No event rows are available in the current admin overview.');
    }

    await adminPage.showEventJsonButtons.first().click();
    await expect(adminPage.jsonModal.modal).toBeVisible();
    await expect(adminPage.jsonModal.code).toBeVisible();

    await adminPage.jsonModal.close();
    await expect(adminPage.jsonModal.modal).toBeHidden();
  });

  test('Admin logout returns to admin login form', async ({ page, adminToken }) => {
    const adminPage = await openAdminPanel(page, adminToken);

    await adminPage.logout();

    await expect(adminPage.loginSection).toBeVisible();
    await expect(adminPage.loginForm).toBeVisible();
  });
});
