var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = async(function (req, res, next) {
    if(await(UserService.hasRole(req.user.id, 'registered'))){
        if(req.options.action == 'all'){
            return res.forbidden();
        }
    }

    return next();
})