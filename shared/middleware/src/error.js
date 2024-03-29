const { ValidationError: ConsumingError } = require('asyncapi-sub-middleware');
const { ValidationError: PublishingError } = require('asyncapi-pub-middleware');
const logger = require('debug');

const debug = logger('async:middleware:error');

// eslint-disable-next-line no-unused-vars
module.exports = async (err, req, res, next) => {
  debug(`error incoming ${err.message}`);

  if (err instanceof ConsumingError || err instanceof PublishingError) {
    const {
      path,
      raw,
      api: {
        publisher,
      },
      app: {
        locals: {
          appId,
        },
      },
    } = req;

    const content = JSON.stringify({
      validationError: err,
      raw,
    });

    const trash = {
      receiver: appId,
      routing: path,
      body: content,
    };

    await publisher.publish('garbage.out', trash);
    res.status(400).end();
  } else {
    // console.error(err);
    // res.status(500).end();
    res.status(500).end(err);
  }
};
