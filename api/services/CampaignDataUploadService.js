var async = require('asyncawait/async')
var await = require('asyncawait/await')

var Promise = require('bluebird')

module.exports = {
    createPostersIfNeeded: async(function (posters) {
        await(Promise.all(posters.map(async(function (poster) {
            await(Poster.findOrCreate(poster))
        }))))
    }),

    createMessages: async(function (messages, metrics, campaign) {
        await(Promise.all(messages.map(async(function (message) {
            var metric = metrics.filter(function (metric) {
                return metric.message_id == message.mid
            })
            var poster = await(Poster.findOne({ screen_name: message.screen_name }))
            await(Message.create({
                id: message.mid,
                campaign: campaign.id,
                metrics: metric[0],
                poster: poster.id,
                message: message
            }))
        }))))
    }),

    createConversations: async(function (conversations, campaign) {

        await(Promise.all(conversations.map(async(function (conversation) {
            await(Conversation.create({
                id: conversation.con_id,
                messages: conversation.convo_thread,
                campaign: campaign.id
            }))
        }))))
    })
}