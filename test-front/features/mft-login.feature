Feature: Log to mft
Test the login page and the security of unauthorized pages.

  @StagingOK
  Scenario: Known user can login
    Given I browse to login page
    When I fill email input as "mft-user-test@mathieufont.com"
    And I fill password input as "testtest"
    And I click on connect
    Then I am on landing page

  Scenario: Known admin can login
    Given I browse to login page
    When I fill email input as "mft-admin-test@mathieufont.com"
    And I fill password input as "testadmin"
    And I click on connect
    Then I am on information page

  @StagingOK
  Scenario: Register a new user
    Given I browse to login page
    And I set a new email
    When I click on signUp
    And I fill username input as "User Test"
    And I fill newEmail input as "`currentemail`"
    And I fill newPassword input as "testpass"
    And I fill confirmPassword input as "testpass"
    And I click on create
    Then I am on landing page

  Scenario: Reset password by email
    Given I am a new connected user
    When I click on logOut
    And I am on login page
    And I click on forgot
    And I fill knownEmail input as "`currentemail`"
    And I click on send
    Then an e-mail was sent to "`currentemail`"

  @StagingOK
  Scenario: I need a password to connect
    Given I browse to login page
    When I fill password input as "testtest"
    Then I see connect is disabled

  @StagingOK
  Scenario: I need an email to connect
    Given I browse to login page
    When I fill email input as "mft-user-test@mathieufont.com"
    Then I see connect is disabled

  @StagingOK
  Scenario: I need a correct email to connect
    Given I browse to login page
    When I fill email input as "wrong@mathieufont.com"
    And I fill password input as "testtest"
    And I click on connect
    Then I see "Identification failed" as an error message

  @StagingOK
  Scenario: I need a correct password to connect
    Given I browse to login page
    When I fill email input as "mft-user-test@mathieufont.com"
    And I fill password input as "wrongpassword"
    And I click on connect
    Then I see "Identification failed" as an error message

  Scenario: Unknown address doesn't trigger an email from reset
    Given I browse to login page
    When I click on forgot
    And I fill knownEmail input as "wrongemail@mathieufont.com"
    And I click on send
    Then No emails has been sent to "wrongemail@mathieufont.com"

  @StagingOK
  Scenario: I cannot register with an already known email
    Given I browse to login page
    When I click on signUp
    And I fill username input as "User Test"
    And I fill newEmail input as "mft-user-test@mathieufont.com"
    And I fill newPassword input as "testpass"
    And I fill confirmPassword input as "testpass"
    And I click on create
    Then I see "This email address is already used" as an error message

  @StagingOK
  Scenario: I need to confirm my password to register
    Given I browse to login page
    When I click on signUp
    And I fill username input as "User Test"
    And I fill newEmail input as "no-confirmation@mathieufont.com"
    And I fill newPassword input as "goodpassword"
    And I fill confirmPassword input as "badpassword"
    Then I see create is disabled

  @StagingOK
  Scenario: A guest cannot access inside pages
    Given I browse to login page
    When I browse to landing page
    Then I am on login page

  @StagingOK
  Scenario: A user cannot access admin pages
    Given I am a new connected user
    When I browse to information page
    Then I am on landing page