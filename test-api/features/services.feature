Feature: Async Services
Test the async services running

  Scenario: logs are recorded
    Given I can publish to logs exchange
    And I have a correct log message
    When I publish to event.rest-api.info
    Then elastic should find 1 document for `mySessionId`

  Scenario: log-manager keeps garbage out
    Given I am listening to Kafka on topic garbage.out
    And I can publish to logs exchange
    And I have a correct log message
    When I publish to event.wrong.topic
    Then I should receive 1 trash from log-manager

  Scenario: warnings are recorded
    Given I can publish to logs exchange
    And I have a correct log message
    When I publish to event.rest-api.warning
    Then elastic should find 2 document for `mySessionId`
    And an e-mail containing `mySessionId` was sent to level2-list@mft.com

  Scenario: failures are recorded
    Given I can publish to logs exchange
    And I have a correct log message
    When I publish to event.rest-api.failure
    Then elastic should find 2 document for `mySessionId`
    And an e-mail containing `mySessionId` was sent to level1-list@mft.com

  Scenario: errors are recorded
    Given I can publish to logs exchange
    And I have a correct log message
    When I publish to event.rest-api.error
    Then elastic should find 2 document for `mySessionId`
    And an e-mail containing `mySessionId` was sent to level3-list@mft.com

  Scenario: mail-worker catch error as garbage
    Given I am listening to Kafka on topic garbage.out
    And I can publish to worker exchange
    And I have a wrong mail message
    When I publish to process.mail
    And I should receive 1 trash from mail-worker
    And an e-mail containing `mySessionId` was sent to level1-list@mft.com
    Then elastic should find 2 document for `mySessionId`

  Scenario: Mail is sent
    Given I can publish to worker exchange
    And I have a correct mail message
    When I publish to process.mail
    Then an e-mail was sent to `mailTarget`
    And elastic should find 1 document for `mySessionId`