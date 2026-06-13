import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class RegisterPage extends BasePage {
  readonly form: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly genderSelect: Locator;
  readonly passwordInput: Locator;
  readonly photoInput: Locator;
  readonly analyticsConsentCheckbox: Locator;
  readonly submitButton: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    super(page);
    this.form = this.byUi('register-form');
    this.nameInput = this.byUi('register-name');
    this.emailInput = this.byUi('register-email');
    this.genderSelect = this.byUi('register-gender');
    this.passwordInput = this.byUi('register-password');
    this.photoInput = this.byUi('register-photo');
    this.analyticsConsentCheckbox = this.byUi('register-analytics-consent');
    this.submitButton = this.submitButtonIn(this.form);
    this.loginLink = this.linkByHref('/index.html');
  }

  async open(): Promise<void> {
    await this.goto('/register.html');
  }

  async submitRequiredFields(data: {
    name: string;
    email: string;
    gender?: '0' | '1';
    password: string;
    analyticsConsent?: boolean;
  }): Promise<void> {
    this.log.info('Submitting registration form', {
      email: data.email,
      gender: data.gender ?? '0',
      analyticsConsent: data.analyticsConsent ?? true,
    });
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.genderSelect.selectOption(data.gender ?? '0');
    await this.passwordInput.fill(data.password);

    if (data.analyticsConsent ?? true) {
      await this.analyticsConsentCheckbox.check();
    }

    await this.submitButton.click();
  }
}
