const fs = require('fs');
const nodemailer = require('nodemailer');
const config = require('config');
const logger = require('debug');
const loTemplate = require('lodash.template');

const debug = logger('mail-worker:actions:mailing');

class Mailing {
  constructor() {
    this.senderAddress = config.get('mail.sender');

    const options = config.get('mail.transport');
    const auth = config.get('secret.mail');
    
    this.transporter = nodemailer.createTransport({
      ...options,
      auth
    });

    this.templatesFolder = config.get('mail.templates');
  }

  async send(from, to, template, values) {
    debug('send mail from :', from);
    debug('send mail to :', to);
    debug('send mail with template :', template);

    const mailTemplate = config.get(`templates.mail.${template}`);
    if (mailTemplate) {
      const mail = {
        from: from || this.senderAddress, // sender address
        to, // list of receivers
        subject: mailTemplate.subject, // Subject line
      };
      if (mailTemplate.html) mail.html = await this.getMailText(mailTemplate.html, values);
      if (mailTemplate.txt) mail.text = await this.getMailText(mailTemplate.txt, values);

      await this.transporter.sendMail(mail);
      debug('mail sent');
      return true;
    }
    throw new Error('NO_TEMPLATE');
  }

  getMailText(template, values) {
    const file = `${this.templatesFolder}/${template}`;
    debug('look for template:', file);
    return new Promise(((resolve, reject) => {
      fs.readFile(file, (err, data) => {
        if (err) {
          if (err.code === 'ENOENT') {
            debug('file do not exists:', err.message);
            return resolve(false);
          }
          return reject(err);
        }

        debug('file exists');
        try {
          const fullText = loTemplate(data)(values);
          return resolve(fullText);
        } catch (exc) {
          return reject(exc);
        }
      });
    }));
  }
}

module.exports = new Mailing(config.get('mail.sender'), config.get('mail.transport'), config.get('mail.templates'));
