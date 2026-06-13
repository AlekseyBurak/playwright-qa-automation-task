import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { DeleteTodoModalComponent, HeaderComponent, TagsSidebarComponent } from './components';

export class DashboardPage extends BasePage {
  readonly header: HeaderComponent;
  readonly tagsSidebar: TagsSidebarComponent;
  readonly deleteTodoModal: DeleteTodoModalComponent;
  readonly todoForm: Locator;
  readonly todoInput: Locator;
  readonly addTodoButton: Locator;
  readonly todosList: Locator;
  readonly allFilterButton: Locator;
  readonly activeFilterButton: Locator;
  readonly completedFilterButton: Locator;
  readonly loadingMessage: Locator;
  readonly emptyState: Locator;
  readonly pageInfo: Locator;
  readonly previousPageButton: Locator;
  readonly nextPageButton: Locator;
  readonly toastContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.tagsSidebar = new TagsSidebarComponent(page);
    this.deleteTodoModal = new DeleteTodoModalComponent(page);
    this.todoForm = this.byUi('todo-form');
    this.todoInput = this.byUi('todo-input');
    this.addTodoButton = this.byUi('add-todo-button');
    this.todosList = this.byUi('todos-list');
    this.allFilterButton = page.locator('.todo-filter-btn[data-filter="all"]');
    this.activeFilterButton = page.locator('.todo-filter-btn[data-filter="active"]');
    this.completedFilterButton = page.locator('.todo-filter-btn[data-filter="completed"]');
    this.loadingMessage = this.byUi('loading-message');
    this.emptyState = this.byUi('empty-state');
    this.pageInfo = this.byUi('page-info');
    this.previousPageButton = this.byUi('page-prev');
    this.nextPageButton = this.byUi('page-next');
    this.toastContainer = this.byUi('toast-container');
  }

  async open(): Promise<void> {
    await this.goto('/dashboard.html');
  }

  async addTodo(title: string): Promise<void> {
    this.log.info('Adding todo');
    await this.todoInput.fill(title);
    await this.addTodoButton.click();
  }

  todoItems(): Locator {
    return this.todosList.locator('li');
  }
}
