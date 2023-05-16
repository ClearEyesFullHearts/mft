const { Kafka } = require('kafkajs');
const amqplib = require('amqplib');
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
    this.internalRabbitConn = false;
    this.internalGarbageConn = false;
    this.internalConfigConn = false;

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

      const options = {
        tag: APP_ID,
        controllers: `${__dirname}/controller`,
      };
      await asyncApiConsumer(this.server, this.get('asyncApi'), options);

      const rabbitURI = await this.internalConn.rabbit();
      const exchange = 'config-state'; // config.get('secret.rabbit.exchange');
      await this.server.listen({
        rabbitURI,
        exchange,
      });

      this.isListening = true;
    };
  }

  async load(url, username, password, configVersion = 'latest', apiVersion = 'latest') {
    const authorization = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

    const { status, data } = await axios.request({
      baseURL: url,
      url: `/config/${process.env.NODE_ENV}?vConf=${configVersion}&vApi=${apiVersion}`,
      method: 'GET',
      headers: { authorization },
    });

    this.internalRabbitConn = false;
    this.internalGarbageConn = false;
    this.internalConfigConn = false;
    this.internalConn = {
      rabbit: async () => {
        if (this.internalRabbitConn) return Promise.resolve(this.internalRabbitConn);
        const rabbitURI = this.get('secret.rabbit.url');
        this.internalRabbitConn = await amqplib.connect(rabbitURI);
        return this.internalRabbitConn;
      },
      garbage: async () => {
        if (this.internalGarbageConn) return Promise.resolve(this.internalGarbageConn);
        const brokers = this.get('secret.garbage.url');
        const kafka = new Kafka({
          clientId: username,
          brokers: [brokers],
        });

        this.internalGarbageConn = kafka.producer();

        await this.internalGarbageConn.connect();
        return this.internalGarbageConn;
      },
      config: async () => {
        if (this.internalConfigConn) return Promise.resolve(this.internalConfigConn);
        this.internalConfigConn = axios.create({
          baseURL: url,
          headers: { Authorization: authorization },
        });
        return Promise.resolve(this.internalConfigConn);
      },
    };

    if (status !== 200) throw new Error('Impossible to load the configuration file');
    this.config = this.deepFreeze(data);

    if (!this.isListening) {
      await this.startListening(username);
    }
  }

  get connections() {
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
