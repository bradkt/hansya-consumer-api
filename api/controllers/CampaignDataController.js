var async = require('asyncawait/async')
var await = require('asyncawait/await')

fs = require('fs')

module.exports = {
    _config: {  //Override default behavior as this is not a standard rest API endpoint
        actions: true,
        shortcuts: false,
        rest: false
    },

    all: async(function (req, res) {
        var messages = await(Message.find({ campaign: req.param('id') }).populate('poster'))
        var conversations = await(Conversation.find({ campaign: req.param('id') }).populate('messages'))
        var posters = await(CampaignDataService.parsePosters(messages))
        res.send({ messages: messages, conversations: conversations, posters: posters })
    }),

    conversation: async(function (req, res) {
        CampaignDataService.conversations(req.param('id'), function (err, result) {
            if (err) { res.serverError(err.message) }
            res.send(result)
        })
    }),

    engagement: function (req, res) {
        CampaignDataService.engagement(req.param('id'), function (err, engagement) {
            if (err) { res.serverError(err) }
            res.send(engagement)
        })
    },

    locationSummary: async(function (req, res) {
        CampaignDataService.locationsOfMessages(req.param('id'), function (err, result) {
            if (err) { res.serverError(err) }
            res.send(result);
        })
    }),

    message: async(function (req, res) {
        CampaignDataService.messages(req.param('id'), function (err, result) {
            if (err) { res.serverError(err.message) }
            res.send(result)
        })
    }),

    poster: function (req, res) {
        CampaignDataService.posters(req.param('id'), function (err, result) {
            if (err) { res.serverError(err.message) }
            res.send(result)
        })
    },

    sentiment: function(req, res) {
        CampaignDataService.sentimentScores(req.param('id'), function(err, scores){
            if(err) {res.serverError(err.message)}
            res.send(scores)
        })
    },

    totalLikes: function (req, res) {
        CampaignDataService.totalLikes(req.param('id'), function (err, likes) {
            if (err) { res.serverError(err) }
            res.send(likes)
        })
    },

    totalShares: function (req, res) {
        CampaignDataService.totalShares(req.param('id'), function (err, shares) {
            if (err) { res.serverError(err) }
            res.send(shares)
        })
    },

    upload: function (req, res) {
        req.file('data').upload(function (err, uploadedFiles) {
            var ok = false
            if (err) {
                sails.log.error(err)
                res.badRequest();
            };
            fs.readFile(uploadedFiles[0].fd, 'utf8', async(function (err, fileData) {
                fileData = JSON.parse(fileData)
                if (err) {
                    sails.log.error(err)
                    res.badRequest();
                }
                var campaign = await(Campaign.findOne({ id: fileData.meta_data.campaign.campaign_id }))
                if (!campaign) {
                    res.badRequest('Campaign not found')
                }
                try {
                    await(CampaignDataUploadService.createPostersIfNeeded(fileData.users))
                    await(CampaignDataUploadService.createMessages(fileData.messages, fileData.metrics, campaign))
                    await(CampaignDataUploadService.createConversations(fileData.conversations, campaign))
                    res.ok()
                }
                catch (exception) {
                    sails.log.error(exception)
                    res.badRequest(exception.message)
                }

            }))
        })
    }
}