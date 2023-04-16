const ConfigHandler = require('./src/service');

(async () => {
  await new ConfigHandler().start();
})();
