import { Locator } from '@playwright/test';

export interface IElementConfig {
  locator: string;
  options?: string;
}

export interface ICollectionConfig {
  locator: string;
  options?: string;
}

export interface IPageConfig {
  url: string;
}
export type TPageConfig = IPageConfig | undefined;

export type TElement = Locator;

export type TCollection = Promise<Array<Locator>>;

export type VerifyInput = {
  actualResult: string | string[] | number | boolean | object;
  expectedResult: string | string[] | number | boolean | object;
  validation: string;
  reverse?: boolean;
};

export type IConfig = IPageConfig | IElementConfig;
