const Fakerator = require("fakerator");
const fakerator = Fakerator("fr-FR");
const uuidv4 = require('uuid/v4');

class Util{

    static createRandomUser(){
        const uniqueMail = `${uuidv4()}@mathieufont.com`;
        return {
            username: fakerator.internet.userName(),
            email: uniqueMail,
            password: 'testtesttest'
        };
    }

    static createRandomInvoice() {
        const invc = {
            companyAddress: fakerator.populate("#{company.name}\\n#{address.street}\\n#{address.postCode} #{address.city}\\n#{address.country}"),
            clientAddress: fakerator.populate("#{company.name}\\n#{address.street}\\n#{address.postCode} #{address.city}\\n#{address.country}"),
            products: [],
            price: 0,
            vat:{},
            toPay: 0,
        }
        const l = fakerator.random.number(1, 5);
        let p;
        for(let i = 0; i < l; ++i){
            p = Util.createRandomProduct();
            invc.price += p.totalPrice;
            invc.toPay += (p.totalPrice + p.vatTotal);
            if(invc.vat[p.vatPercent]){
                invc.vat[p.vatPercent] += p.vatTotal;
            }else{
                invc.vat[p.vatPercent] = p.vatTotal;
            }

            invc.products.push(p);
        }

        return invc;
    }
    static createRandomProduct() {
        const product = {
            title: fakerator.populate("Contractor: #{company.name}"),
            description: fakerator.populate("development of #{internet.domain} website"),
            number: fakerator.random.number(1, 5),
            unitPrice: fakerator.random.number(100, 1000),
            totalPrice: 0,
            vatPercent: fakerator.random.arrayElement([0, 5.5, 10, 20]),
            vatTotal: 0
        }

        product.totalPrice = product.number * product.unitPrice;
        product.vatTotal = Math.floor((product.totalPrice * product.vatPercent) / 100);

        return product;
    }
}
module.exports = Util;