const apickli = require('apickli');
const { Before, BeforeAll, AfterAll } = require('cucumber');
const config = require('config');
const got = require('got');
const backup = require('mongodb-backup-4x');
const restore = require('mongodb-restore');
const mongoose = require('mongoose');
const moment = require('moment');

BeforeAll(function (cb) {
    // backup({
    //     uri: config.get('secret.mongo.url'),
    //     root: __dirname,
    //     callback: cb
    // });
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
});

Before(function () {
    const host = config.get('base.instance.host');
    const port = config.get('base.instance.port');
    const protocol = config.get('base.instance.protocol');

    this.apickli = new apickli.Apickli(protocol, `${host}:${port}`, 'data');
    this.apickli.addRequestHeader('Cache-Control', 'no-cache');
    this.apickli.addRequestHeader('Content-Type', 'application/json');

    const todayPlus = moment();
    const todayMinus = moment();
    this.apickli.storeValueInScenarioScope(`today`, todayPlus.format('YYYY-MM-DD'));
    for(let i = 1; i < 5; ++i){
        todayPlus.add(i, 'days');
        todayMinus.add(-i, 'days');
        this.apickli.storeValueInScenarioScope(`today+${i}`, todayPlus.format('YYYY-MM-DD'));
        this.apickli.storeValueInScenarioScope(`today-${i}`, todayMinus.format('YYYY-MM-DD'));
    }

    this.got = got;
});

AfterAll(function (cb) {
    cb();
});
