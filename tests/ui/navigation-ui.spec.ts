import { DashboardPage, LoginPage, ProfilePage } from '../../src';
import { expect, test } from './fixtures/ui.fixtures';
import { openDashboard, openProfile } from './helpers/authenticated-pages';

test.describe('Navigation UI', () => {
  test('Dashboard header profile link opens profile page', async ({ page, sharedUser }) => {
    const dashboardPage = await openDashboard(page, sharedUser);

    await dashboardPage.header.openProfile();

    await expect(page).toHaveURL(/\/profile\.html$/);
  });

  test('Profile header todo link opens dashboard page', async ({ page, sharedUser }) => {
    const profilePage = await openProfile(page, sharedUser);

    await profilePage.header.openTodo();

    await expect(page).toHaveURL(/\/dashboard\.html$/);
  });

  test('User logout returns to login page', async ({ page, sharedUser }) => {
    const dashboardPage = await openDashboard(page, sharedUser);
    const loginPage = new LoginPage(page);

    await dashboardPage.header.logout();

    await expect(page).toHaveURL(/\/index\.html$/);
    await expect(loginPage.form).toBeVisible();
  });

  test('Dashboard route redirects anonymous visitor to login page', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const loginPage = new LoginPage(page);

    await dashboardPage.open();

    await expect(page).toHaveURL(/\/index\.html$/);
    await expect(loginPage.form).toBeVisible();
  });

  test('Profile route redirects anonymous visitor to login page', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    const loginPage = new LoginPage(page);

    await profilePage.open();

    await expect(page).toHaveURL(/\/index\.html$/);
    await expect(loginPage.form).toBeVisible();
  });
});
