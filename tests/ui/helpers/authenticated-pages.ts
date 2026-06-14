import type { Page } from '@playwright/test';
import { AdminPage, DashboardPage, ProfilePage } from '../../../src';
import type { RegisteredUser } from '../../api/helpers/auth';
import { expect } from '../fixtures/ui.fixtures';

export async function openDashboard(page: Page, user: RegisteredUser): Promise<DashboardPage> {
  const dashboardPage = new DashboardPage(page);

  await page.addInitScript((token) => localStorage.setItem('token', token), user.token);
  await dashboardPage.open();
  await expect(page).toHaveURL(/\/dashboard\.html$/);

  return dashboardPage;
}

export async function openProfile(page: Page, user: RegisteredUser): Promise<ProfilePage> {
  const profilePage = new ProfilePage(page);

  await page.addInitScript((token) => localStorage.setItem('token', token), user.token);
  await profilePage.open();
  await expect(page).toHaveURL(/\/profile\.html$/);

  return profilePage;
}

export async function openAdminPanel(page: Page, token: string): Promise<AdminPage> {
  const adminPage = new AdminPage(page);

  await page.addInitScript((adminToken) => localStorage.setItem('adminToken', adminToken), token);
  await adminPage.open();
  await expect(page).toHaveURL(/\/admin\.html$/);

  return adminPage;
}
