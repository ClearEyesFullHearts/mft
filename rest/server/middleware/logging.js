const uuidv4 = require('uuid/v4');
const logger = require('debug');

const debug = logger('mft-back:server:middleware:logging');

const SEVERITY = {
  INFO: 'info',
  WARNING: 'warning',
  FAILURE: 'failure',
  ERROR: 'error',
};

module.exports = (req, res, next) => {
  const start = Date.now();
  const {
    path,
    params,
    method,
    headers: {
      'x-session-id': originalSessionId,
    },
    api: {
      publisher,
    },
    app: {
      locals: {
        appId,
      },
    },
  } = req;

  const pub = publisher;
  req.monitor = {
    sessionId: originalSessionId || uuidv4(),
    eventId: uuidv4(),
    input: {
      method,
      path,
      author: 'unknown',
      params,
    },
  };
  debug('Monitoring object created for new request');
  res.once('finish', async () => {
    let result = 'OK';
    let severity = SEVERITY.INFO;
    const app = appId;
    const duration = Date.now() - start;

    const numStatus = Number(res.statusCode);
    if (numStatus >= 400) {
      result = 'KO';
      severity = SEVERITY.FAILURE;
    }
    if (numStatus >= 500) {
      severity = SEVERITY.ERROR;
    }

    if (req.auth) {
      req.monitor.input.author = req.auth.user.id;
    }

    const msg = {
      ...req.monitor,
      result,
      duration,
      status: numStatus,
    };

    debug('Publish monitoring event');
    await pub.publish(`event.${app}.${severity}`, msg);
  });
  next();
};
