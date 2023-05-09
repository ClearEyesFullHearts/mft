const fs = require('fs');
const logger = require('debug');

const debug = logger('secret_env:starter');

const SECRETS_FOLDER = '/run/secrets';
// const SECRETS_FOLDER = './secrets';

(() => {
  let files;
  debug('get all files in secrets directory');
  try {
    files = fs.readdirSync(SECRETS_FOLDER);
  } catch (err) {
    debug('no directory for secrets');
    return;
  }
  try {
    const sources = [];
    files.forEach((file) => {
      const f = fs.readFileSync(`${SECRETS_FOLDER}/${file}`);
      sources.push(JSON.parse(f));
    });

    sources.forEach((source) => {
      const secrets = JSON.parse(source);
      Object.keys(secrets).forEach((k) => {
        debug(`${k} key is added to the environment`);
        process.env[k] = secrets[k];
      });
    });
  } catch (err) {
    debug('No secrets loaded', err);
  }
})();
