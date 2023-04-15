const config = require('@shared/config');
const LogManager = require('./src/server');

(async () => {
  await config.load('http://localhost:3001', 'log-manager', 'log-manager-password');
  await new LogManager().start();
})();
