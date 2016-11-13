var async = require('asyncawait/async')
var await = require('asyncawait/await')

fs = require('fs')

module.exports = {
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