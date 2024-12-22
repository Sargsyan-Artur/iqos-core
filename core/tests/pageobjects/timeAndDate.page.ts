import { POPage, RegisterPage } from '../../poHandler';
import { IPOLocators } from '../../interfaces/poHandler';

@RegisterPage()
export class TimeAndDate extends POPage {
  readonly name = 'TimeAndDate';

  readonly url = 'https://www.timeanddate.com/';

  // eslint-disable-next-line class-methods-use-this
  get locators(): IPOLocators {
    return {
      currentDate: '#ij2',
      agreeToCookies: '#qc-cmp2-ui button[mode="primary"]',
      infoSections: 'section.tad-box-explore h3.tad-box__label',
      currentYear: '#boxyear',
      monthDDL: '#month',
      calendarTitle: '#calarea h1',
      searchButton: '#site-nav-search-btn',
      navigationPanel: '#nav',
      wordClockSearchField: 'form[action="/worldclock/"]>input[type="search"]',
      wordClockSearchButton:
        'form[action="/worldclock/"]>button[type="submit"]',
      wordClockSearchResultHeading: '#clc-results>h2',
      expandNavigationMenuButton: '#site-nav-menu',
      myAccountDropDownMenu:
        '//a[@class="site-nav__title"]//*[contains(text(),"My Account")]',
      myAccountDropDownMenuList:
        '.site-nav__menu--my-account .site-nav__sub-menu',
      myLocationOption: '#popchi'
    };
  }
}
