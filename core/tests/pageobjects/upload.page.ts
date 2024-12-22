import { POPage, RegisterPage } from '../../poHandler';
import { IPOLocators } from '../../interfaces/poHandler';

@RegisterPage()
export class Upload extends POPage {
  readonly name = 'Upload';

  readonly url = 'https://the-internet.herokuapp.com/upload';

  // eslint-disable-next-line class-methods-use-this
  get locators(): IPOLocators {
    return {
      fileUpload: 'input#file-upload',
      uploadButton: '#file-submit',
      header: '.example h3'
    };
  }
}
