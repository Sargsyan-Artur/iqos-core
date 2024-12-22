/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-shadow */
import { expect as playWrightExpect, Locator } from '@playwright/test';
import { Then, setDefaultTimeout, DataTable } from '@cucumber/cucumber';
import { expect } from 'chai';
import { range } from 'lodash';
import { getPropertiesOfElements } from '../../helpers/playwrightApi';
import { Collection } from '../../interactions/collection';
import { Element } from '../../interactions/element';
import { Page } from '../../interactions/page';
import { timeouts } from '../../configs/timeouts';
import { memory } from '../../utils/memory';
import { page } from '../../interactions';
import { isMobile } from './utils';

setDefaultTimeout(timeouts.DEFAULT_WAIT);
/**
 * @Example: Then "selectedLang" element should contain "Java" text
 * {element} - name of element + 'element'
 * {reverse} - not or ''
 * {validation} - be|contain|have|equal|deep equal|have property|match
 * {string} - expected text
 */
Then(
  '(The text of ){element} should{reverse} {validation} {data} text',
  { timeout: timeouts.STEP_WAIT },
  /* eslint-disable max-params */ async (
    element: Element,
    reverse: boolean,
    validation: string,
    expectedResult
  ) => {
    const actualResult = await element.actions.getText();
    expectedResult = memory.getValue(expectedResult);
    await element.expects.verifyText({
      actualResult,
      expectedResult,
      validation,
      reverse
    });
  }
);

/**
 * @Example: Then "selectedLang" element should contain "Java" text
 * {element} - element query
 * {reverse} - not or ''
 * {validation} - be|contain|have|equal|deep equal|have property|match
 * {string} - expected text
 */
Then(
  '(The text of ){elementQuery} should{reverse} {validation} {data} text',
  { timeout: timeouts.STEP_WAIT },
  /* eslint-disable max-params */ async (
    element: Element,
    reverse: boolean,
    validation: string,
    expectedResult
  ) => {
    const actualResult = await element.actions.getText();
    expectedResult = memory.getValue(expectedResult);
    await element.expects.verifyText({
      actualResult,
      expectedResult,
      validation,
      reverse
    });
  }
);

/**
 * @Example: Then "searchField" element should contain "Java" input value
 * {element} - name of element + 'element'
 * {reverse} - not or ''
 * {validation} - be|contain|have|equal|deep equal|have property|match
 * {string} - expected text
 */
Then(
  '{element} should{reverse} {validation} {data} input value',
  /* eslint-disable max-params */
  async (
    element: Element,
    reverse: boolean,
    validation: string,
    expectedResult: string
  ) => {
    const actualResult = await element.actions.getInputValue();
    await element.expects.verifyText({
      actualResult,
      expectedResult,
      validation,
      reverse
    });
  }
);

/**
 * @Example:  Then "dropDown" element should be visible
 * {element} - name of element + 'element'
 * {reverse} - not or ''
 * {validationDom} - visible|hidden|disabled|enabled|editable|checked
 */
Then(
  '{element} should{reverse} be {validationDom}',
  { timeout: timeouts.STEP_WAIT },
  async (element: Element, reverse: boolean, validationDom: string) => {
    await element.expects.verify(validationDom, reverse);
  }
);

/**
 * @Example: Then Login page should have "https://url" url
 */
Then(
  '{page} should have {data} url',
  { timeout: timeouts.STEP_WAIT },
  async (page: Page, text) => {
    await page.expects.toHaveURL(text);
  }
);

Then(
  '{element} {string} attribute should{reverse} {validation} {data} text',
  { timeout: timeouts.STEP_WAIT },
  async (
    element: Element,
    attributeType: string,
    reverse: boolean,
    validation: string,
    expectedResult
  ) => {
    const actualResult = await element.actions.getAttribute(attributeType);
    expectedResult = memory.getValue(expectedResult);
    await element.expects.verifyText({
      actualResult,
      expectedResult,
      validation,
      reverse
    });
  }
);

/**
 * @Example: Then Home page url should match "^https:\/\/.*"
 */
Then(
  '{page} url should{reverse} match {string}',
  { timeout: timeouts.STEP_WAIT },
  async (page: Page, reverse, regExp) => {
    await page.expects.toMatchRegexp(regExp, reverse);
  }
);

/**
 * @Example: Then The count of "search results" should be greater than "6"
 * {element} - name of element + 'element'
 * {validationNumber} - "equal"|"greater than"|"lower than";
 * {string} - expected count
 */
Then(
  'The count of {collection} items should be {validationNumber} {string}',
  async (
    collection: Collection,
    validation: string,
    expectedResult: string
  ) => {
    const actualResult = await collection.actions.getCount();
    await collection.expects.verifyNumber({
      actualResult,
      expectedResult,
      validation
    });
  }
);

Then(
  '{element} css style {string}{pseudoElement} on {page} should{reverse} {validation} {string}',
  async (
    element: Element,
    style: string,
    pseudoElement: string | undefined,
    page: Page,
    reverse: string,
    validation: string,
    expectedResult: string
  ) => {
    const optionalPseudoElementPart = pseudoElement
      ? `, '${pseudoElement}'`
      : '';
    const actualResult: string | number | object | boolean | undefined | null =
      await page.actions.evaluate(
        `window.getComputedStyle(document.querySelector('${element.locator}')${optionalPseudoElementPart}).getPropertyValue('${style}')`
      );
    await element.expects.verifyText({
      actualResult,
      expectedResult,
      validation
    });
  }
);

Then(
  'I should compare actual and expected {string} screenshots for {page}',
  { timeout: timeouts.STEP_WAIT },
  async (expectedScreenshotPath: string, page: Page) => {
    await page.expects.toMatchScreenshot(expectedScreenshotPath);
  }
);

Then(
  'Post data {string} should contain {string}',
  async (postData: string, expectedPostData) => {
    expect(expectedPostData).to.contain(memory.getValue(expectedPostData));
  }
);

Then(
  'The texts of {collection} items should{reverse} {validationCollection}',
  { timeout: timeouts.STEP_WAIT },
  async (
    collection: Collection,
    reverse: boolean,
    validation: string,
    textData: DataTable
  ) => {
    const actualResult: string[] = await collection.actions.getAllTexts();
    const expectedResult = textData.transpose().raw()[0];
    await collection.expects.verifyText({
      actualResult,
      expectedResult,
      validation,
      reverse
    });
  }
);

Then(
  'Order in {collection} should{reverse} be {validation} to alphabetical order',
  async (collection: Collection, reverse: boolean, validation: string) => {
    const actualResult = await collection.actions.getAllTexts();
    const expectedResult = [...actualResult].sort();
    await collection.expects.verifyText({
      actualResult,
      expectedResult,
      validation,
      reverse
    });
  }
);

Then(
  'Each {element} should{reverse} be {validationDom}',
  async (element: Element, reverse, validationDom) => {
    const count = await element.actions.getCount();

    /* eslint-disable no-await-in-loop, no-restricted-syntax */
    for (const i of range(count)) {
      await element.nth(i).expects.verify(validationDom, reverse);
    }
  }
);

Then(
  'Order in {collection} should{reverse} be {validation} {data}',
  async (
    collection: Collection,
    reverse: boolean,
    validation: string,
    expectedOrder: string
  ) => {
    const actualResult = (await collection.actions.getAllTexts()).toString();
    const expectedResult = expectedOrder;
    await collection.expects.verifyText({
      actualResult,
      expectedResult,
      validation,
      reverse
    });
  }
);

Then(
  'Each element in {collection} should have {string} attribute{reverse} {validation} {string} text',
  async (
    collection: Collection,
    attributeType: string,
    reverse: boolean,
    validation: string,
    expectedResult: string
  ) => {
    const allLocators: Locator[] = await collection.actions.getAll();
    for (const item of allLocators) {
      const actualResult: string = await item.getAttribute(attributeType);
      await collection.expects.verifyText({
        actualResult,
        expectedResult,
        validation,
        reverse
      });
    }
  }
);

Then(
  'the url of opened page ends with {data}',
  { timeout: timeouts.STEP_WAIT },
  async (expectedURL) => {
    await playWrightExpect(page).toHaveURL(new RegExp(`/.*${expectedURL}`), {
      timeout: timeouts.STEP_WAIT
    });
  }
);

Then('the page title tag should be {string}', async (expectedTitle: string) => {
  const pageTitle = await page.title();
  expect(pageTitle).to.equal(expectedTitle);
});

Then(
  "{element} should contain today's date in format of {string} locale",
  async (element: Element, locale: string) => {
    const today = new Date();
    let dateFormatted = today.toLocaleDateString(locale, {
      day: 'numeric',
      year: 'numeric',
      month: 'short'
    });
    dateFormatted = dateFormatted.replace('Sept', 'Sep');
    const elementText = await element.actions.getText();
    expect(elementText).to.include(dateFormatted);
  }
);

Then(
  '{string} should be {string} {string}',
  async (number1: string, validation: string, number2: string) => {
    const compareValidations = {
      equal: (value1, value2) => expect(value1).to.equal(value2),
      containing: (value1, value2) => expect(value1).to.contain(value2),
      'greater than': (num1, num2) => expect(+num1).to.be.above(+num2),
      'lower than': (num1, num2) => expect(+num1).to.be.below(+num2)
    };

    const firstValue = memory.getValues(number1);
    const secondValue = memory.getValues(number2);
    compareValidations[validation](firstValue, secondValue);
  }
);

Then(
  'CSS {string} properties for collection of {element} should{reverse} be {validation} to {string}',
  async (
    property: string,
    element: Element,
    reverse: boolean,
    validation: string,
    expectedResult: string
  ) => {
    const properties = await getPropertiesOfElements(element, property);
    properties.forEach(async (actualResult) => {
      await element.expects.verifyText({
        actualResult,
        expectedResult,
        validation,
        reverse
      });
    });
  }
);

Then(
  'CSS {string} property of {element} should{reverse} be {validation} to {string}',
  async (
    property: string,
    element: Element,
    reverse: boolean,
    validation: string,
    expectedResult: string
  ) => {
    const properties = await getPropertiesOfElements(element, property);
    const actualResult = properties[0];
    await element.expects.verifyText({
      actualResult,
      expectedResult,
      validation,
      reverse
    });
  }
);

Then(
  '{element} should{reverse} {validation} {string} text for desktop and {string} for mobile',
  { timeout: timeouts.STEP_WAIT },
  /* eslint-disable max-params */ async (
    element: Element,
    reverse: boolean,
    validation: string,
    desktopText: string,
    mobileText: string
  ) => {
    let expectedResult = '';
    if (!(await isMobile(page))) {
      expectedResult = desktopText;
    } else {
      expectedResult = mobileText;
    }

    const actualResult = await element.actions.getText();
    await element.expects.verifyText({
      actualResult,
      expectedResult,
      validation,
      reverse
    });
  }
);
