import { Locator } from '@playwright/test';
import { Page } from 'playwright';

import { IElementConfig, TElement } from '../../interfaces/element';
import { page } from '../index';
/* eslint-disable class-methods-use-this */
export class ElementHandler {
  public element: Locator;

  protected page: Page = page;

  protected elementConfig: IElementConfig;

  constructor(elementConfigOrPwLocator: IElementConfig | Locator) {
    if (this.isConfig(elementConfigOrPwLocator)) {
      this.elementConfig = elementConfigOrPwLocator;
      this.element = this.getElement(elementConfigOrPwLocator);
    } else {
      this.element = elementConfigOrPwLocator;
    }
  }

  private isConfig(
    locatorOrConfig: IElementConfig | Locator
  ): locatorOrConfig is IElementConfig {
    return typeof (locatorOrConfig as Locator).locator === 'string';
  }

  private getElement({ locator, options }: IElementConfig): TElement {
    let element: TElement = this.page.locator(locator);

    if (options) {
      if (this.isByIndex(options)) {
        element = this.getByIndex(locator, options);
      }

      if (this.isByText(options)) {
        element = this.getByText(locator);
      }
    }

    return element;
  }

  getByText(locator: string): Locator {
    return this.page.getByText(locator, { exact: true });
  }

  getByIndex(locator: string, options): Locator {
    const index = parseInt(options.split(' ').pop(), 10);

    return this.page.locator(locator).nth(index);
  }

  private isByIndex(text: string): boolean {
    return text.includes('index');
  }

  private isByText(text: string): boolean {
    return text.includes('text');
  }
}
