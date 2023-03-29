module.exports = (req, res, next) => {
  const { api: { params, body } } = req;
  if(params.severity && params.severity === 'info'){
    res.end();
  }else{
    next();
  }
}
