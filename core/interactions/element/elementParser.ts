import { Locator } from '@playwright/test';
import { Element } from './element';
import { Collection } from '../collection';
import { memory } from '../../utils/memory';
import { page } from '../index';

const getLocator = async (query: string, poPage) => {
  const elementName = query.match(/"([^"]+)"/)[1];
  const locator = poPage.getLocator(elementName);
  return page.locator(locator);
};

const getLocatorByIndex = async (query: string, poPage) => {
  const elementName = query.match(/"([^"]+)"/)[1];
  const index = query.match(/\b(\d+)\b/)[1];
  const locator = poPage.getLocator(elementName);
  const collection = new Collection({ locator });
  return collection.actions.collection.nth(+index);
};

export const getElementFromCollectionByText = async (
  collection: Collection,
  text: string
) => {
  if (!text) {
    throw new Error('Element text should be defined!');
  }
  const allTexts = await collection.actions.getAllTexts();
  const elementText = allTexts.find((productTexts) =>
    productTexts.includes(text)
  );
  const index = allTexts.indexOf(elementText);
  if (index === -1) {
    throw new Error(
      `No element was found in the collection with text: ${text}`
    );
  }

  return collection.actions.collection.nth(index);
};

export const getLocatorByText = async (query: string, poPage) => {
  // eslint-disable-next-line prefer-const
  let [elementName, text] = query
    .match(/"([^"]+)"\s+with text\s+"([^"]+)"/)
    .slice(1);
  text = memory.getValues(text) as string;
  const locator = poPage.getLocator(elementName);
  const collection = new Collection({ locator });
  return getElementFromCollectionByText(collection, text);
};

export const parsePwElement = async (query: string, poPage) => {
  let pwElement: Locator;

  if (query.includes('index')) {
    pwElement = await getLocatorByIndex(query, poPage);
  } else if (query.includes('with text')) {
    pwElement = await getLocatorByText(query, poPage);
  } else {
    pwElement = await getLocator(query, poPage);
  }
  return pwElement;
};

export const chainElements = async (elements: Locator[]) => {
  if (elements.length === 1) {
    return elements[0];
  }
  const reversedElements = elements.reverse();
  let finalElement = reversedElements[0];
  for (let i = 1; i < reversedElements.length; i += 1) {
    finalElement = finalElement.locator(reversedElements[i]);
  }
  return finalElement;
};

export const separateElementsFromQuery = (multiElementQuery: string) =>
  multiElementQuery.split(/ in (?=(?:[^"]*"[^"]*")*[^"]*$)/);

export const getElementsFromElementQueries = async (
  singleElementQueries: string[],
  poPage
) => {
  const pwElements: Locator[] = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const query of singleElementQueries) {
    // eslint-disable-next-line no-await-in-loop
    pwElements.push(await parsePwElement(query, poPage));
  }
  return pwElements;
};

export const parseElementQuery = async (multiElementQuery: string, poPage) => {
  const singleElementQueries = separateElementsFromQuery(multiElementQuery);
  const pwElements = await getElementsFromElementQueries(
    singleElementQueries,
    poPage
  );
  const chainedPlaywrightElement = await chainElements(pwElements);
  return new Element(chainedPlaywrightElement);
};
