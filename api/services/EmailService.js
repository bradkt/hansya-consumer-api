var async = require('asyncawait/async')
var await = require('asyncawait/await')
var request = require('request')

module.exports = {
    sendEmail: async(function (from, to, subject, body) {
        response = await(request.post(
            sails.config.emailServer + '/send',
            {
                json: {
                    "sender": from,
                    "receiver": to,
                    "subject": subject,
                    "text": body,
                    "html": `<h1>${body}</h1>`
                }
            }
        ))
    })
}