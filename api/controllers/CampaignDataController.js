var async = require('asyncawait/async')
var await = require('asyncawait/await')

fs = require('fs')

module.exports = {
    _config: {  //Override default behavior as this is just an upload endpoint
        actions: true,
        shortcuts: false,
        rest: false
    },
    all: async(function (req, res) {

        if (await(UserService.role(req.user.id)) == 'registered') {
            if (!await(CampaignService.hasAccessToCampaign(req.user.id, req.param('id')))) {
                res.forbidden();
            }
        }
        var messages = await(Message.find({ campaign: req.param('id') }).populate('poster'))
        var conversations = await(Conversation.find({ campaign: req.param('id') }).populate('messages'))
        var posters = []
        messages.forEach(function (message) {
            if (posters === []) {
                posters.push(message.poster)
            }
            else {
                var idx = posters.findIndex(function (poster) {
                    return poster.id === message.poster.id
                })
                if (idx == -1) {
                    posters.push(message.poster)
                }
            }

        })
        res.send({ messages: messages, conversations: conversations, posters: posters })
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
                var campaigns = await(Campaign.find({}))
                var campaign = await(Campaign.findOne({ id: fileData.meta_data.campaign.campaign_id }))
                if (!campaign) {
                    res.notFound('Campaign not found')
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