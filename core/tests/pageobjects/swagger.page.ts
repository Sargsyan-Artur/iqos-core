import { POPage, RegisterPage } from '../../poHandler';
import { IPOLocators } from '../../interfaces/poHandler';

@RegisterPage()
export class Swagger extends POPage {
  readonly name = 'Swagger';

  readonly url = 'https://petstore.swagger.io/';

  // eslint-disable-next-line class-methods-use-this
  get locators(): IPOLocators {
    return {
      allowCookiesBtn: '.ch2-dialog-actions button.ch2-allow-all-btn',
      inventoryOption: '//span[@data-path="/store/inventory"]',
      orderOption: '//span[@data-path="/store/order"]',
      tryItOutBtn: '.try-out__btn',
      executeBtn: '.btn.execute',
      responseBody: '.live-responses-table .response .response-col_description',
      responseCode: '.live-responses-table .response .response-col_status',
      postPetOption: '#operations-pet-addPet',
      requestBodyTextArea: 'textarea.body-param__text'
    };
  }
}
