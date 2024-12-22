import { DataTable } from '@cucumber/cucumber';
import { memory } from './memory';
import * as config from '../configs/config';

export function dataTableToObject(dataTable: DataTable): {
  [key: string]: string;
} {
  const obj: { [key: string]: string } = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of dataTable.raw()) {
    // TODO Move this double $ char functionality to core -> memory
    const memoryReplacer = (match: string): string =>
      memory.getValue(match.slice(0, -1));
    const configReplacer = (match: string): string => {
      let result: object | string = config;
      const pathWithoutRoot = match.replace('config.', '');
      const pathProperties = pathWithoutRoot.split('.');
      // eslint-disable-next-line no-restricted-syntax
      for (const property of pathProperties) {
        result = result[property];
      }

      return result as string;
    };
    obj[key] = value
      .replace(/(\$\w+\$)/gm, memoryReplacer)
      .replace(/(config\..*)/gm, configReplacer);
  }

  return obj;
}

export function docStringToObject(docString: string): object {
  const replacer = (match: string): string => memory.getValue(match);
  // eslint-disable-next-line no-param-reassign
  docString = docString.replace(/\$([^"]+)/gm, replacer);
  return JSON.parse(docString);
}
