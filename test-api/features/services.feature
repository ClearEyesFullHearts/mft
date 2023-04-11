Feature: Async Services
Test the async services running

  Scenario: logs are recorded
    Given I can publish to logs exchange
    And I have a correct log message
    When I publish to event.rest-api.info
    Then elastic should find 1 document for `mySessionId`

  Scenario: warnings are recorded
    Given I can publish to logs exchange
    And I have a correct log message
    When I publish to event.rest-api.warning
    Then elastic should find 2 document for `mySessionId`
    And an e-mail containing `mySessionId` was sent to level2-list@mft.com