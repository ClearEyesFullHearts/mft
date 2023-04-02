const MultiSwaggerService = require('./server/service');

(async () => {
  await new MultiSwaggerService().start();
})();
