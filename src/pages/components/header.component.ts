import type { Locator, Page } from '@playwright/test';
import { createLogger } from '../../logger';

export class HeaderComponent {
  private readonly log = createLogger('HeaderComponent');
  readonly userName: Locator;
  readonly userPhoto: Locator;
  readonly todoLink: Locator;
  readonly profileLink: Locator;
  readonly logoutButton: Locator;

  constructor(private readonly page: Page) {
    this.userName = this.byUi('user-name');
    this.userPhoto = this.byUi('user-photo');
    this.todoLink = this.page.locator('a[href="/dashboard.html"]');
    this.profileLink = this.page.locator('a[href="/profile.html"]');
    this.logoutButton = this.byUi('logout-button');
  }

  async openTodo(): Promise<void> {
    this.log.info('Opening todo navigation link');
    await this.todoLink.click();
  }

  async openProfile(): Promise<void> {
    this.log.info('Opening profile navigation link');
    await this.profileLink.click();
  }

  async logout(): Promise<void> {
    this.log.info('Logging out from user session');
    await this.logoutButton.click();
  }

  private byUi(name: string): Locator {
    return this.page.locator(`[data-ui="${name}"]`);
  }
}
