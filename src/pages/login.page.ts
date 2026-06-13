import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly form: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    super(page);
    this.form = this.byUi('login-form');
    this.emailInput = this.byUi('login-email');
    this.passwordInput = this.byUi('login-password');
    this.submitButton = this.submitButtonIn(this.form);
    this.registerLink = this.linkByHref('/register.html');
  }

  async open(): Promise<void> {
    await this.goto('/index.html');
  }

  async login(email: string, password: string): Promise<void> {
    this.log.info('Submitting login form', { email });
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
