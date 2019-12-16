Feature: Log to mft
Test the login page and the security of unauthorized pages.

  Scenario: I log to mft
    Given I browse to login page
    And I fill email input as "testtest"
    And I fill password input as "password"
    When I click on connect
    Then I am on landing page