
const uuidv4 = require('uuid/v4');
const logger = require('debug');
const debug = logger('mail-worker:middleware:logging');

const SEVERITY = {
  INFO: 'info',
  WARNING: 'warning',
  FAILURE: 'failure',
  ERROR: 'error',
}

module.exports = (req, res, next) => {
  const start = Date.now();
  const { 
    body = {},
    path, 
    // headers: {
    //   'x-session-id': originalSessionId,
    // },
    api: {
      publisher
    },
    app: {
      locals: {
        appId
      }
    }
  } = req;

  const {
    from,
    to,
    template,
  } = body;

  const pub = publisher;
  req.monitor = {
    sessionId: 'originalSessionId',
    eventId: uuidv4(),
    input: {
      path,
      from,
      to,
      template,
    },
  }
  debug('Monitoring object created for new request');
  res.once('finish', async () => {
    let result = 'OK'
    let severity = SEVERITY.INFO;
    const app = appId;
    const duration = Date.now() - start;

    const numStatus = Number(res.statusCode);
    if(numStatus >= 400){
      result = 'KO';
      severity = SEVERITY.FAILURE;
    }
    if(numStatus >= 500){
      severity = SEVERITY.ERROR;
    }

    const msg = {
      ...req.monitor,
      result,
      duration,
      status: numStatus
    };

    debug('Publish monitoring event');
    await pub.publish(`event.${app}.${severity}`, msg);
  });
  next();
}
