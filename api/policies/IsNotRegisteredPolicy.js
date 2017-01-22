var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = async(function (req, res, next) {

    if (req.user) {
        if (await(UserService.hasRole(req.session.passport.user, 'registered'))) {
            return res.forbidden();
        }
    }
    
    return next();
});