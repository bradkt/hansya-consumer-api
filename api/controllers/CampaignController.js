/**
 * campaignController
 *
 * @description :: Server-side logic for managing campaigns
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = {
    find: async(function (req, res) {
        if (await(UserService.role(req.user.id)) == 'registered') {
            var campaigns = await(CampaignService.getCampaignsForUser(req.user.id))
            campaigns.forEach(function (wo) {
                delete (wo.paymentID)
            })
            res.send(campaigns)
        }
        else {
            res.send(await(Campaign.find({})))
        }
    }),

    findOne: async(function (req, res) {
        var campaign = await(Campaign.findOne({ id: req.param('id') }))
        if (!campaign) {
            res.notFound();
        }
        if (await(UserService.role(req.user.id)) == 'registered') {
            var has_access = await(CampaignService.hasAccessToCampaign(req.user.id, req.param('id')))
            if (has_access) {
                delete (campaign.paymentID)
                res.send(campaign)
            }
            else {
                res.notFound()
            }
        }
        else {
            res.send(campaign)
        }

    }),

    all: async(function (req, res) {
        var results = await(Campaign.find({}))
        res.send(results);
    })
};

