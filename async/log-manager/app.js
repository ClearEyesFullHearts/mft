const LogManager = require('./src/server');

(async () => {
  await new LogManager().start();
})();
