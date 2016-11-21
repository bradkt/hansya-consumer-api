var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = async(function (req, res, next) {

    // User is allowed, proceed to the next policy, 
    // or if this is the last policy, the controller
    if (await(UserService.hasRole(req.user.id, 'registered'))) {
        if (req.allParams().keywords ||
            req.allParams().assignedUser ||
            req.allParams().requestedDate ||
            req.allParams().acceptedDate ||
            req.allParams().completedDate ||
            req.allParams().user ||
            req.allParams().product) {
            return res.forbidden();
        }
    }
    if (await(UserService.hasRole(req.user.id, 'associate'))) {
        if (req.allParams().keywords ||
            req.allParams().requestedDate ||
            req.allParams().user ||
            req.allParams().product) {
            return res.forbidden();
        }
    }

    if (await(UserService.hasRole(req.user.id, 'admin'))) {
        if (req.allParams().keywords ||
            req.allParams().requestedDate ||
            req.allParams().user) {
            return res.forbidden();
        }
    }


    return next();
});