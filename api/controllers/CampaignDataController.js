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

    locationSummary: async(function (req, res) {
        var messages = await(Message.find({ campaign: req.param('id') }))
        // var locations = await(Message.find({campaign: req.param('id') }).groupBy('message.location').sum('_id'))
        // Message.find({ campaign: req.param('id') }).groupBy('screen_name').sum('id').exec(function (err, results) {
        //     console.log(results)
        // })
        try {
            Message.native(function (err, collection) {
                if (err) {
                    res.serverError(err)
                }
                collection.aggregate([
                    {
                        $match: {
                            campaign: req.param('id')
                        }
                    },
                    {
                        $group: { _id: "$message.location", count: { $sum: 1 } }
                    }
                ], function (err, locations) {
                    if (err) {
                        res.serverError(err)
                    }
                    res.send(locations)
                })

            })
        }
        catch (e){
            res.serverError('DB Error')
        }

        // console.log(messages[0].message.location)
        // res.send(results)
        // var deferred = Q.defer();
        // Message.native
        //     .then(function (collection) {
        //         collection.aggregate([
        //             {
        //                 $match: {
        //                     campaign: req.param('id')
        //                 }
        //             },
        //             {
        //                 $group: {

        //                 }
        //             }
        //         ])
        //             .then(function (result) {
        //                 deferred.resolve(result)
        //             })
        //     })
        //     return deffered.resolve(result)

    }),

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