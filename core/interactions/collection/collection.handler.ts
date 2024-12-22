import { Locator } from '@playwright/test';
import { Page } from 'playwright';

import { page } from '../index';
import { ICollectionConfig, TElement } from '../../interfaces/element';

export class CollectionHandler {
  public collection: Locator;

  protected page: Page = page;

  protected collectionConfig: ICollectionConfig;

  constructor(collectionConfigOrPwLocator: ICollectionConfig | Locator) {
    if (this.isConfig(collectionConfigOrPwLocator)) {
      this.collectionConfig = collectionConfigOrPwLocator;
      this.collection = this.getElements(collectionConfigOrPwLocator);
    } else {
      this.collection = collectionConfigOrPwLocator;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private isConfig(
    locatorOrConfig: ICollectionConfig | Locator
  ): locatorOrConfig is ICollectionConfig {
    return typeof (locatorOrConfig as Locator).locator === 'string';
  }

  private getElements({ locator }: ICollectionConfig): TElement {
    return this.page.locator(locator);
  }
}
