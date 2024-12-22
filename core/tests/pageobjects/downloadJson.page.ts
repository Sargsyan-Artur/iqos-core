import { POPage, RegisterPage } from '../../poHandler';
import { IPOLocators } from '../../interfaces/poHandler';

@RegisterPage()
export class DownloadJson extends POPage {
  readonly name = 'Download JSON';

  readonly url =
    'https://jsoneditoronline.org/indepth/datasets/json-file-example/';

  // eslint-disable-next-line class-methods-use-this
  get locators(): IPOLocators {
    return {
      downloadButton: '[title*="100 users"]'
    };
  }
}
