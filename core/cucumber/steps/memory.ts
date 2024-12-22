import { When, Then, setDefaultTimeout } from '@cucumber/cucumber';
// eslint-disable-next-line import/no-extraneous-dependencies
import JsonQuery from 'json-query';
import { get } from 'lodash';
import { expect } from 'chai';
import { Locator } from '@playwright/test';
import { memory } from '../../utils/memory';
import { Element } from '../../interactions/element';
import { Collection } from '../../interactions/collection';
import { getRandomString } from '../../utils/string';
import { Page } from '../../interactions/page';
import { timeouts } from '../../configs/timeouts';
import { page } from '../../interactions';
import { filterObjectOnPath, sortObjectOnPath } from './utils';

setDefaultTimeout(timeouts.DEFAULT_WAIT);
When(
  'I remember the text of {element} as {string}',
  async (element: Element, key: string) => {
    const text: string = await element.actions.getText();
    memory.set(key, text);
  }
);

When(
  'I remember the text of {collection} as {string}',
  async (element: Collection, key: string) => {
    const texts: string[] = await element.actions.getAllTexts();
    memory.set(key, texts);
  }
);

When(
  'I remember the {string} attribute of {element} as {string}',
  async (attributeType: string, element: Element, key: string) => {
    const attribute: string = await element.actions.getAttribute(attributeType);
    memory.set(key, attribute);
  }
);

When(
  /^I remember random '(\d+)' string as '(.+)'$/,
  (count: number, key: string) => memory.set(key, getRandomString(count))
);

When('I remember {data} as {string}', (text: string, key: string) =>
  memory.set(key, text)
);

When(/^I delete '(.+)' from memory$/, (key: string) => memory.delete(key));

When(/^I clear memory$/, () => memory.clear());

When(
  'I save current {page} url as {string}',
  // eslint-disable-next-line @typescript-eslint/no-shadow
  async (page: Page, key: string) => {
    memory.set(key, page.actions.url);
  }
);

When(
  'I remember the {string} cookie value as {string}',
  async (cookieKey: string, key: string) => {
    const cookies = await page.context().cookies();
    const cookie = cookies.find((cookiItem) => cookiItem.name === cookieKey);
    if (!cookie) {
      throw new Error('Error retrieving access token');
    }
    memory.set(key, cookie.value);
  }
);

When('I stringify {string} value from memory', async (memoryAlias) => {
  const memoryValue = memory.getValues(memoryAlias);
  const stringifiedValue = JSON.stringify(memoryValue);
  memory.set(memoryAlias.substring(1), stringifiedValue);
});

When(
  'I fetch the {string} attributes of elements in the {collection} and save them as {string}',
  async (attributeName: string, collection: Collection, memoryKey: string) => {
    const allLocators: Locator[] = await collection.actions.getAll();
    const attributeValues = [];

    for (let i = 0; i < allLocators.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const value = await allLocators[i].getAttribute(attributeName);
      if (attributeName === 'href') {
        const modifiedValue = value.substring(value.lastIndexOf('/'));
        attributeValues.push(modifiedValue);
      } else {
        attributeValues.push(value);
      }
    }
    memory.set(memoryKey, attributeValues);
  }
);

When(
  'I remember the value of {element} as {string}',
  async (element: Element, key: string) => {
    const text: string = await element.actions.getInputValue();
    memory.set(key, text);
  }
);

When(
  'I filter {string} from memory( on the following path){optionalString} to objects with/where property/path {string} {validationProperty}{optionalString}',
  (
    memoryKey: string,
    pathToArrayInObject: string,
    propertyPath: string,
    validation: string,
    validationValue: string
    // eslint-disable-next-line max-params
  ) => {
    // eslint-disable-next-line no-param-reassign, no-unneeded-ternary
    pathToArrayInObject = pathToArrayInObject ? pathToArrayInObject : '';
    const objectFromMemory = memory.get(memoryKey);
    const filteredObject = filterObjectOnPath(
      objectFromMemory,
      pathToArrayInObject,
      propertyPath,
      validation,
      validationValue
    );
    memory.set(memoryKey, filteredObject);
  }
);

When(
  'I sort {string} from memory( on the following path){optionalString} based on property/path {string}',
  (memoryKey: string, pathToArrayInObject: string, propertyPath: string) => {
    // eslint-disable-next-line no-param-reassign, no-unneeded-ternary
    pathToArrayInObject = pathToArrayInObject ? pathToArrayInObject : '';
    const objectFromMemory = memory.get(memoryKey);
    const sortedObject = sortObjectOnPath(
      objectFromMemory,
      pathToArrayInObject,
      propertyPath
    );
    memory.set(memoryKey, sortedObject);
  }
);

Then(
  'Arrays from memory {string} should be equal {string}',
  async (key1: string, key2: string) => {
    const dataFromMemory1 = memory.getValue(key1);
    const dataFromMemory2 = memory.getValue(key2);
    expect(dataFromMemory1).deep.equal(dataFromMemory2);
  }
);

When('I convert {string} number to text', async (memoryKey: string) => {
  const number = memory.get(memoryKey);
  memory.set(memoryKey, number.toString());
});

When(
  'I save the value on the following path {string} from {string} response/object {createOrUpdateInMemory} {string} in memory',
  (
    path: string,
    responseAlias: string,
    createOrUpdateInMemory: string,
    memoryKey: string
    // eslint-disable-next-line max-params
  ) => {
    const response = memory.getValues(responseAlias);
    const valueOnPath = JsonQuery(path, { data: response }).value;
    if (createOrUpdateInMemory === 'and add to') {
      const arrayToExtend = memory.get(memoryKey);
      memory.set(memoryKey, [...valueOnPath, ...arrayToExtend]);
    } else {
      memory.set(memoryKey, valueOnPath);
    }
  }
);

When(
  'I count objects on the following path {string} from {string} response/object as {string} in memory',
  (path: string, responseAlias: string, memoryKey: string) => {
    const response = memory.getValues(responseAlias);
    const valueOnPath = JsonQuery(path, { data: response }).value;
    memory.set(memoryKey, valueOnPath.length);
  }
);

Then(
  'the body for {string} response should contain a defined property on the following path {string}',
  (responseAlias: string, path: string) => {
    const response = memory.getValues(responseAlias);
    const actualValueOnPath = JsonQuery(path, { data: response }).value;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(actualValueOnPath).to.not.be.undefined;
  }
);

When(
  'the body for {string} response should contain {string} value on the following path {string}',
  (responseAlias: string, expectedValue: string, path: string) => {
    const response = memory.getValues(responseAlias);
    const actualValueOnPath = get(response, path);
    expect(actualValueOnPath.toString()).to.equal(expectedValue);
  }
);
