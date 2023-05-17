const logger = require('debug');
const { Client } = require('@opensearch-project/opensearch');
const config = require('@shared/config');

const debug = logger('log-manager:action:logging');

const {
  protocol,
  hostname,
  port,
  username,
  password,
  options,
} = config.get('secret.elastic');
const auth = username && password ? `${username};${password}@` : '';
const esURL = `${protocol}://${auth}${hostname}:${port}`;
const esClient = new Client({
  node: esURL,
  ssl: {
    ...options,
  },
});

module.exports = async (req, res, next) => {
  const { path, api: { params, body } } = req;
  debug(`logging for ${path}`);

  const { input, output } = body;
  const { severity, app } = params;

  const document = {
    ...body,
    input: JSON.stringify(input),
    output: JSON.stringify(output),
    severity,
    app,
  };

  try {
    await esClient.index({
      index: 'mft-log',
      body: document,
    });
  } catch (err) {
    debug('Error sending to elastic', err);
    res.end(err); // will noAck, so will try again!
    return;
  }

  if (severity && severity === 'info') {
    res.end();
  } else {
    next();
  }
};
