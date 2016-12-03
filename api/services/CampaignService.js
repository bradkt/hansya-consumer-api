var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = {

    getCampaignsForUser: async(function (userId) {
        var user = await(User.findOne({id: userId}))
        return await(Campaign.find({ or: [{ user: userId }, { company: user.company, visibility: 'company' }] }))
    }),

    hasAccessToCampaign: async(function (userId, campaignId) {
        var campaigns = await(this.getCampaignsForUser(userId))
        var index = campaigns.findIndex(function (campaign) {
            return campaign.id == campaignId
        })
        console.log(index > -1)
        if (index > -1) {
            return true
        }
        else {
            return false
        } 
    })
};
