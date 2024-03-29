const logger = require('debug');

const debug = logger('mail-worker:action:process');

const mailing = require('./mailing');

module.exports = async (req, res) => {
  const { api: { body }, monitor: { sessionId } } = req;

  const {
    from,
    to,
    template,
    values,
  } = body;

  try {
    debug(`Try sending mail for session ${sessionId}`);
    await mailing.send(from, to, template, values);
  } catch (err) {
    debug('Send mail fail');
    res.status(500).end(err);
    return;
  }

  debug('Mail sent');
  res.end();
};
