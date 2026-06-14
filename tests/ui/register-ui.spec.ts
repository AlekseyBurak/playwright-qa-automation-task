import { RegisterPage } from '../../src';
import { expect, test } from './fixtures/ui.fixtures';

test.describe('Registration UI', () => {
  test('Registration page renders required account controls', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.open();

    await expect(registerPage.form).toBeVisible();
    await expect(registerPage.nameInput).toBeVisible();
    await expect(registerPage.emailInput).toBeVisible();
    await expect(registerPage.genderSelect).toBeVisible();
    await expect(registerPage.passwordInput).toBeVisible();
    await expect(registerPage.analyticsConsentCheckbox).toBeVisible();
    await expect(registerPage.submitButton).toBeEnabled();
  });

  test('Registration form with empty required fields stays on registration page', async ({
    page,
  }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.open();
    await registerPage.submitButton.click();

    await expect(page).toHaveURL(/\/register\.html$/);
    await expect(registerPage.form).toBeVisible();
  });

  test('Registration login link returns to login page', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.open();
    await registerPage.loginLink.click();

    await expect(page).toHaveURL(/\/index\.html$/);
  });
});
