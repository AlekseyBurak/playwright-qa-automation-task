import type { Locator, Page } from '@playwright/test';
import { createLogger, type Logger } from '../logger';

export abstract class BasePage {
  protected readonly log: Logger;
  protected readonly page: Page;

  constructor(page: Page) {
    this.log = createLogger(this.constructor.name);
    this.page = page;
  }

  protected byUi(name: string): Locator {
    return this.page.locator(`[data-ui="${name}"]`);
  }

  protected linkByHref(href: string): Locator {
    return this.page.locator(`a[href="${href}"]`);
  }

  protected submitButtonIn(form: Locator): Locator {
    return form.locator('button[type="submit"]');
  }

  async goto(path: string): Promise<void> {
    this.log.info('Opening page', { path });
    await this.page.goto(path);
  }
}
