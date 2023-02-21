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
    if (process.env.NODE_ENV !== 'staging') {
        // mongoose.connect(config.get('secret.mongo.url'), { useNewUrlParser: true, useUnifiedTopology: true }).then(
        //     () => {
        //         mongoose.connection.db.dropDatabase();
        //         restore({
        //             uri: config.get('secret.mongo.url'),
        //             root: __dirname + '/mft-dev',
        //             callback: cb
        //         });
        //     },
        //     err => { cb(err); }
        // );
        mongoose.connect(config.get('secret.mongo.url'), { useNewUrlParser: true, useUnifiedTopology: true }).then(
          () => { 
              // mongoose.connection.db.dropDatabase();
              mongoose.connection.dropDatabase().then(
                () => {
                  restore({
                    uri: config.get('secret.mongo.url'),
                    root: __dirname + '/mft-dev',
                    callback: cb
                  });
                },
                err => { cb(err); }
              )
              
          },
          err => { cb(err); }
      );
    }else{
        const body = {
            username: 'mft-user-test',
            email: 'mft-user-test@mathieufont.com',
            password: 'testtest'
        };
        got.post(config.get('base.server.url') + '/users', {
            json: true, // this is required
            body
        }).then((resp) => {
            cb()
        }).catch((err) => {
            if (err.body && err.body.code && err.body.code === 'USER_EXISTS') {
                cb();
            } else {
                cb(err);

            }
        });
    }
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
    cb();
})

