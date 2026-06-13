import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class VacancyApplicationPage extends BasePage {
  readonly form: Locator;
  readonly fullNameInput: Locator;
  readonly submitButton: Locator;
  readonly error: Locator;
  readonly result: Locator;
  readonly accessKey: Locator;
  readonly adminEmail: Locator;
  readonly adminPassword: Locator;
  readonly copyKeyButton: Locator;
  readonly copyAdminEmailButton: Locator;
  readonly copyAdminPasswordButton: Locator;

  constructor(page: Page) {
    super(page);
    this.form = this.byUi('vacancy-form');
    this.fullNameInput = this.byUi('vacancy-full-name');
    this.submitButton = this.submitButtonIn(this.form);
    this.error = this.byUi('vacancy-error');
    this.result = this.byUi('vacancy-result');
    this.accessKey = this.byUi('vacancy-access-key');
    this.adminEmail = this.byUi('vacancy-admin-email');
    this.adminPassword = this.byUi('vacancy-admin-password');
    this.copyKeyButton = this.byUi('vacancy-copy-key');
    this.copyAdminEmailButton = this.byUi('vacancy-copy-admin-email');
    this.copyAdminPasswordButton = this.byUi('vacancy-copy-admin-password');
  }

  async open(): Promise<void> {
    await this.goto('/vacancy-application.html');
  }

  async submitApplication(fullName: string): Promise<void> {
    this.log.info('Submitting vacancy application');
    await this.fullNameInput.fill(fullName);
    await this.submitButton.click();
  }
}
