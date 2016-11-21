var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = async(function (req, res, next) {

    if (req.user) {
        if (await(UserService.hasRole(req.user.id, 'registered'))) {
            return res.forbidden();
        }
    }
    
    return next();
});