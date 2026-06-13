import type { Locator, Page } from '@playwright/test';
import { createLogger } from '../../logger';

export class TagsSidebarComponent {
  private readonly log = createLogger('TagsSidebarComponent');
  readonly toggleButton: Locator;
  readonly sidebar: Locator;
  readonly closeButton: Locator;
  readonly form: Locator;
  readonly nameInput: Locator;
  readonly colorGrid: Locator;
  readonly tagsList: Locator;

  constructor(private readonly page: Page) {
    this.toggleButton = this.byUi('toggle-tags-sidebar-button');
    this.sidebar = this.byUi('tags-sidebar');
    this.closeButton = this.byUi('close-tags-sidebar-button');
    this.form = this.byUi('tag-form');
    this.nameInput = this.byUi('tag-name-input');
    this.colorGrid = this.byUi('tag-color-grid');
    this.tagsList = this.byUi('tags-list');
  }

  async open(): Promise<void> {
    this.log.info('Opening tags sidebar');
    await this.toggleButton.click();
  }

  async close(): Promise<void> {
    this.log.info('Closing tags sidebar');
    await this.closeButton.click();
  }

  async fillTagName(name: string): Promise<void> {
    this.log.info('Filling tag name');
    await this.nameInput.fill(name);
  }

  private byUi(name: string): Locator {
    return this.page.locator(`[data-ui="${name}"]`);
  }
}
