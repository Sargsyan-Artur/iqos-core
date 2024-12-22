import { defineParameterType } from '@cucumber/cucumber';

import fs from 'fs';
import { IOC, POPage } from '../poHandler';
import {
  ICollectionConfig,
  IElementConfig,
  IPageConfig
} from '../interfaces/element';
import { Page } from '../interactions/page';
import { memory } from '../utils/memory';
import { parseElementQuery } from '../interactions/element/elementParser';

// eslint-disable-next-line import/no-mutable-exports
export let poPage: POPage;

defineParameterType({
  name: 'page',
  regexp: /(\w{1,30}(\s\w{1,30}){0,2}?) page/,

  transformer: (name: string) => {
    poPage = IOC.getPage(name);

    const pageConfig: IPageConfig = {
      url: poPage.url
    };

    return Page.init(pageConfig);
  },
  useForSnippets: false
});

defineParameterType({
  name: 'elementQuery',
  regexp:
    /(".*?"(?: with text ".*?")?(?: by index \d+)?(?: in ".*?"(?: with text ".*?")?(?: by index \d+)?)*) element query/,

  transformer: (elementQuery: string) =>
    parseElementQuery(elementQuery, poPage),
  useForSnippets: false
});

defineParameterType({
  name: 'element',
  regexp: /"([^"]*)" element(?:s)?(?: (by index (\d+)|by text "([^"]*)"))?/,

  transformer: (name: string, options: string) => {
    const locator = poPage.getLocator(name);

    const elementConfig: IElementConfig = {
      locator,
      options
    };

    return Page.init(elementConfig).element;
  },
  useForSnippets: false
});

defineParameterType({
  name: 'collection',
  regexp: /"([^"]*)" collection/,

  transformer: (name: string) => {
    const locator = poPage.getLocator(name);

    const collectionConfig: ICollectionConfig = {
      locator
    };

    return Page.init(collectionConfig).collection;
  },
  useForSnippets: false
});

defineParameterType({
  name: 'validation',
  regexp:
    /be|contain|have|equal|have property|deep equal|match|include members|have members/,

  transformer: (condition: string) => condition,

  useForSnippets: false
});

defineParameterType({
  name: 'validationCollection',
  regexp: /include members|have members|match/,

  transformer: (condition: string) => condition,

  useForSnippets: false
});

defineParameterType({
  name: 'validationDom',
  regexp: /visible|disabled|enabled|editable|checked|hidden/,

  transformer: (condition: string) => condition,

  useForSnippets: false
});

defineParameterType({
  name: 'validationWait',
  regexp: /attached|detached|visible|hidden/,

  transformer: (condition: string) => condition,

  useForSnippets: false
});

defineParameterType({
  name: 'validationNumber',
  regexp: /equal|greater than|lower than/,

  transformer: (condition: string) => condition,

  useForSnippets: false
});

defineParameterType({
  name: 'reverse',
  regexp: /( not)?/,

  transformer: (condition: string) =>
    !!(condition && condition.trim() === 'not'),

  useForSnippets: false
});

defineParameterType({
  name: 'pseudoElement',
  regexp: /(?: pseudo element (after|before|backdrop))?/,

  transformer: (pseudoElement: string) =>
    // eslint-disable-next-line prettier/prettier
    (pseudoElement ? `::${pseudoElement}` : pseudoElement),

  useForSnippets: false
});

defineParameterType({
  name: 'waitForUrlOptions',
  regexp: /(load|domcontentloaded|networkidle|commit)/,

  transformer: (option: string) => option,

  useForSnippets: false
});

defineParameterType({
  name: 'mock',
  regexp: /(?:[\\/]?[\w.-]+)+\.json/,

  transformer: (filepath: string) => fs.readFileSync(filepath, 'utf8'),
  useForSnippets: false
});

defineParameterType({
  name: 'isArray',
  regexp: /( array of)?/,

  transformer: (condition: string) =>
    !!(condition && condition.trim() === 'array of'),

  useForSnippets: false
});

defineParameterType({
  name: 'data',
  regexp: /"([^"]*)"/,

  transformer: (key: string) => {
    if (key.startsWith('jsonEnv')) {
      const filePath: string = key.split(':')[1];
      const object: string = key.split(':')[2];
      const jsonData: string = fs.readFileSync(filePath, 'utf8');
      const parsedJsonData = JSON.parse(jsonData);
      return parsedJsonData[process.env.JSON_ENV][object];
    }
    if (key.startsWith('json')) {
      const filePath: string = key.split(':')[1];
      const object: string = key.split(':')[2];
      const jsonData: string = fs.readFileSync(filePath, 'utf8');
      const parsedJsonData = JSON.parse(jsonData);
      if (object === undefined) {
        return parsedJsonData;
      }
      return parsedJsonData[object];
    }
    return memory.getValue(key);
  },

  useForSnippets: false
});

defineParameterType({
  name: 'waitForLoadState',
  regexp: /(load|domcontentloaded|networkidle)/,

  transformer: (option: string) => option,

  useForSnippets: false
});

defineParameterType({
  name: 'optionalString',
  regexp: /(?: "(.*)")?/,

  transformer: (condition: string) => condition,

  useForSnippets: false
});

defineParameterType({
  name: 'createOrUpdateInMemory',
  regexp: /as|and add to/,

  transformer: (condition: string) => condition,

  useForSnippets: false
});

defineParameterType({
  name: 'validationProperty',
  regexp: /matching|not matching|is defined|is not defined|included in/,

  transformer: (condition: string) => condition,

  useForSnippets: false
});
