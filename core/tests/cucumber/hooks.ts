import { After, Before, BeforeAll, AfterAll } from '@cucumber/cucumber';
import path from 'path';
import fs from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Pact } from '@pact-foundation/pact';
import { devices } from 'playwright';
import { IProvider } from '../../interfaces/provider';
import { provider } from '../../interactions';
import { config } from '../../configs/config';
import { memory } from '../../utils/memory';

const filePathToTestData = 'core/tests/fixtures/testData.json';
let pwProvider: IProvider;
// eslint-disable-next-line import/no-mutable-exports

BeforeAll(async () => {
  const file = fs.readFileSync(filePathToTestData, 'utf8');
  const obj = JSON.parse(file);
  const wikiTestData = obj.wiki;
  memory.setAll(wikiTestData);
  if (process.env.CONTRACT === 'yes') {
    const pactProvider = new Pact({
      dir: path.resolve(process.cwd(), 'pacts'),
      port: 8081,
      consumer: 'Example Consumer',
      provider: 'Example Dependencies'
    });
    await pactProvider.setup();
    memory.set('mockProvider', pactProvider);
  }
});

AfterAll(async () => {
  if (process.env.CONTRACT === 'yes') {
    const pactProvider = memory.getValues('$mockProvider') as Pact;
    await pactProvider.writePact();
    await pactProvider.finalize();
  }
});

// eslint-disable-next-line import/no-mutable-exports
export let page: any = {};

Before(async () => {
  const contextOptions = {
    baseURL: config.baseURL,
    ...devices[config.device]
  };
  const browser = {
    YES: [`--remote-debugging-port=${config.debugPort}`],
    NO: ['']
  };

  pwProvider = await provider(
    {
      headless: true,
      args: browser[config.performance],
      channel: config.browser
    },
    contextOptions
  );

  // eslint-disable-next-line prefer-destructuring
  page = pwProvider.page;
});

After(async () => {
  await pwProvider.browser.close();
});
