if (sails.config.environment != 'production') {
    var stripe = require('stripe')('sk_test_H34OeRNj1p18eyajYEFh4vRM')
}
else {
    var stripe = require('stripe')('sk_live_HbVQ22ZLEwLUlnCHZKyTQ56q')
}

var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = {
    makePayment: async(function (amount, description, token){
        return await(stripe.charges.create({
            amount: amount,
            currency: 'usd',
            description: description,
            source: token.id,
        }))
    })
}