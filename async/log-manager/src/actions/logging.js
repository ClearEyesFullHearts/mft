const logger = require('debug');
const { Client } = require('@elastic/elasticsearch');
const config = require('config');
const debug = logger('log-manager:async:action:logging');

const esURL = config.get('secret.elastic.url');
const esClient = new Client({
  node: esURL,
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

  try{
    await esClient.index({
      index: 'mf-log',
      body: document,
    });
  }catch(err){
    debug('Error sending to elastic', err);
    res.end(err); // will noAck, so will try again!
    return;
  }


  if(severity && severity === 'info'){
    res.end();
  }else{
    next();
  }
}
