/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */
import { Locator } from '@playwright/test';
import { Given, setDefaultTimeout, When } from '@cucumber/cucumber';
import { Element } from '../../interactions/element';
import { Collection } from '../../interactions/collection/collection';
import { Page } from '../../interactions/page';
import { log } from '../../utils/logger';
import { generateLighthouseReport } from '../../lighthouse-integration/lighthouseAudit';
import { config } from '../../configs/config';
import { timeouts } from '../../configs/timeouts';
import { page } from '../../interactions/index';
import { memory } from '../../utils/memory';
import { isMobile } from './utils';

setDefaultTimeout(timeouts.DEFAULT_WAIT);
Given('I am on {page}', { timeout: timeouts.STEP_WAIT }, async (page: Page) => {
  log.info(page.actions.url);
  await page.actions.waitForNetworkIdle();
});

Given(
  'I navigate to {page}',
  { timeout: timeouts.STEP_WAIT },
  async (page: Page) => {
    await page.actions.goTo();
  }
);

When(
  'I click on {element}',
  { timeout: timeouts.STEP_WAIT },
  async (element: Element) => {
    await element.actions.click();
  }
);

When(
  'I click on {elementQuery}',
  { timeout: timeouts.STEP_WAIT },
  async (element: Element) => {
    await element.actions.click();
  }
);

When(
  'I click on {elementQuery} for {int} times',
  async (element: Element, clickCount: number) => {
    await element.actions.click({ clickCount });
  }
);

Given(
  'I reload {page}',
  { timeout: timeouts.STEP_WAIT },
  async (page: Page) => {
    await page.actions.reloadPage();
  }
);

When(
  'I hover on {element}',
  { timeout: timeouts.STEP_WAIT },
  async (element: Element) => {
    await element.actions.hover();
  }
);

When(
  'I fill {data} on {element}',
  { timeout: timeouts.STEP_WAIT },
  async (text: string, element: Element) => {
    await element.actions.fill(memory.getValue(text));
  }
);

When(
  'I perform accessibility check for {page}',
  { timeout: timeouts.STEP_WAIT },
  async (page: Page) => {
    await page.accessibility.checkAxe();
  }
);

When(
  'I generate performance report for {page}',
  { timeout: timeouts.STEP_WAIT },
  async (page: Page) => {
    await generateLighthouseReport(page.actions.fullUrl, config);
  }
);

Given(
  'I execute browser console command {string} on {page}',
  { timeout: timeouts.STEP_WAIT },
  async (command: string, page: Page) => {
    await page.actions.evaluate(command);
  }
);

When('I clear {element}', async (element: Element) => {
  await element.actions.fill('');
});

When('I press {string} key(s) on {page}', async (key: string, page: Page) => {
  await page.actions.press(key);
});

When(
  'I press {string} key(s) on {element}',
  async (key: string, element: Element) => {
    await element.actions.keyPress(key);
  }
);

When(
  'I select {string} option from {element}',
  async (option: string, element: Element) => {
    await element.actions.select(memory.getValue(option));
  }
);

When(
  'I select {string} text from {element}',
  async (option: string, element: Element) => {
    await element.actions.selectByText(memory.getValue(option));
  }
);

When(
  'I click {data} text in {collection}',
  async (text: string, collection: Collection) => {
    await collection.actions.clickOnItemByText(text);
  }
);

When(
  'I mock the response with "{mock}" body and {int} status code for {data} request',
  async (responseBody: string, responseCode: number, endpoint: string) => {
    await page.route(endpoint, async (route) => {
      await route.fulfill({
        status: Number(responseCode),
        contentType: 'application/json',
        body: responseBody
      });
    });
  }
);

When(
  'I mock the response code for {data} request with code {int}',
  async (endpoint: string, responseCode: number) => {
    await page.route(endpoint, async (route) => {
      await route.fulfill({
        status: responseCode
      });
    });
  }
);

When(
  'I remember postdata of {string} request as {string}',
  async (endpoint: string, key: string) => {
    await page.route(endpoint, async (route) => {
      memory.set(key, JSON.stringify(await route.request().postData()));
    });
  }
);

When(
  'I tap on {element}',
  { timeout: timeouts.STEP_WAIT },
  async (element: Element) => {
    await element.actions.tap();
  }
);

When(
  'I upload the file by path {string} in {element}',
  { timeout: timeouts.STEP_WAIT },
  async (path: string, element: Element) => {
    await element.actions.inputFiles(path);
  }
);

When(
  'I scroll to the {element}',
  { timeout: timeouts.STEP_WAIT },
  async (element: Element) => {
    await element.actions.scrollIntoView();
  }
);

When(
  'I click on {element} with {int} delay',
  async (element: Element, delay: number) => {
    await element.actions.click({ delay });
  }
);

When(
  'I download the file as {string} from {element}',
  { timeout: timeouts.STEP_WAIT },
  async (file: string, element: Element) => {
    // Start waiting for download before clicking. Note no await.
    const downloadPromise = page.waitForEvent('download');
    await element.actions.click();
    const download = await downloadPromise;
    await download.saveAs(file);
  }
);

When(
  'I click on {element} if it is {string}',
  { timeout: timeouts.STEP_WAIT },
  async (element: Element, validation: string) => {
    let state = false;
    if (validation === 'visible') {
      state = await element.expects.element.isVisible();
    } else if (validation === 'enabled') {
      state = await element.expects.element.isEnabled();
    }
    if (state) {
      await element.actions.click(element);
    }
  }
);

When('I click outside to lose focus on elements', async () => {
  await Element.init('body').actions.click();
});

When('I click "Go back" button in browser', async () => {
  await page.goBack();
});

When(
  'I click on each element in {collection}',
  async (collection: Collection) => {
    const allLocators: Locator[] = await collection.actions.getAll();
    for (let i = 0; i < allLocators.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await allLocators[i].click();
    }
  }
);

When(
  'I remove {string} characters from {string}',
  async (keyToRemove, memoryKey) => {
    const objectFromMemory = memory.getValues(memoryKey);
    let modifiedValue;
    if (Array.isArray(objectFromMemory)) {
      modifiedValue = objectFromMemory.map((value) =>
        value.replaceAll(keyToRemove, '')
      );
    } else {
      modifiedValue = (objectFromMemory as string).replaceAll(keyToRemove, '');
    }
    memory.set(memoryKey.substring(1), modifiedValue);
  }
);

When(
  'I click {string} text on the page',
  { timeout: timeouts.STEP_WAIT },
  async (text: string) => {
    const element = await page.waitForSelector(`text=${text}`, {
      state: 'visible'
    });
    await element.click();
  }
);

When(
  'I click on each {data} text in {collection}',
  { timeout: timeouts.STEP_WAIT },
  async (textArray: string, collection: Collection) => {
    if (Array.isArray(textArray)) {
      for (let i = 0; i < textArray.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await collection.actions.clickOnItemByText(textArray[i]);
      }
    } else {
      await collection.actions.clickOnItemByText(textArray);
    }
  }
);

When(
  'I select {string} value in {element}',
  async (optionValue: string, element: Element) => {
    await page.waitForSelector(`${element.locator}`, {
      state: 'visible'
    });
    await page.selectOption(`${element.locator}`, {
      value: optionValue
    });
  }
);

When(
  'I type {data} on {element}',
  { timeout: timeouts.STEP_WAIT },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (data: any, element: Element) => {
    await element.actions.type(data);
  }
);

When(
  'I click on {element} with JS on {page}',
  async (element: Element, page: Page) => {
    await page.actions.evaluate(
      `document.querySelector('${element.locator}').click()`
    );
  }
);

When(
  'I execute console command {data} on {page}',
  { timeout: timeouts.STEP_WAIT },
  async (command: string, page: Page) => {
    await page.actions.evaluate(command);
  }
);

When(
  'I set window size {int}px width and {int}px height',
  async (width: number, height: number) => {
    await page.setViewportSize({
      width,
      height
    });
  }
);

When('I open the URL {string}', async (url: string) => {
  await page.goto(url);
});

When(
  'I hover for desktop or click for mobile on {element}',
  { timeout: timeouts.STEP_WAIT },
  async (element: Element) => {
    if (!(await isMobile(page))) {
      await element.actions.hover();
    } else {
      await element.actions.click();
    }
  }
);

When(
  'I click on {element} if I am using mobile',
  { timeout: timeouts.STEP_WAIT },
  async (element: Element) => {
    if (await isMobile(page)) {
      await element.actions.click();
    }
  }
);
