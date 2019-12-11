Feature: User creation and login
Test the server connection API

  @Nominal
  Scenario: Register a new user
    Given I set body to {"username":"mft-test", "email":"mft-test@mathieufont.com", "password":"testtest"}
    When I POST to /users
    Then response code should be 201
    And response body path $.auth should be true
    And response body path $.roles[0] should be ROLE_USER
    And response body path $.token should be ^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$
    And response body path $.user.id should be ^[1-9]\d*$

  @Nominal
  Scenario: Known user can login
    Given I set body to {"email":"mft-user-test@mathieufont.com", "password":"testtest"}
    When I PUT /user/login
    Then response code should be 200
    And response body path $.auth should be true
    And response body path $.roles[0] should be ROLE_USER
    And response body should contain $.token
    And response body path $.user.id should be 2
    And response body path $.user.username should be mft-user
    And response body path $.user.email should be mft-user-test@mathieufont.com

  @Nominal
  Scenario: Known admin can login
    Given I set body to {"email":"mft-admin-test@mathieufont.com", "password":"testadmin"}
    When I PUT /user/login
    Then response code should be 200
    And response body path $.auth should be true
    And response body path $.roles[0] should be ROLE_USER
    And response body path $.roles[1] should be ROLE_ADMIN
    And response body should contain $.token
    And response body path $.user.id should be 1
    And response body path $.user.username should be admin
    And response body path $.user.email should be mft-admin-test@mathieufont.com

  @Nominal
  Scenario: User can reset its password
    Given I set body to {"email":"mft-user-test@mathieufont.com"}
    When I PUT /user/reset
    Then response code should be 200

  Scenario: Registering a new user needs a username
    Given I set body to {"email":"mft-test@mathieufont.com", "password":"testtest"}
    When I POST to /users
    Then response code should be 400
    And response body path $.code should be SCHEMA_VALIDATION_FAILED

  Scenario: Registering a new user needs an email
    Given I set body to {"username":"mft-test", "password":"testtest"}
    When I POST to /users
    Then response code should be 400
    And response body path $.code should be SCHEMA_VALIDATION_FAILED

  Scenario: Registering a new user needs a password
    Given I set body to {"username":"mft-test", "email":"mft-test@mathieufont.com"}
    When I POST to /users
    Then response code should be 400
    And response body path $.code should be SCHEMA_VALIDATION_FAILED

  Scenario: User needs a password to login
    Given I set body to {"email":"mft-user-test@mathieufont.com"}
    When I PUT /user/login
    Then response code should be 400
    And response body path $.code should be SCHEMA_VALIDATION_FAILED

  Scenario: User needs an email to login
    Given I set body to {"password":"testtest"}
    When I PUT /user/login
    Then response code should be 400
    And response body path $.code should be SCHEMA_VALIDATION_FAILED

  Scenario: Guest cannot reset its password
    Given I set body to {"email":"anon@mathieufont.com"}
    When I PUT /user/reset
    Then response code should be 404

  @Nominal
  Scenario: Unknown user should not be able to log in
    Given I set body to {"email":"unknownuser@mathieufont.com", "password":"testtest"}
    When I POST to /users
    Then response code should be 401
    And response body path $.code should be UNKNOWN_USER

  @Nominal
  Scenario: User with bad credentials should not be able to log in
    Given I set body to {"email":"mft-user-test@mathieufont.com", "password":"wrongpassword"}
    When I POST to /users
    Then response code should be 401
    And response body path $.code should be UNKNOWN_USER

  Scenario: Cannot register a user with a known email
    Given ...
    When ...
    Then ...