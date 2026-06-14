import { LoginPage } from '../../src';
import { expect, test } from './fixtures/ui.fixtures';

test.describe('Auth UI', () => {
  test('Login page renders email, password and submit controls', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();

    await expect(loginPage.form).toBeVisible();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeEnabled();
  });

  test('Login form rejects invalid credentials and stays on login page', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login('invalid-user@example.com', 'invalid-password');

    await expect(page).toHaveURL(/\/index\.html$/);
    await expect(loginPage.form).toBeVisible();
  });

  test('Login form authenticates registered user and opens dashboard', async ({
    page,
    sharedUser,
  }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login(sharedUser.email, sharedUser.password);

    await expect(page).toHaveURL(/\/dashboard\.html$/);
  });

  test('Register link opens registration page', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.registerLink.click();

    await expect(page).toHaveURL(/\/register\.html$/);
  });
});
