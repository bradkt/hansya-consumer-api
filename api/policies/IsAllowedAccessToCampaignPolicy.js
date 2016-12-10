var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = async(function (req, res, next) {

    // User is allowed, proceed to the next policy, 
    // or if this is the last policy, the controller
    if (!req.user) {
        return res.forbidden();
    }
    else if (await(UserService.role(req.user.id)) == 'registered') {
        if (!await(CampaignService.hasAccessToCampaign(req.user.id, req.param('id')))) {
            return res.forbidden();
        }
    }

    return next()
});