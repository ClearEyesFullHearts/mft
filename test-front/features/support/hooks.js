const { After, Before, BeforeAll, AfterAll, setDefaultTimeout } = require('cucumber');
const got = require('got');
const config = require('config')
const restore = require('mongodb-restore');
const mongoose = require('mongoose');
const { driver } = require('./web_driver');
const Context = require('./context');

//set default step timeout
setDefaultTimeout(60 * 1000);

BeforeAll(function (cb) {
    restore({
        uri: config.get('secret.mongo.url'),
        root: __dirname + '/mft-dev',
        callback: cb
    });
});

Before(function () {
    //Before Scenario Hook
    this.context = new Context();
    this.got = got;
})

After(async function () {
    //After Scenario Hook

    //capture screenshot after each scenario
    let screenshot = await driver.takeScreenshot();
    this.attach(screenshot, 'image/png');
    //clean up cookies
    await driver.manage().deleteAllCookies();
    await driver.executeScript('localStorage.clear();');
});

AfterAll(function (cb) {
    //perform some shared teardown
    driver.quit();
    mongoose.connect(config.get('secret.mongo.url'), { useNewUrlParser: true, useUnifiedTopology: true }).then(
        () => { mongoose.connection.db.dropDatabase(); cb(); },
        err => { cb(err); }
    );
})

