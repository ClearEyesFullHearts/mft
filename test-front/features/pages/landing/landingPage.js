const config = require('config');
const BasePage = require('../base');

class LandingPage extends BasePage {
    constructor(){
        super('Invoices', `${config.get('public.url')}/landing`);
        this.name = 'landing';
    }
}

module.exports = LandingPage;