const process = require('./actions/process');

function addMonitoringInfo(operationName) {
  return (req, res, next) => {
    const {
      api: {
        body = {},
      },
      monitor: {
        input,
      },
    } = req;

    const {
      from,
      to,
      template,
    } = body;

    req.monitor.type = operationName;

    req.monitor.input = {
      ...input,
      from,
      to,
      template,
    };
    next();
  };
}

module.exports = {
  processMail: () => [
    addMonitoringInfo('processMail'),
    process,
  ],
};
