import { page } from '../interactions/index';

export async function getPropertiesOfElements(element, propertyName: string) {
  const elements = await page.$$(`${element.locator}`);
  return Promise.all(
    elements.map(async (elem) =>
      elem.evaluate((el, prop) => getComputedStyle(el)[prop], propertyName)
    )
  );
}
