Feature: User management
Test the user CRUD API

  @Nominal
  Scenario: User gets its own informations
    Given I am a new user
    When I GET /user/`newUserID`
    Then response code should be 200
    And response body path $.id should be `newUserID`
    And response body path $.username should be `newUserName`
    And response body path $.email should be `newUserEmail`

  Scenario: User cannot get information for another user
    Given I am a new user
    When I GET /user/2
    Then response code should be 403
    And response body path $.code should be UNAUTHORIZED

  Scenario: Admin can get another user informations
    Given I am a new user
    And I set an admin bearer token
    When I GET /user/`newUserID`
    Then response code should be 200
    And response body path $.id should be `newUserID`
    And response body path $.username should be `newUserName`
    And response body path $.email should be `newUserEmail`

  @Nominal
  Scenario: User can update its username and password
    Given I am a new user
    And I set body to {"username":"test-update", "password":"updatedpassword"}
    When I PUT /user/`newUserID`
    And I log with {"email":"`newUserEmail`", "password":"updatedpassword"}
    And I GET /user/`newUserID`
    Then response code should be 200
    And response body path $.id should be `newUserID`
    And response body path $.username should be test-update

  Scenario: User cannot update its email
    Given I am a new user
    And I set body to {"username":"test-update", "password":"updatedpassword", "email":"noemailupdate@mathieufont.com"}
    And I PUT /user/`newUserID`
    And I set body to {"email":"noemailupdate@mathieufont.com", "password":"updatedpassword"}
    When I PUT /user/login
    Then response code should be 401
    And response body path $.code should be UNKNOWN_USER

  Scenario: User cannot update another user information
    Given I am a new user
    And I set body to {"username":"test-update", "password":"updatedpassword"}
    When I PUT /user/2
    Then response code should be 403
    And response body path $.code should be UNAUTHORIZED

  Scenario: Admin cannot update another user
    Given I set an admin bearer token
    And I set body to {"username":"test-update", "password":"updatedpassword"}
    When I PUT /user/2
    Then response code should be 403
    And response body path $.code should be UNAUTHORIZED

  @Nominal
  Scenario: User can delete its profile
    Given I am a new user
    When I DELETE /user/`newUserID`
    Then response code should be 200
    And I set an admin bearer token
    And I GET /user/`newUserID`
    And response code should be 404

  Scenario: User cannot delete another profile
    Given I am a new user
    When I DELETE /user/2
    Then response code should be 403
    And response body path $.code should be UNAUTHORIZED

  @Nominal
  Scenario: Admin can delete any user profile
    Given I am a new user
    And I set an admin bearer token
    When I DELETE /user/`newUserID`
    Then response code should be 200
    And I GET /user/`newUserID`
    And response code should be 404

  @Nominal
  Scenario: Admin can get the list of all users
    Given I set an admin bearer token
    When I GET /users
    Then response code should be 200
    And response body path $ should be of type array
    And response body path $.0.id should be 1
    And response body path $.1.id should be 2

  Scenario: Admin cannot delete its own profile
    Given I set an admin bearer token
    When I DELETE /user/1
    Then response code should be 403
    And response body path $.code should be UNAUTHORIZED