export interface IPOPage<T> {
  new (...args: unknown[]): T;
}

export interface IPOLocators {
  [key: string]: string;
}
