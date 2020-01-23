var { Given, When, Then } = require('cucumber');
const Util = require('../support/util');


Given(/^I am a new user with (\d+) invoices$/, async function (nbInvoices) {
    const body = Util.createRandomUser();
    let response;
    try {
        response = await this.got.post(this.apickli.domain + '/users', {
            json: true, // this is required
            body
        });
    } catch (err) {
        console.log(err)
        throw new Error('Server Error');
    }

    if (response.body.auth && response.body.token && response.body.user.id) {
        this.apickli.storeValueInScenarioScope('newUserID', response.body.user.id);
        this.apickli.storeValueInScenarioScope('newUserEmail', response.body.user.email);
        this.apickli.setAccessToken(response.body.token);
        this.apickli.setBearerToken();
    } else {
        throw new Error('User not created');
    }

    const invcPromises = [];
    const path = `${this.apickli.domain}/user/${response.body.user.id}/invoices`;
    for(let i = 0; i < nbInvoices; ++i){
        invcPromises.push(this.got.post(path, {
            json: true, // this is required
            body: Util.createRandomInvoice()
        }));
    }
    
    try {
        const results = await Promise.all(invcPromises);
        results.forEach((invc, i) => {
            this.apickli.storeValueInScenarioScope(`newInvoiceID-${i}`, results[i].body.id);
            this.apickli.storeValueInScenarioScope(`newInvoiceID-${i}-pay`, results[i].body.toPay);
        });
    } catch (err) {
        console.log(err)
        throw err;
    }
});