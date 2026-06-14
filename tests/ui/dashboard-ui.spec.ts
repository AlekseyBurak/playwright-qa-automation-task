import { testData } from '../api/helpers/test-data';
import { expect, test } from './fixtures/ui.fixtures';
import { openDashboard } from './helpers/authenticated-pages';

test.describe('Dashboard UI', () => {
  test('Dashboard opens for authenticated user and shows todo controls', async ({
    page,
    sharedUser,
  }) => {
    const dashboardPage = await openDashboard(page, sharedUser);

    await expect(dashboardPage.todoForm).toBeVisible();
    await expect(dashboardPage.todoInput).toBeVisible();
    await expect(dashboardPage.addTodoButton).toBeEnabled();
    await expect(dashboardPage.allFilterButton).toBeVisible();
    await expect(dashboardPage.activeFilterButton).toBeVisible();
    await expect(dashboardPage.completedFilterButton).toBeVisible();
  });

  test('Dashboard adds todo and shows it in todo list', async ({ page, sharedUser }) => {
    const dashboardPage = await openDashboard(page, sharedUser);
    const title = testData.todoTitle();

    await dashboardPage.addTodo(title);

    await expect(dashboardPage.todoItems().filter({ hasText: title })).toBeVisible();
  });

  test('Tags sidebar toggle remains available on dashboard', async ({ page, sharedUser }) => {
    const dashboardPage = await openDashboard(page, sharedUser);

    await expect(dashboardPage.tagsSidebar.toggleButton).toBeVisible();
    await dashboardPage.tagsSidebar.open();

    await expect(dashboardPage.todoForm).toBeVisible();
  });

  test('Dashboard keeps empty todo submission out of todo list', async ({ page, sharedUser }) => {
    const dashboardPage = await openDashboard(page, sharedUser);
    const todosBeforeSubmit = await dashboardPage.todoItems().count();

    await dashboardPage.addTodo('');

    await expect(dashboardPage.todoItems()).toHaveCount(todosBeforeSubmit);
    await expect(page).toHaveURL(/\/dashboard\.html$/);
  });

  test('Dashboard filters completed todo out of active list', async ({ page, sharedUser }) => {
    const dashboardPage = await openDashboard(page, sharedUser);
    const title = testData.todoTitle();

    await dashboardPage.addTodo(title);
    const todoItem = dashboardPage.todoItems().filter({ hasText: title });
    await expect(todoItem).toBeVisible();

    await todoItem.locator('input[type="checkbox"]').check();
    await dashboardPage.activeFilterButton.click();

    await expect(todoItem).toBeHidden();

    await dashboardPage.completedFilterButton.click();
    await expect(dashboardPage.todoItems().filter({ hasText: title })).toBeVisible();
  });

  test('Dashboard delete modal cancel keeps todo and confirm removes todo', async ({
    page,
    sharedUser,
  }) => {
    const dashboardPage = await openDashboard(page, sharedUser);
    const title = testData.todoTitle();

    await dashboardPage.addTodo(title);
    const todoItem = dashboardPage.todoItems().filter({ hasText: title });
    await expect(todoItem).toBeVisible();

    await todoItem.locator('button').last().click();
    await expect(dashboardPage.deleteTodoModal.modal).toBeVisible();
    await dashboardPage.deleteTodoModal.cancel();
    await expect(todoItem).toBeVisible();

    await todoItem.locator('button').last().click();
    await dashboardPage.deleteTodoModal.confirm();
    await expect(dashboardPage.todoItems().filter({ hasText: title })).toBeHidden();
  });

  test('Dashboard tag sidebar opens and closes without leaving dashboard', async ({
    page,
    sharedUser,
  }) => {
    const dashboardPage = await openDashboard(page, sharedUser);

    await dashboardPage.tagsSidebar.open();
    await expect(dashboardPage.tagsSidebar.sidebar).toBeVisible();
    await expect(dashboardPage.tagsSidebar.nameInput).toBeVisible();

    await dashboardPage.tagsSidebar.close();
    await expect(page).toHaveURL(/\/dashboard\.html$/);
    await expect(dashboardPage.todoForm).toBeVisible();
  });
});
