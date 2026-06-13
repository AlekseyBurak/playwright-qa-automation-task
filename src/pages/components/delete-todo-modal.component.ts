import type { Locator, Page } from '@playwright/test';
import { createLogger } from '../../logger';

export class DeleteTodoModalComponent {
  private readonly log = createLogger('DeleteTodoModalComponent');
  readonly modal: Locator;
  readonly confirmButton: Locator;
  readonly cancelButton: Locator;

  constructor(private readonly page: Page) {
    this.modal = this.byUi('delete-todo-modal');
    this.confirmButton = this.byUi('confirm-delete-todo-button');
    this.cancelButton = this.byUi('cancel-delete-todo-button');
  }

  async confirm(): Promise<void> {
    this.log.info('Confirming todo deletion');
    await this.confirmButton.click();
  }

  async cancel(): Promise<void> {
    this.log.info('Cancelling todo deletion');
    await this.cancelButton.click();
  }

  private byUi(name: string): Locator {
    return this.page.locator(`[data-ui="${name}"]`);
  }
}
