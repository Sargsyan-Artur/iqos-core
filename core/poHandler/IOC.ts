import 'reflect-metadata';
import { Logger } from 'winston';

import { POPage } from './POPage';
import { IPOPage } from '../interfaces/poHandler';
import { logger } from '../utils/logger';

export class IOC {
  private static container = new Map<string, POPage>();

  private readonly log: Logger;

  constructor() {
    this.log = logger('CONTAINER');
  }

  private static resolve(Target: IPOPage<POPage>): POPage {
    const metadata = Reflect.getMetadata('design:paramtypes', Target) || [];

    const injections = metadata.map((data) => this.resolve(data));

    const instance = new Target(...injections);

    if (!instance.name) {
      throw new Error('Class name is required');
    }

    return instance;
  }

  public static register(target: IPOPage<POPage>) {
    const instance = IOC.resolve(target);
    IOC.container.set(instance.name, instance);
  }

  public static getPage<T extends string>(name: T): POPage {
    if (!IOC.container.has(name)) {
      throw new Error(`No page with name '${name}'`);
    }

    return IOC.container.get(name);
  }
}

export function RegisterPage() {
  return function register(target: IPOPage<POPage>): void {
    Reflect.getMetadata('design:paramtypes', target);
    IOC.register(target);
  };
}
