const fs = require('fs/promises');
const path = require('path');

const DEFAULT = 'default.json';
const CUSTOM = 'custom-environment-variables.json';

class Library {
  constructor() {
    this.data = {};

    this.sortVersion = (arr) => arr
      .map((a) => a.split('.').map((n) => +n + 100000).join('.'))
      .sort()
      .map((a) => a.split('.').map((n) => +n - 100000).join('.'))
      .reverse();

    this.sortConfigFiles = (arr) => arr.sort((nA, nB) => {
      if (nA === DEFAULT
          || nB === CUSTOM) return -1;
      if (nB === DEFAULT
        || nA === CUSTOM) return 1;
      return 0;
    });

    this.loadVersion = async (version) => {
      const fileNames = this.sortConfigFiles(await fs.readdir(path.join(__dirname, '..', 'data', version)));

      if (!fileNames.includes(DEFAULT)) throw new Error(`Missing default configuration file for v${version}`);
      const hasCustomFile = fileNames.includes(CUSTOM);

      const promises = fileNames.map((filePath) => fs.readFile(path.join(__dirname, '..', 'data', version, filePath), 'utf8'));
      const txtFiles = await Promise.all(promises);
      const files = txtFiles.map((txtF) => JSON.parse(txtF));
      const defaultFile = files[0];
      const customFile = hasCustomFile ? this.completeCustomFile(files[files.length - 1]) : {};

      return fileNames.reduce((obj, fileName, index) => {
        if (fileName === CUSTOM) {
          return obj;
        }
        const propName = fileName.substring(0, fileName.lastIndexOf('.'));
        return {
          ...obj,
          [propName]: this.aggregateEnvFiles(defaultFile, files[index], customFile),
        };
      }, {});
    };

    this.aggregateEnvFiles = (base, ...sources) => {
      const target = {
        ...base,
      };
      sources.forEach((source) => {
        Object.keys(source).forEach((key) => {
          const sVal = source[key];
          const tVal = target[key];
          target[key] = tVal && sVal && typeof tVal === 'object' && typeof sVal === 'object'
            ? this.aggregateEnvFiles(tVal, sVal)
            : sVal;
        });
      });
      return target;
    };
    this.completeCustomFile = (source) => {
      const target = {
        ...source,
      };
      Object.keys(source).forEach((key) => {
        const sVal = source[key];

        if (sVal && typeof sVal === 'object') {
          target[key] = this.completeCustomFile(sVal);
        } else if (process.env[sVal]) {
          target[key] = process.env[sVal];
        } else {
          delete target[key];
        }
      });
      return target;
    };
  }

  async load() {
    const versions = this.sortVersion(await fs.readdir(path.join(__dirname, '..', 'data')));

    const l = versions.length;
    const promises = [];
    for (let i = 0; i < l; i += 1) {
      const v = versions[i];
      promises.push(this.loadVersion(v));
    }
    const config = await Promise.all(promises);
    // console.log(JSON.stringify(config[1]['dock-dev'], null, 2));
    this.data = versions.reduce((prev, vName, index) => ({
      ...prev,
      [vName]: config[index],
    }), { latest: config[0] });

    console.log(this.data);
  }
}

module.exports = new Library();
