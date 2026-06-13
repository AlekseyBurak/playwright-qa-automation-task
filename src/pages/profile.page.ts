import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from './components';

export class ProfilePage extends BasePage {
  readonly header: HeaderComponent;
  readonly form: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly maleGenderRadio: Locator;
  readonly femaleGenderRadio: Locator;
  readonly avatar: Locator;
  readonly photoInput: Locator;
  readonly replacePhotoButton: Locator;
  readonly removePhotoButton: Locator;
  readonly analyticsConsentCheckbox: Locator;
  readonly submitButton: Locator;
  readonly openPasswordModalButton: Locator;
  readonly passwordModal: Locator;
  readonly passwordForm: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly passwordMessage: Locator;
  readonly closePasswordModalButton: Locator;
  readonly cancelPasswordModalButton: Locator;
  readonly toastContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.form = this.byUi('profile-form');
    this.nameInput = this.byUi('profile-name');
    this.emailInput = this.byUi('profile-email');
    this.maleGenderRadio = this.byUi('profile-gender-male');
    this.femaleGenderRadio = this.byUi('profile-gender-female');
    this.avatar = this.byUi('profile-avatar');
    this.photoInput = this.byUi('profile-photo-input');
    this.replacePhotoButton = this.byUi('profile-replace-photo-button');
    this.removePhotoButton = this.byUi('profile-remove-photo-button');
    this.analyticsConsentCheckbox = this.byUi('profile-analytics-consent');
    this.submitButton = this.byUi('profile-submit');
    this.openPasswordModalButton = this.byUi('profile-open-password-modal');
    this.passwordModal = this.byUi('password-modal');
    this.passwordForm = this.byUi('password-form');
    this.newPasswordInput = this.byUi('profile-new-password');
    this.confirmPasswordInput = this.byUi('profile-confirm-password');
    this.passwordMessage = this.byUi('password-form-message');
    this.closePasswordModalButton = this.byUi('password-modal-close');
    this.cancelPasswordModalButton = this.byUi('password-modal-cancel');
    this.toastContainer = this.byUi('toast-container');
  }

  async open(): Promise<void> {
    await this.goto('/profile.html');
  }

  async updateName(name: string): Promise<void> {
    this.log.info('Updating profile name');
    await this.nameInput.fill(name);
    await this.submitButton.click();
  }

  async openPasswordModal(): Promise<void> {
    this.log.info('Opening password modal');
    await this.openPasswordModalButton.click();
  }

  async submitPasswordChange(newPassword: string, confirmPassword = newPassword): Promise<void> {
    this.log.info('Submitting password change form');
    await this.newPasswordInput.fill(newPassword);
    await this.confirmPasswordInput.fill(confirmPassword);
    await this.submitButtonIn(this.passwordForm).click();
  }
}
