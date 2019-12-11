const apickli = require('apickli');
const { Before } = require('cucumber');
const config = require('config');
const got = require('got');

Before(function () {
    const host = config.get('base.instance.host');
    const port = config.get('base.instance.port');
    const protocol = config.get('base.instance.protocol');

    this.apickli = new apickli.Apickli(protocol, `${host}:${port}`);
    this.apickli.addRequestHeader('Cache-Control', 'no-cache');
    this.apickli.addRequestHeader('Content-Type', 'application/json');

    this.got = got;
});