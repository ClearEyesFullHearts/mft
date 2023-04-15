const axios = require('axios');

class ConfigLoader {
  constructor(erroring = false) {
    this.isErroring = erroring;

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
  }

  async load(url, username, password, version = 'latest') {
    const { status, data } = await axios.request({
      baseURL: url,
      url: `/config/${process.env.NODE_ENV}?version=${version}`,
      method: 'GET',
      headers: { authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}` },
    });

    if (status !== 200) throw new Error('Impossible to load the configuration file');
    this.config = this.deepFreeze(data);
  }

  get(path) {
    const paths = path.split('.');

    return this.getValueFromPath(this.config, paths);
  }
}

module.exports = ConfigLoader;
