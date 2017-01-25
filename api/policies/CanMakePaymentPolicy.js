var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = async(function (req, res, next) {

    // User is allowed, proceed to the next policy, 
    // or if this is the last policy, the controller
    if (!req.user) {
        return res.forbidden();
    }
    else if (await(UserService.role(req.session.passport.user)) == 'registered') {
        if (!await(CampaignService.hasAccessToCampaign(req.session.passport.user, req.param('campaignID')))) {
            return res.forbidden();
        }
    }
    var campaign = await(Campaign.findOne({ id: req.param('campaignID') }))
    if (!campaign || campaign.paid == true) {
        return res.badRequest();
    }

    return next()
});