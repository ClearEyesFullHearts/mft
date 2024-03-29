Feature: Invoice Management
Test the invoice creation API

  Scenario: User can create an invoice
    Given I am a new user
    And I pipe contents of file invoice.json to body
    When I POST to /user/`newUserID`/invoices
    Then response code should be 201
    And response body path $.status.creation should be `today`
    And response body path $.user should be `newUserID`
    And response body path $.id should be ^[0-9]\d*$
    And response body path $.toPay should be 1870.25
    And response body path $.products.1.title should be Cooking
    And response body path $.price should be 1652.5
    And response body path $.vat.rate_10 should be 112.75
    And response body path $.vat.rate_20 should be 105
    And response body path $.status.creation should be `today`
    And response body path $.ref should be 1

  Scenario: User cannot create an invoice for another user
    Given I am a new user
    And I pipe contents of file invoice.json to body
    When I POST to /user/2/invoices
    Then response code should be 403
    And response body path $.code should be UNAUTHORIZED

  Scenario: User can delete its own invoice
    Given I am a new user with 1 invoices
    When I DELETE /user/`newUserID`/invoice/`newInvoiceID-0`
    Then response code should be 200
    And I GET /user/`newUserID`/invoice/`newInvoiceID-0`
    And response code should be 404

  Scenario: User cannot delete an invoice from another user
    Given I am a new user
    When I DELETE /user/2/invoice/6
    Then response code should be 403
    And response body path $.code should be UNAUTHORIZED

  Scenario: User can get a list of all its invoices
    Given I am a new user with 4 invoices
    When I GET /user/`newUserID`/invoices
    Then response body path $ should be of type array with length 4

  Scenario: User cannot get another user's invoices
    Given I am a new user
    When I GET /user/2/invoices
    Then response code should be 403
    And response body path $.code should be UNAUTHORIZED

  Scenario: User can get one invoice details
    Given I am a new user with 2 invoices
    When I GET /user/`newUserID`/invoice/`newInvoiceID-1`
    Then response body path $.status.creation should be `today`
    And response body path $.toPay should be `newInvoiceID-1-pay`

  Scenario: User cannot get another user's invoice
    Given I am a new user
    When I GET /user/2/invoice/5
    Then response code should be 403
    And response body path $.code should be UNAUTHORIZED

  Scenario: Admin can trigger a config reload
    Given I set an admin bearer token
    And I set body to { "apps": ["*"] }
    When I PUT /config/load
    Then response code should be 200

  Scenario: User can update an invoice
    Given I am a new user with 1 invoices
    And I pipe contents of file updateInvoice.json to body
    When I PUT /user/`newUserID`/invoice/`newInvoiceID-0`
    Then response code should be 200
    And response body path $.id should be `newInvoiceID-0`
    And response body path $.toPay should be 25.87
    And response body path $.clientRef should be Your ref: 0000
    And response body path $.products should be of type array with length 1

  Scenario: User cannot update another user's invoice
    Given I am a new user
    And I pipe contents of file updateInvoice.json to body
    When I PUT /user/2/invoice/5
    Then response code should be 403
    And response body path $.code should be UNAUTHORIZED

  Scenario: Admin can get all invoices by all users
    Given I set an admin bearer token
    When I GET /invoices
    Then response body path $ should be of type array
    And response body path $.0.user should be 1
    And response body path $.1.user should be 1

  Scenario: User can set the date for collected status
    Given I am a new user with 2 invoices
    And I set body to {"date":"`today+1`"}
    When I PUT /user/`newUserID`/invoice/`newInvoiceID-1`/collected
    Then response code should be 200
    And I GET /user/`newUserID`/invoice/`newInvoiceID-1`
    And response body path $.status.collected should be `today+1`

  Scenario: User cannot set the date for vatPaid status before collected status
    Given I am a new user with 3 invoices
    And I set body to {"date":"`today+2`"}
    And I PUT /user/`newUserID`/invoice/`newInvoiceID-1`/collected
    And I set body to {"date":"`today+1`"}
    When I PUT /user/`newUserID`/invoice/`newInvoiceID-1`/vatPaid
    Then response code should be 400
    And response body path $.code should be STATUS_DATE_INVALID

  Scenario: User cannot set the date for collected status for another user's invoice
    Given I am a new user
    And I set body to {"date":"`today+1`"}
    When I PUT /user/2/invoice/4/collected
    Then response code should be 403
    And response body path $.code should be UNAUTHORIZED

  Scenario: User cannot update an invoice with a collected status set
    Given I am a new user with 1 invoices
    And I set body to {"date":"`today+2`"}
    And I PUT /user/`newUserID`/invoice/`newInvoiceID-0`/collected
    When I PUT /user/`newUserID`/invoice/`newInvoiceID-0`
    Then response code should be 400
    And response body path $.code should be INVOICE_IS_SET

  Scenario: User can set the date for vatPaid status
    Given I am a new user with 3 invoices
    And I set body to {"date":"`today`"}
    And I PUT /user/`newUserID`/invoice/`newInvoiceID-1`/collected
    And I set body to {"date":"`today+1`"}
    When I PUT /user/`newUserID`/invoice/`newInvoiceID-1`/vatPaid
    Then response code should be 200
    And I GET /user/`newUserID`/invoice/`newInvoiceID-1`
    And response body path $.status.collected should be `today`
    And response body path $.status.vatPaid should be `today+1`

  Scenario: User cannot set the date for socPaid status before vatPaid status
    Given I am a new user with 3 invoices
    And I set body to {"date":"`today+2`"}
    And I PUT /user/`newUserID`/invoice/`newInvoiceID-1`/collected
    And I set body to {"date":"`today+2`"}
    And I PUT /user/`newUserID`/invoice/`newInvoiceID-1`/vatPaid
    And I set body to {"date":"`today+1`"}
    When I PUT /user/`newUserID`/invoice/`newInvoiceID-1`/socPaid
    Then response code should be 400
    And response body path $.code should be STATUS_DATE_INVALID

  Scenario: User can set the date for socPaid status
    Given I am a new user with 3 invoices
    And I set body to {"date":"`today+1`"}
    And I PUT /user/`newUserID`/invoice/`newInvoiceID-1`/collected
    And I set body to {"date":"`today+1`"}
    And I PUT /user/`newUserID`/invoice/`newInvoiceID-1`/vatPaid
    And I set body to {"date":"`today+2`"}
    When I PUT /user/`newUserID`/invoice/`newInvoiceID-1`/socPaid
    Then response code should be 200
    And I GET /user/`newUserID`/invoice/`newInvoiceID-1`
    And response body path $.status.collected should be `today+1`
    And response body path $.status.vatPaid should be `today+1`
    And response body path $.status.socPaid should be `today+2`

  Scenario: Deleting a user deletes its invoices
    Given I am a new user with 1 invoices
    And I GET /user/`newUserID`/invoice/`newInvoiceID-0`
    And response code should be 200
    And I DELETE /user/`newUserID`
    And response code should be 200
    When I GET /user/`newUserID`/invoice/`newInvoiceID-0`
    And response code should be 404

  Scenario: A deleted but still connected user cannot create an invoice
    Given I am a new user
    And I DELETE /user/`newUserID`
    And response code should be 200
    And I pipe contents of file invoice.json to body
    When I POST to /user/`newUserID`/invoices
    Then response code should be 401