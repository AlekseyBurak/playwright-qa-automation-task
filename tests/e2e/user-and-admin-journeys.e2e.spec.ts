import { AdminPage, DashboardPage, LoginPage, RegisterPage } from '../../src';
import { env } from '../../src/config';
import { testData } from '../api/helpers/test-data';
import { expect, test } from '../ui/fixtures/ui.fixtures';

type UiUser = {
  email: string;
  name: string;
  password: string;
};

test.describe('E2E user and admin journeys', () => {
  test('User registers through UI and creates a todo', async ({ page }) => {
    const user = userForE2e();
    const registerPage = new RegisterPage(page);
    const dashboardPage = new DashboardPage(page);
    const todoTitle = testData.todoTitle();

    await registerPage.open();
    await registerPage.submitRequiredFields(user);

    await expect(page).toHaveURL(/\/dashboard\.html$/);
    await dashboardPage.addTodo(todoTitle);

    await expect(dashboardPage.todoItems().filter({ hasText: todoTitle })).toBeVisible();
  });

  test('User can log out and log back in after registration', async ({ page }) => {
    const user = userForE2e();
    const registerPage = new RegisterPage(page);
    const dashboardPage = new DashboardPage(page);
    const loginPage = new LoginPage(page);

    await registerPage.open();
    await registerPage.submitRequiredFields(user);
    await expect(page).toHaveURL(/\/dashboard\.html$/);

    await expect(dashboardPage.header.logoutButton).toBeVisible();
    await dashboardPage.header.logout();
    await expect(page).toHaveURL(/\/index\.html$/, { timeout: 15_000 });
    await expect(loginPage.form).toBeVisible();

    await loginPage.login(user.email, user.password);

    await expect(page).toHaveURL(/\/dashboard\.html$/);
    await expect(dashboardPage.todoForm).toBeVisible();
  });

  test('Admin logs in, searches users and logs out', async ({ page }) => {
    const adminPage = new AdminPage(page);
    const { email, password } = env.requireTestUser();

    await adminPage.open();
    await adminPage.login(email, password);

    await expect(adminPage.panel).toBeVisible();
    await expect(adminPage.users).toBeVisible();
    await expect(adminPage.userSearchInput).toBeVisible();

    await adminPage.searchUser(email);

    await expect(adminPage.userSearchInput).toHaveValue(email);
    await expect(adminPage.panel).toBeVisible();

    await adminPage.logout();

    await expect(adminPage.loginSection).toBeVisible();
    await expect(adminPage.loginForm).toBeVisible();
  });
});

function userForE2e(): UiUser {
  return {
    email: testData.email(),
    name: testData.name(),
    password: testData.password(),
  };
}
