const Fakerator = require('fakerator');

const fakerator = Fakerator('fr-FR');
const uuidv4 = require('uuid/v4');

class Util {
  static createRandomUser() {
    const uniqueMail = `${uuidv4()}@mathieufont.com`;
    return {
      username: fakerator.internet.userName(),
      email: uniqueMail,
      password: 'testtesttest',
    };
  }

  static createRandomInvoice() {
    const invc = {
      companyAddress: fakerator.populate('#{company.name}\\n#{address.street}\\n#{address.postCode} #{address.city}\\n#{address.country}'),
      clientAddress: fakerator.populate('#{company.name}\\n#{address.street}\\n#{address.postCode} #{address.city}\\n#{address.country}'),
      products: [],
    };
    const l = fakerator.random.number(1, 5);
    let p;
    for (let i = 0; i < l; ++i) {
      p = Util.createRandomProduct();

      invc.products.push(p);
    }

    return invc;
  }

  static createRandomProduct() {
    const product = {
      title: fakerator.populate('Contractor: #{company.name}'),
      description: fakerator.populate('development of #{internet.domain} website'),
      number: fakerator.random.number(1, 5),
      unitPrice: fakerator.random.number(100, 1000),
      vatPercent: fakerator.random.arrayElement([0, 5.5, 10, 20]),
    };
    return product;
  }

  static async retry(process, max = 20, timeout = 100) {
    const maxRetries = max;
    let currentTry = 0;

    while (true) {
      const result = await process();
      if (result) {
        return;
      }

      if (currentTry < maxRetries) {
        await new Promise((resolve) => {
          setTimeout(resolve, timeout);
        });
        currentTry += 1;
      } else {
        throw new Error('Retries limit reached');
      }
    }
  }
}
module.exports = Util;
