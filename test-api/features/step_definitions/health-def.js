const { Given, When, Then } = require('cucumber');
const jwt = require('jsonwebtoken');
const config = require('config');

Given("I set an admin bearer token", async function () {
    const payload = {
        auth: true,
        roles: [
            'ROLE_USER',
            'ROLE_ADMIN'
        ],
        user:{
            id: 1,
            username: 'admin',
            email: 'mft-admin-test@mathieufont.com'
        }
    };
    const tokenAdmin = jwt.sign(payload, config.get('secret.auth'));
    this.apickli.setAccessToken(tokenAdmin);
    this.apickli.setBearerToken();
});

Given("I set an user bearer token", async function () {
    const payload = {
        auth: true,
        roles: [
            'ROLE_USER'
        ],
        user: {
            id: 2,
            username: 'mft-user',
            email: 'mft-user-test@mathieufont.com'
        }
    };
    const tokenAdmin = jwt.sign(payload, config.get('secret.auth'));
    this.apickli.setAccessToken(tokenAdmin);
    this.apickli.setBearerToken();
});

Given("I set a bad bearer token", async function () {
    this.apickli.setAccessToken('tokenAdmin');
    this.apickli.setBearerToken();
});