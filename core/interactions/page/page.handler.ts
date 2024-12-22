import { Page } from 'playwright';

import { IPageConfig } from '../../interfaces/element';
import { page } from '../index';
import { config } from '../../configs/config';

export class PageHandler {
  public url: string | undefined;

  public fullUrl: string;

  protected page: Page = page;

  constructor(private pageConfig: IPageConfig) {
    this.url = pageConfig?.url;
    this.fullUrl = `${config.baseURL}${pageConfig?.url}`;
  }
}
