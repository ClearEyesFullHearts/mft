Feature: Profile page
Test the user profile page for user and administrator

  @StagingOK
  Scenario: A user can access profile page
    Given I browse to login page
    When I fill email input as "mft-user-test@mathieufont.com"
    And I fill password input as "testtest"
    And I click on connect
    And I am on landing page
    And I see profileNav text is "mft-user-test"
    And I click on profileNav
    Then I am on profile page
    And I see email is disabled
    And I see username text is "mft-user-test"

  @StagingOK
  Scenario: A user can modify its username
    Given I am a user on profile page
    When I update username with "Hello World"
    Then I see profileNav text is "Hello World"

  @StagingOK
  Scenario: A user can modify its password
    Given I am a user on profile page
    And I do not see password input
    And I do not see confirmPassword input
    When I click on update
    And I see password input
    And I see confirmPassword input
    And I fill password input as "secret"
    And I fill confirmPassword input as "secret"
    And I click on update
    And I click on logOut
    And I am on login page
    And I fill email input as "`currentemail`"
    And I fill password input as "secret"
    And I click on connect
    Then I am on landing page

  @StagingOK
  Scenario: Mismatched password is  not accepted
    Given I am a user on profile page
    When I click on update
    And I fill password input as "secret"
    And I fill confirmPassword input as "wrong"
    Then I see update is disabled

  @StagingOK
  Scenario: A user can delete its profile
    Given I am a user on profile page
    When I click on remove
    And I confirm my choice
    And I am on login page
    And I fill email input as "`currentemail`"
    And I fill password input as "`currentpassword`"
    And I click on connect
    Then I see "Identification failed" as an error message

  Scenario: An admin can see all the users
    Given I browse to login page
    When I fill email input as "mft-admin-test@mathieufont.com"
    And I fill password input as "testadmin"
    And I click on connect
    And I am on information page
    And I click on profileNav
    Then I am on profile page
    And I see user for ID "1"
    And I see user for ID "2"
    And I see user for ID "3"

  Scenario: An admin can delete a user
    Given I am a new connected user
    And I click on logOut
    And I am on login page
    When I fill email input as "mft-admin-test@mathieufont.com"
    And I fill password input as "testadmin"
    And I click on connect
    And I am on information page
    And I click on profileNav
    And I am on profile page
    And I delete user "`currentID`"
    And I click on logOut
    And I am on login page
    And I fill email input as "`currentemail`"
    And I fill password input as "`currentpassword`"
    And I click on connect
    Then I see "Identification failed" as an error message

  Scenario: An admin cannot delete himself
    Given I am an admin on profile page
    When I see remove is disabled
    Then There is no delete button for me