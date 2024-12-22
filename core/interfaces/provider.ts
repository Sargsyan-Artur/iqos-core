import { Browser, BrowserContext, Page } from 'playwright';

export interface IProvider {
  browser: Browser;
  context: BrowserContext;
  page: Page;
}
