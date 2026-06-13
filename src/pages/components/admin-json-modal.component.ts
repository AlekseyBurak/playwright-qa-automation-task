import type { Locator, Page } from '@playwright/test';
import { createLogger } from '../../logger';

export class AdminJsonModalComponent {
  private readonly log = createLogger('AdminJsonModalComponent');
  readonly modal: Locator;
  readonly code: Locator;
  readonly closeButton: Locator;

  constructor(private readonly page: Page) {
    this.modal = this.byUi('admin-json-modal');
    this.code = this.byUi('admin-json-modal-code');
    this.closeButton = this.byUi('admin-json-modal-close');
  }

  async close(): Promise<void> {
    this.log.info('Closing admin JSON modal');
    await this.closeButton.click();
  }

  private byUi(name: string): Locator {
    return this.page.locator(`[data-ui="${name}"]`);
  }
}
