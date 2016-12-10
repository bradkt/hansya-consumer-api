

var async = require('asyncawait/async')
var await = require('asyncawait/await')

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
                            averageEngagements: "$averageEngagements",
                            minimumEngagements: "$minimumEngagements",
                            maximumEngagements: "$maximumEngagements",
                            totalEngagements: "$totalEngagements",
                            averageEngagementRate: "$averageEngagementRate",
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
                    { $group: { _id: "$message.location", count: { $sum: 1 } } }
                ], function (err, locations) {
                    if (err) { cb(err, null) }
                    cb(null, locations)
                })

            })
        }
        catch (e) { cb(e, null) }
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