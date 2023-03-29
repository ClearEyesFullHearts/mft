
const MultiSwaggerService = require('./server/service.js');

(async () => {
    await new MultiSwaggerService().start();
})();
