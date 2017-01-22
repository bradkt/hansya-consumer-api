var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = async(function (req, res, next) {

    if (await(UserService.hasRole(req.session.passport.user, 'registered'))) {
        if (typeof req.body.user === 'undefined') {
            req.body.user = req.session.passport.user
        }
        else if (req.body.user != req.session.passport.user) {
            return res.badRequest()
        }
    }
    else { // user is either associate or admin
        if (typeof req.body.user === 'undefined') {
            return res.badRequest('A registered user must be supplied')
        }
        if(!await(UserService.hasRole(req.body.user, 'registered'))){
            return res.badRequest('A campaign must be created for a registered user')
        }
    }
    var user = await(User.findOne({id: req.body.user})) 
    req.body.company = user.company

    return next();
});