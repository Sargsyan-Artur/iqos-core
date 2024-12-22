/* eslint-disable @typescript-eslint/no-shadow */
import { Then, When } from '@cucumber/cucumber';
import { Page } from '../../interactions/page';
import { timeouts } from '../../configs/timeouts';
import { Element } from '../../interactions/element';
import { TWaitForUrlState } from '../../interfaces/pwOptions';
import { page } from '../../interactions/index';

When('I wait {int} ms on {page}', (ms: number, page: Page) =>
  page.waits.waitForTimeout(ms)
);

/**
 * @Example: Then I should wait for "/home.html" url until load
 */
Then(
  'I should wait for {string} url until {waitForUrlOptions} on {page}',
  async (url: string, option: TWaitForUrlState, page: Page) => {
    await page.waits.waitForUrl(`**/${url}`, option);
  }
);

/**
 * @Example: Then I should wait until "Home icon" is visible
 * {element} - name of element + 'element'
 * {validation} - "attached"|"detached"|"visible"|"hidden";
 */
Then(
  'I should wait until {element} is {validationWait}',
  { timeout: timeouts.STEP_WAIT },
  (element: Element, validation: string) => element.waits.waitFor(validation)
);

When(
  'I wait for the specific URL {string}',
  { timeout: timeouts.STEP_WAIT },
  async (expectedUrl: string) => {
    await page.waitForURL(new RegExp(`/.*${expectedUrl}`), {
      waitUntil: 'load'
    });
  }
);

When(
  'I should wait for {waitForLoadState} state',
  { timeout: timeouts.STEP_WAIT },
  async (state) => {
    await page.waitForLoadState(state);
  }
);

When(
  'I wait for {page} loaded',
  { timeout: timeouts.STEP_WAIT },
  async (page: Page) => {
    await page.waits.waitForUrl(page.actions.url, 'domcontentloaded');
    await page.waits.waitForUrl(page.actions.url, 'load');
  }
);
