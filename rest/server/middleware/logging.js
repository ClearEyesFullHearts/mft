
const uuidv4 = require('uuid/v4');

const SEVERITY = {
  INFO: 'info',
  WARNING: 'warning',
  FAILURE: 'failure',
  ERROR: 'error',
}

module.exports = (req, res, next) => {
  const start = Date.now();
  const { 
    path, 
    params, 
    body, 
    headers: {
      'x-session-id': originalSessionId,
      ...reqHeaders
    },
    api: {
      publisher
    },
    app: {
      locals: {
        appId
      }
    }
  } = req;

  const pub = publisher;
  req.monitor = {
    sessionId: originalSessionId || uuidv4(),
    eventId: uuidv4(),
    input: {
      path,
      params,
      body,
      headers: reqHeaders,
    },
    type: 'mandatory operation id',
  }
  res.once('finish', () => {
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
    }

    pub.publish(`event.${app}.${severity}`, msg)
  });
  next();
}
