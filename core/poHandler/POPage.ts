import { IPOLocators } from '../interfaces/poHandler';

export abstract class POPage {
  abstract readonly name: string;

  abstract readonly url: string;

  abstract get locators(): IPOLocators;

  getLocator(name: string): string {
    if (!this.isLocatorExist(name)) {
      throw new Error(`No such element with name '${name}'`);
    }

    return this.locators[name];
  }

  private isLocatorExist(name): boolean {
    return name in this.locators;
  }
}
