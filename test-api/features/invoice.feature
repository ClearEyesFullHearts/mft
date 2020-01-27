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
    And response body path $.vat.10 should be 112.75
    And response body path $.vat.20 should be 105

  Scenario: User can delete its own invoice
    Given I am a new user with 1 invoices
    When I DELETE /user/`newUserID`/invoice/`newInvoiceID-0`
    Then response code should be 200
    And I GET /user/`newUserID`/invoice/`newInvoiceID-0`
    And response code should be 404

  Scenario: User can get a list of all its invoices
    Given I am a new user with 3 invoices
    When I GET /user/`newUserID`/invoices
    Then response body path $ should be of type array with length 3

  Scenario: User can get one invoice details
    Given I am a new user with 3 invoices
    When I GET /user/`newUserID`/invoice/`newInvoiceID-2`
    Then response body path $.status.creation should be `today`
    And response body path $.toPay should be `newInvoiceID-2-pay`

  Scenario: User can update an invoice
    Given I am a new user with 1 invoices
    And I set body to {"clientRef":"Your ref: 0000", "paymentDueDate":"Soon", "toPay": 0}
    When I PUT /user/`newUserID`/invoice/`newInvoiceID-0`
    Then response code should be 200
    And response body path $.id should be `newInvoiceID-0`
    And response body path $.toPay should be 0
    And response body path $.clientRef should be Your ref: 0000

  Scenario: User cannot get another user's invoice
    Given I am a new user
    When I GET /user/2/invoice/0
    Then response code should be 403

  Scenario: Admin can get all invoices by all users
    Given I set an admin bearer token
    When I GET /invoices
    Then response body path $ should be of type array
    And response body path $.0.id should be 1
    And response body path $.1.id should be 1

  Scenario: User can set the date for collected status
    Given I am a new user with 3 invoices
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

  Scenario: User cannot set the date for socPaid status before vatPaid status
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