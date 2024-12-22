@steps
Feature: Test steps

  Background:
    Given I navigate to Wiki page

  Scenario: Verify getCSSPropertyStep - font
    Then "Title" element css style "font-family" on Wiki page should equal '"Linux Libertine", "Hoefler Text", Georgia, "Times New Roman", Times, serif'
    And Order in "languageOptions" collection should not be deep equal to alphabetical order
    And I wait 2 ms on Wiki page

  @mobile
  Scenario: Checking mobile actions
    When I tap on "EnglishLang" element
    And I wait 500 ms on Wiki page
    Then "WelcomeToWikipedia" element should be visible

  Scenario: Checking step definitions
    When I wait 2 ms on Wiki page
    And I save current Wiki page url as "currentUrl"
    Then Wiki page should have "$currentUrl" url
    And "Header" element should equal "json:core/tests/testData/testData.json:HeaderText" text
   # And "Header" element should equal "jsonEnv:core/tests/testData/testDataEnvSpecific.json:HeaderText" text
    And I should wait until "languageListButton" element is visible
    And The count of "languageOptions" collection items should be greater than "9"
    And The count of "languageOptions" collection items should be lower than "11"
    And The count of "languageOptions" collection items should be equal "10"
    And The texts of "languageOptions" collection items should include members
      | English |
      | 日本語  |
      | Español |
    When I select "hu" option from "searchLanguageDropdown" element
    Then "selectedLanguageLabel" element should contain "hu" text
    When I select "Polski" text from "searchLanguageDropdown" element
    Then "selectedLanguageLabel" element should contain "pl" text
    When I fill "$search.lettersOnly" on "searchField" element
    Then "searchField" element should have "$search.lettersOnly" input value
    When I press "Backspace" key on "searchField" element
    Then "searchField" element should have "tes" input value
    When I click on "searchField" element
    And I press "Backspace" key on Wiki page
    Then "searchField" element should have "te" input value
    When I clear "searchField" element
    Then "searchField" element should have "" input value
    When I click "English" text in "languageOptions" collection
    Then I should wait for "Main_Page" url until commit on Wiki page
    Then Wiki page should have "https://en.wikipedia.org/wiki/Main_Page" url

  Scenario: Checking step definitions - element query
    When I wait 2 ms on Wiki page
    And I should wait until "languageListButton" element is visible
    Then "languageOptionDescription" in "languageOptionCard" with text "English" in "languageOptionsPanel" element query should contain "articles" text
    And "languageOptionDescription" in "languageOptionCard" by index 2 in "languageOptionsPanel" element query should contain "記事" text
    When I click on "languageOptions" with text "English" element query
    Then I should wait for "Main_Page" url until commit on Wiki page
    Then Wiki page should have "https://en.wikipedia.org/wiki/Main_Page" url

  Scenario: Mock the response of API request
    Given I navigate to Swagger page
    When I click on "allowCookiesBtn" element query for 1 times
    And I click on "inventoryOption" element
    And I click on "tryItOutBtn" element
    When I mock the response with "core/tests/fixtures/responseBodyMockExample.json" body and 201 status code for "https://petstore.swagger.io/v2/store/inventory" request
    And I click on "executeBtn" element
    And I wait 1000 ms on Swagger page
    Then "responseCode" element should contain "201" text
    And "responseBody" element should contain "Response body is mocked" text
    When I mock the response code for "https://petstore.swagger.io/v2/store/inventory" request with code 404
    And I click on "executeBtn" element
    And I wait 1000 ms on Swagger page
    Then "responseCode" element should contain "404" text
    And "responseBody" element should contain "Error: Not Found" text
    And "responseBody" element should match "Error.*" text

  Scenario: Memory test
    Given I navigate to Wiki page
    When I wait 2 ms on Wiki page
    And I remember "pedia" as "partialText"
    Then "Title" element should contain "Wiki$partialText$" text
    And "Title" element should contain "$partialText" text
    And "Title" element should match "Wiki.*" text
    And "Languages" element by index 1 should be visible
    And Each "Languages" elements should be visible
    When I fill "$partialText" on "searchField" element
    Then "searchField" element should have "pedia" input value
    And I remember "English" as "language"
    When I click "$language" text in "languageOptions" collection
    Then I should wait for "Main_Page" url until commit on Wiki page
    Then Wiki page should have "https://en.wikipedia.org/wiki/Main_Page" url
    When I navigate to TimeAndDate page
    When I remember the value of "currentYear" element as "year"
    And I fill "$year" on "wordClockSearchField" element
    And I click on "agreeToCookies" element if it is "visible"
    And I click on "wordClockSearchButton" element
    And I should wait until "wordClockSearchResultHeading" element is visible
    And I wait 9000 ms on TimeAndDate page
    Then "wordClockSearchResultHeading" element should contain "$year" text

  Scenario: Read post request body
    Given I navigate to Swagger page
    When I click on "allowCookiesBtn" element
    And I click on "orderOption" element
    And I click on "tryItOutBtn" element
    And I remember postdata of "https://petstore.swagger.io/v2/store/order" request as "requestBody"
    And I click on "executeBtn" element
    And I wait 1000 ms on Swagger page
    Then Post data "requestBody" should contain "\"id\": 0,\n  \"petId\": 0,\n  \"quantity\": 0,\n"

  Scenario: Upload a file
    Given I navigate to Upload page
    When I upload the file by path "core/tests/fixtures/responseBodyMockExample.json" in "fileUpload" element
    And I click on "uploadButton" element
    Then "header" element should contain "File Uploaded!" text

  Scenario: Scroll to element
    When I scroll to the "PrivacyPolicyLink" element
    Then "PrivacyPolicyLink" element should be visible

  Scenario: Download JSON file
    Given I navigate to Download JSON page
    When I download the file as "core/tests/fixtures/test_import.json" from "downloadButton" element
    Then JSON "core/tests/fixtures/test_import.json" should contain "Luke" text

  Scenario: Browser "Go back" button leads to the previously visited page, page title tag changes correspondingly
    When I click "English" text in "languageOptions" collection
    And I click on "SearchButton" element
    And I wait for the specific URL "Search"
    Then the page title tag should be "Search - Wikipedia"
    And I click "Go back" button in browser
    Then the page title tag should be "Wikipedia, the free encyclopedia"

  Scenario: "Search" field's border-color changes depending on its focus state
    When I click on "SearchFieldInput" element if it is "visible"
    And I wait 1500 ms on Wiki page
    Then "SearchFieldInput" element css style "border-bottom-color" on Wiki page should equal 'rgb(51, 102, 204)'
    When I click outside to lose focus on elements
    And I wait 2000 ms on Wiki page
    Then "SearchFieldInput" element css style "border-bottom-color" on Wiki page should equal 'rgb(162, 169, 177)'

  Scenario: Perform some verifications on a collection
    When I click "English" text on the page
    Then the url of opened page ends with "/wiki/Main_Page"
    And I should wait until "TextPreferencesSection" element by index 0 is visible
    Then Order in "TextPreferencesSection" collection should be deep equal "json:core/tests/testData/testData.json:textPreferencesOption"
    And Each element in "TextPreferencesSection" collection should have "class" attribute deep equal "cdx-radio__label" text
    When I type "$requests.searchRequests.searchForCat" on "searchField" element
    And I press "Enter" key on Wiki page
    And I wait for the specific URL "Cat"
    And I should wait until "ExpandableContentsList" element by index 0 is visible
    And I click on each element in "ExpandableContentsList" collection
    Then Each element in "ExpandableContentsList" collection should have "aria-expanded" attribute deep equal "true" text
    And "LanguageDropDown" element should be visible
    When I click on each "Behavior" text in "TitlesInContentsList" collection
    Then "BehaviorContentsListItem" element "class" attribute should contain "vector-toc-list-item-active" text
    Then CSS "font-family" properties for collection of "TitlesInContentsList" element should be equal to "sans-serif"
    When I fetch the "href" attributes of elements in the "VisibleFooterLinks" collection and save them as "WikipediaFooterLinks"
    And I stringify "$WikipediaFooterLinks" value from memory
    And I remember "json:core/tests/testData/testData.json:ExpectedWikiFooterLinks" as "ExpectedWikiFooterLinks"
    Then Arrays from memory "$WikipediaFooterLinks" should be equal "$ExpectedWikiFooterLinks"
    When I remember the text of "VisibleFooterLinks" collection as "WikipediaFooterLinksText"
    And I stringify "$WikipediaFooterLinksText" value from memory
    And I remember "json:core/tests/testData/testData.json:ExpectedWikiFooterLinksText" as "ExpectedWikiFooterLinksText"
    Then Arrays from memory "$ExpectedWikiFooterLinksText" should be equal "$WikipediaFooterLinksText"

  Scenario: Check if the displayed date matches today's date
    When I navigate to TimeAndDate page
    And I click on "agreeToCookies" element if it is "visible"
    Then "currentDate" element should contain today's date in format of "en-GB" locale

  Scenario: Modify remembered value so it doesn't contain any special symbols and compare with expected value
    When I navigate to TimeAndDate page
    And I click on "agreeToCookies" element if it is "visible"
    And I remember the text of "infoSections" element by index 4 as "sectionTitle"
    And I remove "&" characters from "$sectionTitle"
    And I remove " " characters from "$sectionTitle"
    And I remove "," characters from "$sectionTitle"
    Then "$sectionTitle" should be "equal" "SunMoonSpace"

  Scenario: Verify year number on TimeAndDate page
    When I navigate to TimeAndDate page
    And I click on "agreeToCookies" element if it is "visible"
    And I remember the "value" attribute of "currentYear" element as "currentYear"
    Then "$currentYear" should be "greater than" "2023"

  Scenario: Check that value "12" in month dropdown list means December
    When I navigate to TimeAndDate page
    And I should wait for load state
    And I click on "agreeToCookies" element if it is "visible"
    And I select "12" value in "monthDDL" element
    And I click on "agreeToCookies" element if it is "visible"
    And I click "View Calendar" text on the page
    Then "calendarTitle" element should contain "Calendar for December 2024" text

  Scenario: Change Heading by console script to a long one to check if the heading is fully visisble on minimized window
    Given I should wait until "TermsOfUseButton" element is visible
    When I click on "TermsOfUseButton" element
    Then I wait for Wiki page loaded
    And "Heading" element should contain "Terms of Use" text
    When I set window size 900px width and 500px height
    And I execute console command "json:core/tests/testData/testData.json:SetLongHeadingTitle" on Wiki page
    Then "Heading" element should equal "json:core/tests/testData/testData.json:LongHeadingTitle" text

  Scenario: I expand search panel with JS click and check that class for navigation panel is updated
    When I navigate to TimeAndDate page
    And I should wait until "agreeToCookies" element is visible
    And I click on "agreeToCookies" element if it is "visible"
    And I click on "searchButton" element with JS on TimeAndDate page
    Then "navigationPanel" element "class" attribute should contain "json:core/tests/testData/testData.json:test" text

  Scenario: Request the information about Available Pets and check if it contains the expected information
    When I navigate to Swagger page
    And I click on "allowCookiesBtn" element
    And I click on "postPetOption" element
    And I click on "tryItOutBtn" element
    And I click on "executeBtn" element
    Then I should wait until "responseCode" element is visible
    When I create "get" request for "https://petstore.swagger.io/v2/pet/findByStatus?status=available" endpoint and save it as "requestAvailablePets"
    And I send the "$requestAvailablePets" request and save the response as "availablePetsResponse"
    Then the body for "$availablePetsResponse" response should contain a defined property on the following path "body.name"
    When I count objects on the following path "body" from "$availablePetsResponse" response as "amountOfAvailablePets" in memory
    And I convert "amountOfAvailablePets" number to text
    Then "$amountOfAvailablePets" should be "greater than" "0"
    When I filter "availablePetsResponse" from memory on the following path "body" to objects with property "name" not matching "cat"
    And I sort "availablePetsResponse" from memory on the following path "body" based on property "name"
    And I save the value on the following path "body.name" from "$availablePetsResponse" object as "namesOfAvailablePets" in memory
    And I stringify "$namesOfAvailablePets" value from memory
    Then "$namesOfAvailablePets" should be "containing" "doggie"

  Scenario: Check CSS properties and the text of "My Location" option in "My Account" menu on TimeAndDate page
    When I open the URL "https://www.timeanddate.com/"
    And I am on TimeAndDate page
    And I should wait until "agreeToCookies" element is visible
    And I click on "agreeToCookies" element if it is "visible"
    And I click on "expandNavigationMenuButton" element if I am using mobile
    And I hover for desktop or click for mobile on "myAccountDropDownMenu" element
    And I should wait until "myAccountDropDownMenuList" element is visible
    Then CSS "align-items" property of "myLocationOption" element should be equal to "center"
    And CSS "font-size" property of "myLocationOption" element should be equal to "14px"
    And CSS "text-align" property of "myLocationOption" element should be equal to "left"
    And CSS "white-space-collapse" property of "myLocationOption" element should be equal to "collapse"
    And CSS "background-size" property of "myLocationOption" element should be equal to "auto"
    Then "myLocationOption" element should equal "My Location" text for desktop and "My Location" for mobile
