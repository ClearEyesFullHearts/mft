Feature: Server health
Test the server health API

  @Nominal
  Scenario: Server is up
    Given I set Accept header to application/json
    When I GET /health
    Then response code should be 200
    And response body path $.status should be UP

  @Nominal
  Scenario: Admin can get server informations
    Given I set an admin bearer token
    When I GET /info
    Then response code should be 200
    And response body path $.user.roles[0] should be ROLE_USER
    And response body path $.user.roles[1] should be ROLE_ADMIN

  @Nominal
  Scenario: User cannot get server informations
    Given I set an user bearer token
    When I GET /info
    Then response code should be 403
    And response body path $.code should be BAD_ROLE

  @Nominal
  Scenario: I cannot get server informations with bad token
    Given I set a bad bearer token
    When I GET /info
    Then response code should be 403
    And response body path $.code should be BAD_TOKEN

  @Nominal
  Scenario: Guest cannot get server informations
    Given I set Accept header to application/json
    When I GET /info
    Then response code should be 401
    And response body path $.code should be NO_AUTH_HEADER

  Scenario: Admin can trigger a config reload
    Given I set an admin bearer token
    And I set body to { "apps": ["*"] }
    When I PUT /config/load
    Then response code should be 200