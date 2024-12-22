/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line import/no-extraneous-dependencies
import JsonQuery from 'json-query';
import { Logger } from 'winston';
import { logger } from './logger';
import { IMemoryConf } from '../interfaces/memory';

export class Memory<Value = unknown> {
  private isChanged = false;

  private readonly cache: Map<string, Value> = new Map<string, Value>();

  private readonly log: Logger;

  constructor(private conf: IMemoryConf) {
    this.log = logger('MEMORY');
  }

  public config(conf: IMemoryConf): void {
    if (this.isChanged) {
      this.log.warn('Memory configurations are changed');

      return;
    }
    this.conf = conf;
    this.isChanged = true;
  }

  public has(key: string): boolean {
    return this.cache.has(key);
  }

  public set(key: string, value: Value): void {
    if (this.has(key)) {
      if (!this.conf.overwrite) {
        throw new Error(`Cannot overwrite value of '${key}' key.`);
      }
      this.log.warn(`Overwriting value of '${key}' key in '${value}' value`);
    }
    this.cache.set(key.trim(), value);
  }

  public setAll(obj: any): void {
    Object.keys(obj).forEach((key) => {
      this.cache.set(key, obj[key]);
    });
  }

  public get(key: string): any {
    const keys = key.split(/\.(.*)/s);
    const mainKey = keys[0];
    const mainKeyValue = this.cache.get(mainKey);
    if (mainKeyValue === undefined) {
      throw new Error(`There is no such key as '${key}' in memory`);
    }
    if (keys.length === 1) {
      return this.cache.get(key)!;
    }
    const [objectName, pathToProperty] = keys;
    const obj = this.cache.get(objectName);
    const propertyValue = JsonQuery(pathToProperty, { data: obj }).value;
    if (propertyValue === undefined) {
      throw new Error(
        `Failed to retrieve value: No property matches path '${pathToProperty}'`
      );
    }
    return propertyValue;
  }

  public getValue(keyOrValue: string): any {
    const singleDollarSignRegExp = /^\$[^$]*$/gm;
    const doubleDollarSignRegExp = /(\$[^$]+\$)/gm;
    if (keyOrValue.match(singleDollarSignRegExp)) {
      return this.get(keyOrValue.replace('$', ''))!;
    }
    if (keyOrValue.match(doubleDollarSignRegExp)) {
      const memoryReplacer = (match: string): string =>
        this.get(match.replace(/\$/gm, '')) as string;
      return keyOrValue.replace(doubleDollarSignRegExp, memoryReplacer);
    }
    return keyOrValue;
  }

  public getValues(
    keysOrValues: any
  ): string | string[] | number | boolean | object {
    if (Array.isArray(keysOrValues)) {
      return keysOrValues.map((keyOrValue) => this.getValue(keyOrValue));
    }
    return this.getValue(keysOrValues);
  }

  public delete(key: string): boolean {
    if (!this.has(key)) {
      throw new Error(`There is no such key as '${key}' in memory`);
    }

    return this.cache.delete(key);
  }

  public clear(): void {
    this.log.warn('Cleared the all cache');

    return this.cache.clear();
  }
}

export const memory = new Memory({ overwrite: false });
