const config = require('config');
const BasePage = require('../base');

class InfoPage extends BasePage {
    constructor() {
        super('Information', `${config.get('public.url')}/info`);
        this.name = 'information';
    }
}

module.exports = InfoPage;