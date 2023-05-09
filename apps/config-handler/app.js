require('@shared/secret_env');
const ConfigHandler = require('./src/service');

(async () => {
  await new ConfigHandler().start();
})();
