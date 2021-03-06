var async = require('asyncawait/async')
var await = require('asyncawait/await')
var nodemailer = require('nodemailer')
var transporter = nodemailer.createTransport('smtps://hansyatest@gmail.com:hansya12345@smtp.gmail.com')

module.exports = {
    sendEmail: async(function (fromAddress, toAddress, subject, body) {
        var mailOptions = {
            from: fromAddress,
            to: toAddress,
            subject: subject,
            text: body,
            html: body //temp until we have templates in place
        }
        console.log(body)
        if (sails.config.environment === 'production' || sails.config.environment == 'testing') {
            return await(transporter.sendMail(mailOptions))
        }
    })
}