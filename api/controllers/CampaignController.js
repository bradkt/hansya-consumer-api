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
        var campaigns = await(Campaign.find({ user: req.user.id }))
        campaigns.forEach(function(wo){
            delete(wo.paymentID)
        })
        res.send(campaigns)
    }),

    findOne: async(function (req, res) {
        var campaign = await(Campaign.findOne({ user: req.user.id, id: req.params.id }))
        if (!campaign){
            res.notFound()
        }
        else{
            delete campaign.paymentID
            res.send(campaign)
        }
    }),

    all: async(function(req, res){
        Campaign.find({}).then(function(results){
            res.send(results);
        })
    })
};

