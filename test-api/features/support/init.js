const apickli = require('apickli');
const { Before, BeforeAll, AfterAll } = require('cucumber');
const config = require('config');
const got = require('got');
const backup = require('mongodb-backup-4x');
const restore = require('mongodb-restore');
const mongoose = require('mongoose');

BeforeAll(function (cb) {
    // backup({
    //     uri: config.get('secret.mongo.url'),
    //     root: __dirname,
    //     callback: cb
    // });
    mongoose.connect(config.get('secret.mongo.url'), { useNewUrlParser: true, useUnifiedTopology: true }).then(
        () => { 
            mongoose.connection.db.dropDatabase();
            restore({
                uri: config.get('secret.mongo.url'),
                root: __dirname + '/mft-dev',
                callback: cb
            });
        },
        err => { cb(err); }
    );
});

Before(function () {
    const host = config.get('base.instance.host');
    const port = config.get('base.instance.port');
    const protocol = config.get('base.instance.protocol');

    this.apickli = new apickli.Apickli(protocol, `${host}:${port}`);
    this.apickli.addRequestHeader('Cache-Control', 'no-cache');
    this.apickli.addRequestHeader('Content-Type', 'application/json');

    this.got = got;
});

AfterAll(function (cb) {
    cb();
});