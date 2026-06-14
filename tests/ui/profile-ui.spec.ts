import { testData } from '../api/helpers/test-data';
import { expect, test } from './fixtures/ui.fixtures';
import { openProfile } from './helpers/authenticated-pages';

test.describe('Profile UI @ui @profile', () => {
  test('Profile page shows current user form fields @positive @smoke @regression', async ({
    page,
    sharedUser,
  }) => {
    const profilePage = await openProfile(page, sharedUser);

    await expect(profilePage.form).toBeVisible();
    await expect(profilePage.emailInput).toHaveValue(sharedUser.email);
    await expect(profilePage.nameInput).toBeVisible();
    await expect(profilePage.submitButton).toBeEnabled();
  });

  test('Profile form updates current user name @positive @regression', async ({
    page,
    sharedUser,
  }) => {
    const profilePage = await openProfile(page, sharedUser);
    const nextName = testData.name();

    await profilePage.updateName(nextName);

    await expect(profilePage.nameInput).toHaveValue(nextName);
  });

  test('Password modal rejects mismatched confirmation @negative @regression', async ({
    page,
    sharedUser,
  }) => {
    const profilePage = await openProfile(page, sharedUser);

    await profilePage.openPasswordModal();
    await expect(profilePage.passwordModal).toBeVisible();

    await profilePage.submitPasswordChange(testData.password(), testData.password());

    await expect(profilePage.passwordModal).toBeVisible();
  });

  test('Password modal can be dismissed without changing page @positive @regression', async ({
    page,
    sharedUser,
  }) => {
    const profilePage = await openProfile(page, sharedUser);

    await profilePage.openPasswordModal();
    await expect(profilePage.passwordModal).toBeVisible();
    await profilePage.cancelPasswordModalButton.click();
    await expect(profilePage.passwordModal).toBeHidden();

    await profilePage.openPasswordModal();
    await expect(profilePage.passwordModal).toBeVisible();
    await profilePage.closePasswordModalButton.click();

    await expect(profilePage.passwordModal).toBeHidden();
    await expect(page).toHaveURL(/\/profile\.html$/);
  });

  test('Profile form saves analytics consent change @positive @regression', async ({
    page,
    sharedUser,
  }) => {
    const profilePage = await openProfile(page, sharedUser);
    const consentBeforeUpdate = await profilePage.analyticsConsentCheckbox.isChecked();

    await profilePage.analyticsConsentCheckbox.setChecked(!consentBeforeUpdate);
    await profilePage.submitButton.click();
    await page.reload();

    await expect(profilePage.analyticsConsentCheckbox).toBeChecked({
      checked: !consentBeforeUpdate,
    });
  });
});
