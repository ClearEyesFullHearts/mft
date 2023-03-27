module.exports = async (req, res, next) => {
  // If we're here the request has not been handled by any middleware
  // We send the trash to the garbage
  const { 
    path, 
    ip, 
    params,
    method,
    api: {
      publisher
    },
    app: {
      locals: {
        appId
      }
    }
  } = req;

  const trash = {
    receiver: appId,
    routing: path,
    originator: ip,
    body: JSON.stringify({
      method,
      path,
      params,
    })
  };

  await publisher.publish('garbage.out', trash);

  next();
};
