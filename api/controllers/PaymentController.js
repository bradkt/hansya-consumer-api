/**
 * Payment
 *
 * @description :: Server-side logic for managing Payments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var async = require('asyncawait/async')
var await = require('asyncawait/await')


module.exports = {
    _config: {  //Override default behavior as this is not a standard rest API endpoint
        actions: true,
        shortcuts: false,
        rest: false
    },

    makePayment: async(function (req, res) {
        var paymentInfo = await(CampaignService.getPaymentInfo(req.param('campaignID')))
        try {
            var paymentResponse = await(PaymentProcessorService.makePayment(paymentInfo.price, paymentInfo.description, req.param('token')))
            if (paymentResponse.status == 'succeeded') {
                await(CampaignService.setPaid(req.param('campaignID'), paymentResponse.id))
                var response = {
                    status: paymentResponse.status,
                    card: paymentResponse.source.last4,
                    amount: paymentResponse.amount
                }
                res.send(response)
            }
            else {
                var response = {
                    status: 'error',
                    message: paymentResponse.message
                }
                console.log("RESPONSE")
                res.badRequest(response)
            }
        }
        catch (paymentResponse) {
            var response = {
                status: 'error',
                message: paymentResponse.message
            }
            console.log("RESPONSE")
            res.badRequest(response)
        }
    })
};

