# @dxs/qa-taf-core

## Get started

1. Open your repository
2. Configure you global .npmrc like @dxs:registry=https://art.pmideep.com/artifactory/api/npm/dxseng-npm-dev
   //art.pmideep.com/artifactory/api/npm/:_authToken={token configured jfroge}
   editor=code
   email={your email}
3. Install dependencies: `npm i @dxs/qa-taf-core`
4. Install cucumber: `npm i @cucumber/cucumber`
   1. How to use:
  
      1. Create cucumber hooks:
        ```typescript
          // hooks.ts
         import { provider, IProvider } from "@dxs/qa-taf-core";

          let pwProvider: IProvider
    
          Before(async () => {
              pwProvider = await provider(
                 { headless: false },  // LaunchOptions 
                 { baseURL: 'https://www.wikipedia.org' },  // BrowserContextOptions
                 'firefox'  // str Optional parameter to choose Browser to test on
              );
      
              const browser = pwProvider.browser;
              const context = pwProvider.context;
              const page = pwProvider.page;
          });
       
          After(async function (Scenario) {
              await pwProvider.browser.close();
          });
        ```
      
      Note: `provider()` function provides playwright functions

        ```typescript 
         browser = chromium.launch(); | browser = firefox.launch() | browser = webkit.launch()
         context = browser.newContext();
         page = context.newPage();
        ```
      
      3. How to creation new `PO component`:
        ```typescript
          // pageobject/header.component.ts
          import { POComponent, IPOLocators } from '@dxs/qa-taf-core';

          export class HeaderComponent extends POComponent {
              name = 'Header Component';
       
              get locators(): IPOLocators {
                  return {
                     'componentlocator': '[data-testid="customer-button"]'
                  };
              }
          }
        ```
        - note: Don't use `@RegisterPage()` on component
      4. How to creation new `PO page`:
        ```typescript
          // pagebbject/home.page.ts
          import { POPage, RegisterPage, IPOLocators } from "@dxs/qa-taf-core";
   
          @RegisterPage()
          class Home extends POPage {
              url = 'docs/emulation'
              name = '/home'
       
              get locators(): IPOLocators {
                  return {
                      'homePageLocator': 'li [href="#offline"]'
                  }
              }
          }
        ```
      5. How to use `PO component` inside `PO pages`:
        ```typescript
          @RegisterPage()
          export class Home extends POPage {
             readonly name = 'Home';
             readonly url = '/home';
   
             constructor(private headerComponent: HeaderComponent) {
                super();
             }
   
             get locators(): IPOLocators {
               return {
                   ...this.headerComponent.locators,
                  'homePageLocator': 'li [href="#offline"]'
               };
             }
          }
        ```
5. Initialization `PO` and connection to `cucumber`:
   
    Add `require: ['src/{put-your-page-object-path-here}/*.ts'],` in your cucumber.js runner config file. 
   - _Note_:  `{put-your-page-object-path-here}` is your pages where you have used `@RegisterPage()` decorator.
   
    Your final cucumber.js runner should look similar to the below example: 
    ```typescript
      // cucumber.js
      module.exports = {
          default: {
              parallel: 1,
              publishQuiet: true,
              dryRun: false,
              format: ['progress-bar', 'html:reports/cucumber-report.html', 'json:reports/cucumber-report.json'],
              runFeatures: [`src/${project}/features/**/*.feature`],
              paths: [`src/${project}/features/**/*.feature`],
              require: ['tsconfig.json', 'src/pageobject/*.ts'],
              requireModule: ['ts-node/register'],
          },
      };
    ```

6. How to use cucumber `features`:
  ```typescript
       // pageobject/header.component.ts
      import { POComponent, IPOLocators } from '@dxs/qa-taf-core';

      export class HeaderComponent extends POComponent {
         name = 'Header Component';
  
         get locators(): IPOLocators {
             return {
                'HeaderComponentLocator': 'locator'
             };
         }
      }
   
      // pageobject/home.page.ts
      import { RegisterPage, IPOLocators, POPage } from '@dxs/qa-taf-core';

      @RegisterPage()
      export class Home extends POPage {
         readonly name = 'Home';
         readonly url = '/home';

          constructor(private headerComponent: HeaderComponent) {
             super();
          }

          get locators(): IPOLocators {
            return {
                ...this.headerComponent.locators,
               'HomePageLocator': 'li [href="#offline"]'
            };
          }
       }
  ```
  Your `src/features/home.page.feature` file
  ``` gherkin
          
      
          Given I navigate to Home page
          // final url: process.env.BASE_URL/home
          // Will point to 'Home' page: 
          // After this step is used, use elements of 'Home' page and its commponenets ('HeaderComponent' in current example) directly in the following steps
          
          Then I click on 'HomePageLocator' element
          Then I click on 'HeaderComponentLocator' element
         
         
         // In case you don't want to navigtae to the page, but you are already in that page and wants to use that page elements you should point the page with the following step
          Given I am on Home page
          // Will point to 'Home' page: The following steps can use 'Home' page or 'HeaderComponent' elements directly
      
          Then I click on 'HomePageLocator' element
          Then I click on 'HeaderComponentLocator' element
  ```

5. Predefined `parameterTypes` and `steps`:
    > More information about parameterTypes in cucumber: https://cucumber.io/docs/cucumber/configuration/?lang=javascript

    Hints of using `parameterTypes`:

          {page} - Home page
          {element} - 'HomePageElement' element(s)

          // text should be stored inside Home page as a value of 'HomePageLocator' see below ex.
          {element} - 'HomePageElement' element by text 
          {element} - 'HomePageElement' element by index 1
      Ex. How to use `by text` <br />
      `pageobject/home.page.ts`
 
    ```typescript
   
       @RegisterPage()
       export class Home extends POPage {
       readonly name = 'Home';
       readonly url = '/home';
       
          get locators(): IPOLocators {
            return {
               'HomePageLocator': 'Welcome on Board'
            };
          }
       }
    ```
   ```gherkin
      Then I click on 'HomePageLocator' element by text

   ```
    1. Steps
      ```typescript
        import { Element, Page } from '@dxs/qa-taf-core';
        
        // Actions
       
        Given('I navigate to {page}', async (page: Page) => {
            await page.actions.goTo();
        });
       
        Given('I navigate to {page}', async (page: Page) => {
             await page.actions.goTo();
        });
             
        When('I perform accessibility check for {page}', async (page: Page) => {
             await page.accessibility.checkAxe();
        });
        
        Given('I execute browser console command {string} on {page}',
            async (command: string, page: Page) => {
                   await page.actions.evaluate(command);
            }
        );
        
        Then('I click on {element}', async (element: Element) => {
            await element.actions.click();
        });
       
        // Assertions
       
        Then('{page} should have {string} url', async (page: Page, text) => {
            await page.expects.toHaveURL(text);
        });
       
        Then('{element} should{reverse} be {validationDom}',
            async (element: Element, reverse: boolean, validationDom: string) => {
                await element.expects.verify(validationDom, reverse);
            }
        );
       
       // Memory
       
        When('I remember the text of {element} as {string}',
            async (element: Element, key: string) => {
                const text: string = await element.actions.getText();
                memory.set(key, text);
            }
        );
      ```

6. using interactions by directly passing locator to it
```typescript
  import { Element } from '@dxs/qa-taf-core';

   await Element.init('#js-link-box-en').actions.click()
```


## XRAY integration
For integrating TAF to XRAY / JIRA you need to
* Enter your jira token in TOKEN variable in .env file.
 ```
    TOKEN='OhogxPBYrvR81oA4tP5X05bxsQITCIe76hCX'
   ```
* Update your package.json with the following command for uploading test cases into xRay:

  `dxs -- uploadXrayTestCases [PARAMS]`

```

| CLI params    | Description                                                 | Required |
| ------------- | ----------------------------------------------------------- | -------- |
| `projectKey`  | The Jira project test cases should be uploaded to           | +        |
| `featurePath` | Path to the feature files want to be included in the upload | +        |

```
* Update your package.json with the following command for uploading test execution results into xRay:

  `dxs -- uploadXrayResults [PARAMS]`
```
| CLI params    | Description                                                 | Required |
| ------------- | ----------------------------------------------------------- | -------- |
| `projectKey`  | The Jira project test cases should be uploaded to           | +        |

```
* Note that Jira should be opened during uploading
* Note that if you want to specify component for your tests you need to add 
  COMPONENT_ID variable in .env file and assign id of your project component.
 ```
COMPONENT_ID=11111
   ```
## Screenshot testing

Put in your feature file the following step, specify the **path** of expected screenshot and **page** .

`Then I should compare actual and expected "expectedScreens/BackOffice.png" screenshots for BackOffice page
`

By default threashold for screenshots is set 0.001, if you want to increase threshold number, then you need to
import config in hooks file like
`import { config } from '@dxs/qa-taf-core/build/core/configs/config';`
and set 
`config.screenshotTestingThreshold = 2.0;` or whatever number you need in before hook in your project framework
