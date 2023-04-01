const logger = require('debug');
const debug = logger('mail-worker:action:process');

const mailing = require('./mailing');

module.exports = async (req, res, next) => {
    const { api: { body } } = req;

    req.monitor.type = 'processMail';
    
    const {
      from,
      to,
      template,
      values,
    } = body;

    try{
      await mailing.send(from, to, template, values);
    }catch(err){
      res.status(500).end(err);
      return;
    }
    
    res.end();
};

