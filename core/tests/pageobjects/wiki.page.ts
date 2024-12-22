import { POPage, RegisterPage } from '../../poHandler';
import { IPOLocators } from '../../interfaces/poHandler';

@RegisterPage()
export class Wiki extends POPage {
  readonly name = 'Wiki';

  readonly url = '';

  /* eslint-disable class-methods-use-this */
  get locators(): IPOLocators {
    return {
      SomeLocator: 'test',
      languageListButton: '#js-lang-list-button',
      languageOptionsPanel: '.central-featured',
      languageOptions: '.central-featured-lang strong',
      languageOptionCard: '.central-featured-lang',
      languageOptionDescription: 'span',
      searchField: '#searchInput',
      searchLanguageDropdown: '#searchLanguage',
      selectedLanguageLabel: '#jsLangLabel',
      Title: '.central-textlogo',
      Languages: 'body .central-featured-lang',
      EnglishLang: '#js-link-box-en',
      WelcomeToWikipedia: '#Welcome_to_Wikipedia',
      Header: '//h1[@class="central-textlogo-wrapper"]/strong',
      PrivacyPolicyLink: '.site-license [data-jsl10n="privacy-policy"]',
      SearchFieldInput: 'input[name="search"]',
      SearchButton: '#searchform>button',
      TextPreferencesSection:
        '#skin-client-prefs-vector-feature-custom-font-size form div label',
      ExpandableContentsList: '#mw-panel-toc-list li.vector-toc-level-1 button',
      TitlesInContentsList: '#mw-panel-toc-list li span',
      LanguageDropDown: '#p-lang-btn-checkbox',
      BehaviorContentsListItem: '#toc-Behavior',
      TermsOfUseButton: '[data-jsl10n="terms"]',
      Heading: 'h1#firstHeading',
      VisibleFooterLinks: '#footer-places li:not([style*="display: none"]) a'
    };
  }
}
