var async = require('asyncawait/async')
var await = require('asyncawait/await')
var round = require('mongo-round');

var Promise = require('bluebird')

module.exports = {

    parsePosters: function (messages) {
        posters = []
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
        return posters
    },

    conversations: function (campaignID, cb) {
        cb(null, await(Conversation.find({ campaign: campaignID }).populate('messages')))
    },

    engagement: function (campaignID, cb) {
        try {
            Message.native(function (err, collection) {
                if (err) { cb(err, null) }
                collection.aggregate([
                    { $match: { campaign: campaignID } },
                    {
                        $group: {
                            _id: '',
                            averageEngagements: { $avg: '$metrics.engagements' },
                            minimumEngagements: { $min: '$metrics.engagements' },
                            maximumEngagements: { $max: '$metrics.engagements' },
                            totalEngagements: { $sum: '$metrics.engagements' },
                            averageEngagementRate: { $avg: '$metrics.engagement_rate' },
                            minimumEngagementRate: { $min: '$metrics.engagement_rate' },
                            maximumEngagementRate: { $max: '$metrics.engagement_rate' }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            averageEngagements: round("$averageEngagements",4),
                            minimumEngagements: "$minimumEngagements",
                            maximumEngagements: "$maximumEngagements",
                            totalEngagements: "$totalEngagements",
                            averageEngagementRate: round("$averageEngagementRate",4),
                            minimumEngagementRate: "$minimumEngagementRate",
                            maximumEngagementRate: "$maximumEngagementRate"
                        }
                    }
                ], function (err, engagement) {
                    if (err) { cb(err, null) }
                    cb(null, engagement[0])
                })

            })
        }
        catch (e) {
            cb(e, null)
        }
    },

    locationsOfMessages: function (campaignID, cb) {
        try {
            Message.native(function (err, collection) {
                if (err) { cb(err, null) }
                collection.aggregate([
                    { $match: { campaign: campaignID } },
                    { $group: { _id: "$message.location", count: { $sum: 1 } } },
                    { $sort: {'count': -1, '_id': 1}}
                ], function (err, locations) {
                    if (err) { cb(err, null) }
                    cb(null, locations)
                })

            })
        }
        catch (e) { cb(e, null) }
    },

    messages: function (campaignID, cb) {
        cb(null, await(Message.find({ campaign: campaignID })))
    },

    sentimentScores: function (campaignID, cb) {
        try {
            Message.native(function (err, collection) {
                if (err) { cb(err, null) }
                collection.aggregate([
                    { $match: { campaign: campaignID } },
                    {
                        $group: {
                            _id: '',
                            averageSentimentScore: { $avg: '$metrics.sentiment_score' },
                            maximumSentimentScore: { $max: '$metrics.sentiment_score' },
                            minimumSentimentScore: { $min: '$metrics.sentiment_score' },
                            totalSentimentScore: { $sum: '$metrics.sentiment_score' },
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            averageSentimentScore: round("$averageSentimentScore",4),
                            maximumSentimentScore: round("$maximumSentimentScore",4),
                            minimumSentimentScore: round("$minimumSentimentScore",4),
                            totalSentimentScore: round("$totalSentimentScore",4)
                        }
                    }
                ], function (err, scores) {
                    if (err) { cb(err, null) }
                    cb(null, scores[0])
                })

            })
        }
        catch (e) {
            cb(e, null)
        }
    },

    totalLikes: function (campaignID, cb) {
        try {
            Message.native(function (err, collection) {
                if (err) { cb(err, null) }
                collection.aggregate([
                    { $match: { campaign: campaignID } },
                    { $group: { _id: '', likes: { $sum: '$metrics.likes' } } },
                    { $project: { _id: 0, likes: '$likes' } }
                ], function (err, likes) {
                    if (err) { cb(err, null) }
                    cb(null, likes[0])
                })

            })
        }
        catch (e) {
            cb(e, null)
        }
    },

    posters: async(function (campaignID, cb) {
        try {
            Message.native(async(function (err, collection) {
                if (err) { cb(err, null) }
                var posterIDs = await(collection.distinct('poster', { campaign: campaignID }))
                var posters = await(Poster.find({ id: posterIDs }))
                cb(null, posters)
            }))
        }
        catch (e) {
            cb(e, null)
        }
    }),

    totalShares: function (campaignID, cb) {
        try {
            Message.native(function (err, collection) {
                if (err) { cb(err, null) }
                collection.aggregate([
                    { $match: { campaign: campaignID } },
                    { $group: { _id: '', shares: { $sum: '$metrics.shares' } } },
                    { $project: { _id: 0, shares: '$shares' } }
                ], function (err, shares) {
                    if (err) { cb(err, null) }
                    cb(null, shares[0])
                })
            })
        }
        catch (e) {
            cb(e, null)
        }
    }
}