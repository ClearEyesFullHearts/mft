const fs = require('fs');
const axios = require('axios');
const rabbitExpress = require('rabbitmq-express');
const asyncApiConsumer = require('asyncapi-sub-middleware');
const EventEmitter = require('events');

const APP_ID = 'config-loader';

class ConfigLoader extends EventEmitter {
  constructor(erroring = false) {
    super();
    this.isErroring = erroring;
    this.internalConn = null;
    this.server = null;
    this.isListening = false;

    this.getValueFromPath = (obj, path) => {
      const [prop, ...rest] = path;
      if (!obj[prop]) {
        if (this.isErroring) throw new Error(`Unknown property ${prop}`);
        return null;
      }
      if (rest && rest.length > 0) {
        return this.getValueFromPath(obj[prop], rest);
      }
      return obj[prop];
    };

    this.deepFreeze = (object) => {
      // Retrieve the property names defined on object
      const propNames = Object.keys(object);

      const l = propNames.length;
      for (let i = 0; i < l; i += 1) {
        const name = propNames[i];
        const value = object[name];

        if ((value && typeof value === 'object') || typeof value === 'function') {
          this.deepFreeze(value);
        }
      }

      return Object.freeze(object);
    };

    this.startListening = async (user) => {
      this.server = rabbitExpress();
      this.server.locals = {
        appId: user,
        instance: this,
      };

      const fileroute = '/../../../apps/mft.yaml'; // this.get('async.fileroute');
      const doc = fs.readFileSync(`${__dirname}${fileroute}`, 'utf8');

      const options = {
        tag: APP_ID,
        controllers: `${__dirname}/controller`,
      };
      await asyncApiConsumer(this.server, doc, options);

      const url = this.get('secret.rabbit.url');
      const exchange = 'config-state'; // config.get('secret.rabbit.exchange');
      this.server.listen({
        rabbitURI: url,
        exchange,
      });

      this.isListening = true;
    };
  }

  async load(url, username, password, version = 'latest') {
    const { status, data } = await axios.request({
      baseURL: url,
      url: `/config/${process.env.NODE_ENV}?version=${version}`,
      method: 'GET',
      headers: { authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}` },
    });

    this.internalConn = {
      url,
      authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
    };

    if (status !== 200) throw new Error('Impossible to load the configuration file');
    this.config = this.deepFreeze(data);

    if (!this.isListening) {
      await this.startListening(username);
    }
  }

  get connection() {
    return this.internalConn;
  }

  get(path) {
    const paths = path.split('.');

    return this.getValueFromPath(this.config, paths);
  }

  reload() {
    this.emit('reload');
  }
}

module.exports = ConfigLoader;
