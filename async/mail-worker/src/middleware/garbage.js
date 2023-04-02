module.exports = async (req, res) => {
  // If we're here the request has not been handled by any middleware
  // We send the trash to the garbage
  const {
    path,
    params,
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
      params,
      raw,
    },
  };

  await publisher.publish('garbage.out', trash);

  res.status(404).end();
};
