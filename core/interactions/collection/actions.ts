import { Locator } from '@playwright/test';

export class Actions {
  constructor(public collection: Locator) {}

  async getAllTexts(): Promise<Array<string>> {
    return this.collection.allTextContents();
  }

  async getCount(): Promise<number> {
    return this.collection.count();
  }

  async getAll(): Promise<Array<Locator>> {
    return this.collection.all();
  }

  async clickOnItemByText(text: string): Promise<void> {
    const allTexts = await this.getAllTexts();
    const elementText = allTexts.find((eachText) => eachText === text);

    if (elementText) {
      return this.collection.nth(allTexts.indexOf(elementText)).click();
    }

    throw new Error(
      `No ${text} text in provided ${this.collection} collection`
    );
  }
}
