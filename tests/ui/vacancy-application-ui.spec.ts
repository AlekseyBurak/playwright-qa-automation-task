import { VacancyApplicationPage } from '../../src';
import { testData } from '../api/helpers/test-data';
import { expect, test } from './fixtures/ui.fixtures';

test.describe('Vacancy application UI', () => {
  test('Vacancy application page renders request form controls', async ({ page }) => {
    const vacancyApplicationPage = new VacancyApplicationPage(page);

    await vacancyApplicationPage.open();

    await expect(vacancyApplicationPage.form).toBeVisible();
    await expect(vacancyApplicationPage.fullNameInput).toBeVisible();
    await expect(vacancyApplicationPage.submitButton).toBeEnabled();
  });

  test('Vacancy application form creates access credentials', async ({ page }) => {
    test.skip(
      process.env.RUN_APPLICATION_TESTS !== '1',
      'Application provisioning is opt-in because it creates real admin credentials.',
    );

    const vacancyApplicationPage = new VacancyApplicationPage(page);

    await vacancyApplicationPage.open();
    await vacancyApplicationPage.submitApplication(testData.applicationFullName());

    await expect(vacancyApplicationPage.result).toBeVisible();
    await expect(vacancyApplicationPage.accessKey).toBeVisible();
    await expect(vacancyApplicationPage.adminEmail).toBeVisible();
    await expect(vacancyApplicationPage.adminPassword).toBeVisible();
  });
});
