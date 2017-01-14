var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = {

    getCampaignsForUser: async(function (userId) {
        var user = await(User.findOne({id: userId}))
        var campaigns = await(Campaign.find({user: userId}))
        // var campaigns = await(Campaign.find({ or: [{ user: userId }, { company: user.company, visibility: 'company' }], company: {'!=': [undefined, null, 'undefined']} }))
        return campaigns
    }),

    hasAccessToCampaign: async(function (userId, campaignId) {
        var campaigns = await(this.getCampaignsForUser(userId))
        var index = campaigns.findIndex(function (campaign) {
            return campaign.id == campaignId
        })
        if (index > -1) {
            return true
        }
        else {
            return false
        } 
    })
};
