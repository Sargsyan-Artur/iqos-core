import { BrowserContextOptions, LaunchOptions } from 'playwright-core';
import {
  Browser,
  BrowserContext,
  chromium,
  firefox,
  webkit,
  Page
} from 'playwright';

import { IProvider } from '../interfaces/provider';

/* eslint-disable import/no-mutable-exports */
export let browser: Browser;
export let context: BrowserContext;
export let page: Page;

export { chromium };
export { firefox };
export { webkit };

export const provider = async (
  browserOptions?: LaunchOptions,
  contextOptions?: BrowserContextOptions,
  webBrowser?: string
): Promise<IProvider> => {
  const browsers = {
    firefox() {
      return firefox.launch(browserOptions);
    },
    webkit() {
      return webkit.launch(browserOptions);
    },
    default() {
      return chromium.launch(browserOptions);
    }
  };
  browser = await (browsers[webBrowser] || browsers.default)();
  context = await browser.newContext(contextOptions);
  page = await context.newPage();

  return {
    browser,
    context,
    page
  };
};
