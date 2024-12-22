import { Response } from 'playwright';

import { PageHandler } from './page.handler';
import { page } from '../index';

export class Actions extends PageHandler {
  public async goTo(url?: string): Promise<Response | null> {
    return this.page.goto(url || this.url);
  }

  public async waitForNetworkIdle(): Promise<void> {
    return this.page.waitForLoadState('networkidle');
  }

  public async reloadPage(): Promise<Response | null> {
    return this.page.reload();
  }

  public async press(button: string): Promise<void> {
    return this.page.keyboard.press(button);
  }

  public async getUrl(): Promise<string> {
    return this.page.url();
  }

  /* eslint-disable class-methods-use-this */
  public async evaluate(
    command: string
  ): Promise<string | number | object | boolean | undefined | null> {
    return page.evaluate(command);
  }
}
