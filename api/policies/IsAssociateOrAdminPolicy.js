var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = async(function (req, res, next) {

    // User is allowed, proceed to the next policy, 
    // or if this is the last policy, the controller
    if (req.user && await(UserService.hasRole(req.user.id, 'associate')) || await(UserService.hasRole(req.user.id, 'admin'))) {
        return next();
    }

    return res.forbidden();
});