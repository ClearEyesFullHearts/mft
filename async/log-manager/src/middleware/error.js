const { ValidationError } = require('asyncapi-sub-middleware');

// eslint-disable-next-line no-unused-vars
module.exports = async (err, req, res, next) => {
  if (err instanceof ValidationError) {
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

    const trash = {
      receiver: appId,
      routing: path,
      body: {
        validationError: err,
        raw,
      },
    };

    await publisher.publish('garbage.out', trash);
    res.status(400).end();
  } else {
    res.status(500).end(err);
  }
};
