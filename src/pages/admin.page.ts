import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { AdminJsonModalComponent } from './components';

export class AdminPage extends BasePage {
  readonly loginForm: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly loginError: Locator;
  readonly loginSection: Locator;
  readonly panel: Locator;
  readonly users: Locator;
  readonly userSearchInput: Locator;
  readonly pagination: Locator;
  readonly logoutButton: Locator;
  readonly overviewError: Locator;
  readonly showEventJsonButtons: Locator;
  readonly jsonModal: AdminJsonModalComponent;

  constructor(page: Page) {
    super(page);
    this.loginForm = this.byUi('admin-login-form');
    this.emailInput = this.byUi('admin-email');
    this.passwordInput = this.byUi('admin-password');
    this.loginButton = this.submitButtonIn(this.loginForm);
    this.loginError = this.byUi('admin-login-error');
    this.loginSection = this.byUi('admin-login-section');
    this.panel = this.byUi('admin-panel');
    this.users = this.byUi('admin-users');
    this.userSearchInput = this.byUi('admin-user-search');
    this.pagination = this.byUi('admin-pagination');
    this.logoutButton = this.byUi('admin-logout');
    this.overviewError = this.byUi('admin-overview-error');
    this.showEventJsonButtons = this.byUi('admin-show-event-json');
    this.jsonModal = new AdminJsonModalComponent(page);
  }

  async open(): Promise<void> {
    await this.goto('/admin.html');
  }

  async login(email: string, password: string): Promise<void> {
    this.log.info('Submitting admin login form', { email });
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async searchUser(email: string): Promise<void> {
    this.log.info('Searching admin users');
    await this.userSearchInput.fill(email);
  }

  async logout(): Promise<void> {
    this.log.info('Logging out from admin panel');
    await this.logoutButton.click();
  }

  userCards(): Locator {
    return this.users.locator('article');
  }
}
