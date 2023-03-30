const { ValidationError } = require('asyncapi-sub-middleware');

module.exports = async (err, req, res, next) => {
  if(err instanceof ValidationError) {
    const { 
      path, 
      raw,
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
      body: {
        validationError: err,
        raw
      }
    };
  
    await publisher.publish('garbage.out', trash);
    res.end();
  }else{
    res.end(err);
  }
};
