var expect = require('chai').expect

var async = require('asyncawait/async')
var await = require('asyncawait/await')

describe('CampaignDataUploadService', function () {
    before(function () {
        posters = [{
            "name": "Jarrett Parker",
            "screen_name": "ParkerJ",
            "location": "Addison, TX",
            "ip": "127.01.01.01",
            "profile_image": "jpg"
        },
            {
                "name": "1maclassicman",
                "screen_name": "DJ Counts",
                "location": "Addison, TX",
                "ip": "127.12.01.11",
                "profile_image": "jpg"
            },
            {
                "name": "Pranav Teja",
                "screen_name": "Pranavteja912",
                "location": "Addison, TX",
                "ip": "127.23.01.21",
                "profile_image": "jpg"
            },
            {
                "name": "BranDon McLuvin",
                "screen_name": "BMLS",
                "location": "Arlington, VA",
                "ip": "127.24.01.31",
                "profile_image": "jpg"
            },
            {
                "name": "Tristan Heitkemper",
                "screen_name": "TheYooper15",
                "location": "Ashwaubenon, WI",
                "ip": "127.25.01.41",
                "profile_image": "jpg"
            },
            {
                "name": "mmichee7",
                "screen_name": "M M",
                "location": "Ashwaubenon, WI",
                "ip": "127.35.01.51",
                "profile_image": "jpg"
            },
            {
                "name": "chefmarknanna",
                "screen_name": "mark nanna",
                "location": "Addison, TX",
                "ip": "127.45.01.61",
                "profile_image": "jpg"
            },
            {
                "name": "Morgan J. Lopes",
                "screen_name": "Zack Zerbe",
                "location": "Atlanta, GA",
                "ip": "127.55.01.71",
                "profile_image": "jpg"
            },
            {
                "name": "Nicole Saltos",
                "screen_name": "Big Dick Bee 30265",
                "location": "Atlanta, GA",
                "ip": "127.67.01.81",
                "profile_image": "jpg"
            },
            {
                "name": "WPIR984Fm",
                "screen_name": "WPIR 98.4Fm",
                "location": "Addison, TX",
                "ip": "127.76.01.91",
                "profile_image": "jpg"
            },
            {
                "name": "JovonnieB",
                "screen_name": "Drakonc\u00e9 Minaj",
                "location": "Atlanta, GA",
                "ip": "127.86.01.63",
                "profile_image": "jpg"
            }]

        messages = [
            {
                "mid": "698674753033392129",
                "device": "ios",
                "datetime": "2016-02-13 20:06:56",
                "location": "Barboursville, WV",
                "text": "Early Valentine's Day chipotle with this babe ???????????? @hamhowes @ Chipotle Mexican Grill https://www.instagram.com/p/BBv2WzZxmM9/",
                "screen_name": "Big Dick Bee 30265",
                "message_content": [
                    "this is string1",
                    "this is string2",
                    "this is string3"
                ],
                "u_name": "joskater",
                "is_reply_to": 0,
                "is_ad_link": 0
            },
            {
                "mid": "686998660635324416",
                "device": "ios",
                "datetime": "2016-01-12 14:50:19",
                "location": "Bedford, NH",
                "text": "If you're ever in the area getting your car serviced be sure to stop in here at Chipotle! They\u2026 https://www.instagram.com/p/BAc4ryrsHsA/",
                "screen_name": "Zack Zerbe",
                "message_content": [
                    "this is string1",
                    "this is string2",
                    "this is string3"
                ],
                "u_name": "Zzerbe",
                "is_reply_to": 0,
                "is_ad_link": 0
            },
            {
                "mid": "686998660635324415",
                "device": "ios",
                "datetime": "2016-01-12 14:50:19",
                "location": "Bedford, NH",
                "text": "If you're ever in the area getting your car serviced be sure to stop in here at Chipotle! They\u2026 https://www.instagram.com/p/BAc4ryrsHsA/",
                "screen_name": "Zack Zerbe",
                "message_content": [
                    "this is string1",
                    "this is string2",
                    "this is string3"
                ],
                "u_name": "Zzerbe",
                "is_reply_to": 0,
                "is_ad_link": 0
            }
        ]

        conversations = [
            {
                "con_id": "214996802353758208",
                "depth": "1",
                "is_reply_to": 0,
                "convo_thread": ['686998660635324415']
            },
            {
                "con_id": "194996802353758208",
                "depth": "2",
                "is_reply_to": 0,
                "convo_thread": ['686998660635324416', '698674753033392129']
            }
        ]

        metrics = [
            {
                "message_id": "698674753033392129",
                "sentiment_score": ".5",
                "likes": 1768,
                "shares": 1489,
                "impressions": 11710,
                "engagements": 3219,
                "engagement_rate": 29,
                "is_ad_clicked": 0,
                "click_time": "2016-03-29 17:34:5,"
            },
            {
                "message_id": "686998660635324416",
                "sentiment_score": "1",
                "likes": 71,
                "shares": 89,
                "impressions": 1010,
                "engagements": 529,
                "engagement_rate": 52,
                "is_ad_clicked": 1,
                "click_time": "2016-03-29 13:17:5,"
            },
            {
                "message_id": "686998660635324415",
                "sentiment_score": "1",
                "likes": 71,
                "shares": 89,
                "impressions": 1010,
                "engagements": 529,
                "engagement_rate": 52,
                "is_ad_clicked": 1,
                "click_time": "2016-03-29 13:17:5,"
            }
        ]
    })
    beforeEach(async(function () {
        await(Poster.destroy({}))
        await(Message.destroy({}))
        await(Conversation.destroy({}))
        await(Campaign.destroy({}))
        var user = await(User.findOne({ username: 'associate' }))
        var products = await(Product.find({}))
        await(Campaign.create({
            id: 'asdfasdf',
            requestedDate: new Date(),
            keywords: ['Merge Industry and', 'Whatever', 'Else', 'Is', 'Added'],
            user: user,
            product: products[0],
            paid: true,
            paymentID: 'abcd12',
            company: 1,
            visibility: 'company'
        }))
        return true
    }))
    afterEach(async(function () {
        await(Poster.destroy({}))
        await(Message.destroy({}))
        await(Conversation.destroy({}))
        await(Campaign.destroy({}))
        return true
    }))

    it('should create posters', async(function () {
        await(CampaignDataUploadService.createPostersIfNeeded(posters))
        dbPosters = await(Poster.find({}))
        return expect(dbPosters.length).to.equal(11)
    }))

    it('should create messages', async(function () {
        var campaigns = await(Campaign.find({}))
        await(CampaignDataUploadService.createPostersIfNeeded(posters))
        await(CampaignDataUploadService.createMessages(messages, metrics, campaigns[0]))
        dbMessages = await(Message.find({}).populate('poster'))
        var index = dbMessages.indexOf({
            message_id: '686998660635324416',
            sentiment_score: '1',
            likes: 71,
            shares: 89,
            impressions: 1010,
            engagements: 529,
            engagement_rate: 52,
            is_ad_clicked: 1,
            click_time: '2016-03-29 13:17:5,'
        })
        return (expect(dbMessages.length).to.equal(3) &&
            expect(dbMessages[index].metrics).to.deep.equal({
                message_id: '686998660635324416',
                sentiment_score: '1',
                likes: 71,
                shares: 89,
                impressions: 1010,
                engagements: 529,
                engagement_rate: 52,
                is_ad_clicked: 1,
                click_time: '2016-03-29 13:17:5,'
            }) &&
            expect(dbMessages[index].metrics.likes).to.be.a('number') &&
            expect(dbMessages[index].message).to.deep.equal(
                {
                    mid: '686998660635324416',
                    device: 'ios',
                    datetime: '2016-01-12 14:50:19',
                    location: 'Bedford, NH',
                    text: 'If you\'re ever in the area getting your car serviced be sure to stop in here at Chipotle! They… https://www.instagram.com/p/BAc4ryrsHsA/',
                    screen_name: 'Zack Zerbe',
                    message_content: ['this is string1', 'this is string2', 'this is string3'],
                    u_name: 'Zzerbe',
                    is_reply_to: 0,
                    is_ad_link: 0
                }
            ) &&
            expect(dbMessages[index].poster.screen_name).to.deep.equal('Zack Zerbe') &&
            expect(dbMessages[index].campaign).to.equal('asdfasdf'))
    }))

    it('should create conversations', async(function () {
        var campaigns = await(Campaign.find({}))
        await(CampaignDataUploadService.createPostersIfNeeded(posters))
        await(CampaignDataUploadService.createMessages(messages, metrics, campaigns[0]))
        await(CampaignDataUploadService.createConversations(conversations, campaigns[0]))
        conversations = await(Conversation.find({}).populate('messages'))
        return (expect(conversations.length).to.equal(2) &&
            expect(conversations[0].messages.length).to.equal(1) &&
            expect(conversations[0].messages[0].id).to.equal('686998660635324415') &&
            expect(conversations[0].id).to.equal('214996802353758208') &&
            expect(conversations[1].messages.length).to.equal(8))
    }))

})