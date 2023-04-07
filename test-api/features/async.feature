Feature: Async Services
Test the async services running

  @Nominal
  Scenario: logs are recorded
    Given I can publish to logs exchange
    And I have a correct log message
    When I publish to event.rest-api.info
    Then elastic should find 1 document for `mySessionId`