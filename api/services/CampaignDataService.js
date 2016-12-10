

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