import { PageHandler } from './page.handler';
import { TWaitForUrlState } from '../../interfaces/pwOptions';

export class Waits extends PageHandler {
  public async waitForTimeout(mlsec: number): Promise<void> {
    return this.page.waitForTimeout(mlsec);
  }

  public async waitForUrl(
    url: string,
    option: TWaitForUrlState
  ): Promise<void> {
    return this.page.waitForURL(`${url}`, { waitUntil: option });
  }
}
