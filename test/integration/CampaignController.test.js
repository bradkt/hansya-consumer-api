var expect = require('chai').expect
var chai = require('chai')
chai.config.truncateThreshold = 0;

var async = require('asyncawait/async')
var await = require('asyncawait/await')

var request

describe('CampaignController', function () {
    before(async(function () {
        newUser = await(User.register({ email: 'newuser@example.com', password: 'newuser1234', username: 'newuser', company: 1 }))
        console.log("Created: "+ newUser)
    }))
    after(async(function () {
        await(User.destroy({ username: 'newuser' }))
    }))
    afterEach(async(function () {
        await(Campaign.destroy({}))
        await(Poster.destroy({}))
        await(Message.destroy({}))
        await(Conversation.destroy({}))
    }))
    beforeEach(async(function () {
        user = await(User.findOne({ username: 'registered' }))
        companies = await(Company.find({}))
        products = await(Product.find({}))
        await(Campaign.create({
            id: 1,
            requestedDate: new Date(),
            keywords: ['Merge Industry and', 'Whatever', 'Else', 'Is', 'Added'],
            user: user,
            product: products[0],
            paid: true,
            paymentID: 'abcd12',
            company: 1,
            visibility: 'company'
        }))
        await(Campaign.create({
            id: 2,
            requestedDate: new Date(),
            keywords: ['Merge Industry and', 'Whatever', 'Else', 'Is', 'Added'],
            user: user,
            product: products[0],
            paid: true,
            paymentID: 'abcd12',
            company: 1,
            visibility: 'user'
        }))
        await(Campaign.create({
            id: 4,
            requestedDate: new Date(),
            keywords: ['Merge Industry and', 'Whatever', 'Else', 'Is', 'Added', 'to', 'this'],
            user: newUser,
            product: products[0],
            paid: true,
            paymentID: 'abcd12',
            company: 1,
            visibility: 'user'
        }))
        var otherUser = await(User.findOne({ username: 'registered2' }))
        await(Campaign.create({
            id: 3,
            requestedDate: new Date(),
            keywords: ['Merge Industry and', 'Whatever', 'Else', 'Is', 'Added'],
            user: otherUser,
            product: products[0],
            paid: true,
            paymentID: 'abcd12',
            company: 2,
            visibility: 'company'
        }))
        var campaign = await(Campaign.findOne({ id: 1 }))
        posters = [{
            "name": "Jarrett Parker",
            "screen_name": "ParkerJ",
            "location": "Addison, TX",
            "ip": "127.01.01.01",
            "profile_image": "jpg"
        }]
        await(Poster.findOrCreate(posters[0]))
        metrics = [{
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
                "message_id": "698674753033392129",
                "sentiment_score": ".5",
                "likes": 1768,
                "shares": 1489,
                "impressions": 11710,
                "engagements": 3219,
                "engagement_rate": 29,
                "is_ad_clicked": 0,
                "click_time": "2016-03-29 17:34:5,"
            }
        ]

        messages = [{
            "mid": "686998660635324416",
            "device": "ios",
            "datetime": "2016-01-12 14:50:19",
            "location": "Bedford, NH",
            "text": "If you're ever in the area getting your car serviced be sure to stop in here at Chipotle! They\u2026 https://www.instagram.com/p/BAc4ryrsHsA/",
            "screen_name": "ParkerJ",
            "message_content": [
                "this is string1",
                "this is string2",
                "this is string3"
            ],
            "u_name": "Zzerbe",
            "is_reply_to": 0,
            "is_ad_link": 0
        }, {
                "mid": "698674753033392129",
                "device": "ios",
                "datetime": "2016-02-13 20:06:56",
                "location": "Barboursville, WV",
                "text": "Early Valentine's Day chipotle with this babe ???????????? @hamhowes @ Chipotle Mexican Grill https://www.instagram.com/p/BBv2WzZxmM9/",
                "screen_name": "ParkerJ",
                "message_content": [
                    "this is string1",
                    "this is string2",
                    "this is string3"
                ],
                "u_name": "joskater",
                "is_reply_to": 0,
                "is_ad_link": 0
            }]

        conversations = [{
            "con_id": "144996802353758208",
            "depth": "3",
            "is_reply_to": 1,
            "convo_thread": ["698674753033392129", "686998660635324416"]
        }]



        await(Promise.all(messages.map(async(function (message) {
            var metric = metrics.filter(function (metric) {
                return metric.message_id == message.mid
            })
            var poster = await(Poster.findOne({ screen_name: message.screen_name }))
            if (!poster) { return false }
            await(Message.create({
                id: message.mid,
                campaign: campaign.id,
                metrics: metric[0],
                poster: poster.id,
                message: message
            }))
        }))))


        var messages = await(Message.find({}))

        await(Promise.all(conversations.map(async(function (conversation) {
            await(Conversation.create({
                id: conversation.con_id,
                messages: conversation.convo_thread,
                campaign: campaign.id
            }))
        }))))
    }))

    describe('OtherRegisteredUser', function () {
        before(function () {
            request = require('supertest-as-promised').agent(sails.hooks.http.app);
            return request
                .post('/auth/local')
                .send({ identifier: 'newuser@example.com', password: 'newuser1234' })
        })
        describe('#get', function () {
            it('should return all the campaigns for the registered user', async(function () {
                var res = await(request.get('/campaign'))
                return (expect(res.body.length).to.equal(2) &&
                    expect(res.statusCode).to.equal(200))
            }))
            it('should not return the campaigns for the other user that is locked to the user', async(function(){
                var res = await(request.get('/campaign'))
                return (expect(res.body.findIndex(function(campaign){campaign.id === 2})).to.equal(-1))                
            }))
        })
    })

    describe('RegisteredUsers', function () {
        before(function () {
            request = require('supertest-as-promised').agent(sails.hooks.http.app);
            return request
                .post('/auth/local')
                .send({ identifier: 'registered@example.com', password: 'registered1234' })
        })

        describe('#get()', function () {
            it('should return all the campaigns for the registered user', async(function () {
                var res = await(request.get('/campaign'))
                return (expect(res.body.length).to.equal(2) &&
                    expect(res.statusCode).to.equal(200))

            }))

            it('should return a single campaign for the registered user', async(function () {
                var wos = await(request.get('/campaign'))
                var wo = wos.body[0]
                var response = await(request.get('/campaign/' + wo.id))
                return (expect(response.body).to.deep.equal(wo) &&
                    expect(response.statusCode).to.equal(200))
            }))

            it('should not let me return a campaign for another user', async(function () {
                var response = await(request.get('/campaign/3'))
                return (expect(response.body).to.deep.equal({}) &&
                    expect(response.statusCode).to.equal(404))
            }))

            it('should not return the paymentID to the registered user', async(function () {
                var response = await(request.get('/campaign/1'))
                var campaignDatabase = await(Campaign.findOne({ id: 1 }))
                return (expect(response.body.paymentID).to.equal(undefined) &&
                    expect(campaignDatabase.paymentID).to.equal('abcd12'))
            }))

            it('should not let me get all campaigns', async(function () {
                var response = await(request.get('/campaign/all'))
                return expect(response.statusCode).to.equal(403)
            }))

            it('should not matter what verb is used', async(function () {
                var response = await(request.del('/campaign/all'))
                return expect(response.statusCode).to.equal(403)
            }))
        })

        describe('#put()', function () {
            it('should modify the campaign supplied', async(function () {
                var campaigns = await(request.get('/campaign'))
                var campaign = campaigns.body[0]
                var response = await(request.put('/campaign/' + campaign.id)
                    .send({ paid: true, paymentID: '42 baker' }))
                var campaignDatabase = await(Campaign.findOne({ id: campaign.id }))
                return (expect(campaignDatabase.paid).to.equal(true) &&
                    expect(campaignDatabase.paymentID).to.equal('42 baker'))
            }))

            it('should not let me update my keywords', async(function () {
                var campaigns = await(request.get('/campaign'))
                var campaign = campaigns.body[0]
                var response = await(request.put('/campaign/' + campaign.id)
                    .send({ keywords: ['42', 'Grand', 'Fiber one'] }))
                var campaignDatabase = await(Campaign.findOne({ id: campaign.id }))
                return (expect(campaignDatabase.keywords).to.not.equal(['42', 'Grand', 'Fiber one']) &&
                    expect(response.statusCode).to.equal(403))
            }))

            it('should not let me update the assigned associate', async(function () {
                var campaigns = await(request.get('/campaign'))
                var campaign = campaigns.body[0]
                var response = await(request.put('/campaign/' + campaign.id)
                    .send({ assignedUser: 'Donald Duck' }))
                var campaignDatabase = await(Campaign.findOne({ id: campaign.id }))
                return (expect(campaignDatabase.assignedUser).to.not.deep.equal('Donald Duck') &&
                    expect(response.statusCode).to.equal(403))
            }))

            it('should not let me update the acceptedDate', async(function () {
                var date = new Date()
                var campaigns = await(request.get('/campaign'))
                var campaign = campaigns.body[0]
                var campaignDatabaseBefore = await(Campaign.findOne({ id: campaign.id }))
                var response = await(request.put('/campaign/' + campaign.id)
                    .send({ acceptedDate: date }))
                var campaignDatabaseAfter = await(Campaign.findOne({ id: campaign.id }))
                return (expect(campaignDatabaseAfter.acceptedDate).to.not.deep.equal(date) &&
                    expect(campaignDatabaseAfter.acceptedDate).to.deep.equal(campaignDatabaseBefore.acceptedDate) &&
                    expect(response.statusCode).to.equal(403))
            }))

            it('should not let me update the requestedDate', async(function () {
                var date = new Date()
                var campaigns = await(request.get('/campaign'))
                var campaign = campaigns.body[0]
                var campaignDatabaseBefore = await(Campaign.findOne({ id: campaign.id }))
                var response = await(request.put('/campaign/' + campaign.id)
                    .send({ requestedDate: date }))
                var campaignDatabaseAfter = await(Campaign.findOne({ id: campaign.id }))
                return (expect(campaignDatabaseAfter.requestedDate).to.not.deep.equal(date) &&
                    expect(campaignDatabaseAfter.requestedDate).to.deep.equal(campaignDatabaseBefore.requestedDate) &&
                    expect(response.statusCode).to.equal(403))
            }))

            it('should not let me update the completedDate', async(function () {
                var date = new Date()
                var campaigns = await(request.get('/campaign'))
                var campaign = campaigns.body[0]
                var campaignDatabaseBefore = await(Campaign.findOne({ id: campaign.id }))
                var response = await(request.put('/campaign/' + campaign.id)
                    .send({ completedDate: date }))
                var campaignDatabaseAfter = await(Campaign.findOne({ id: campaign.id }))
                return (expect(campaignDatabaseAfter.completedDate).to.not.deep.equal(date) &&
                    expect(campaignDatabaseAfter.completedDate).to.deep.equal(campaignDatabaseBefore.completedDate) &&
                    expect(response.statusCode).to.equal(403))
            }))


            it('should not let me update the user', async(function () {
                var campaigns = await(request.get('/campaign'))
                var campaign = campaigns.body[0]
                var response = await(request.put('/campaign/' + campaign.id)
                    .send({ user: 42 }))
                var campaignAfter = await(Campaign.findOne({ id: 1 }))
                return (expect(campaignAfter.user).to.deep.equal(campaign.user) &&
                    expect(response.statusCode).to.eql(403))
            }))

            it('should not let me update the product', async(function () {
                var campaigns = await(request.get('/campaign'))
                var campaign = campaigns.body[0]
                var response = await(request.put('/campaign/' + campaign.id)
                    .send({ product: 88 }))
                var campaignAfter = await(Campaign.findOne({ id: 1 }))
                return (expect(campaignAfter.product).to.deep.equal(campaign.product) &&
                    expect(response.statusCode).to.equal(403))
            }))

        })
        describe('delete', function () {
            it('should not let me delete the campaign', async(function () {
                var campaigns = await(request.get('/campaign'))
                var campaign = campaigns.body[0]
                var response = await(request.del('/campaign/' + campaign.id))
                return (expect(response.statusCode).to.equal(403) &&
                    expect(await(Campaign.find({ id: campaign.id })).length).to.equal(1))
            }))
        })
        describe('create', function () {
            it('should allow me to create a campaign', async(function () {
                var newCampaign = {
                    id: 1000,
                    requestedDate: new Date(),
                    keywords: ['Merge Industry and', 'Whatever', 'Else', 'Is', 'Added'],
                    user: user,
                    product: products[0],
                    paid: false,
                    company: 1,
                    visibility: 'company'
                }
                var response = await(request.post('/campaign').send(newCampaign))
                return (expect(response.statusCode).to.equal(201) &&
                    expect(await(Campaign.find({ id: 1000 })).length).to.equal(1))
            }))
        })
    })

    describe('associate users', function () {
        before(function () {
            request = require('supertest-as-promised').agent(sails.hooks.http.app);
            return request
                .post('/auth/local')
                .send({ identifier: 'associate@example.com', password: 'associate1234' })
        })

        describe('#getAll', function () {
            it('should return all campaigns', async(function () {
                var response = await(request.get('/campaign/all'))
                return (
                    expect(response.statusCode).to.equal(200) &&
                    expect(response.body.length).to.equal(4))
            }))

            it('should return all campaigns regardless of verb & nothing should be deleted', async(function () {
                var response = await(request.del('/campaign/all'))
                var data = await(Campaign.find({}))
                return (expect(response.body.length).to.equal(4) &&
                    expect(response.statusCode).to.equal(200) &&
                    expect(data.length).to.equal(4))
            }))
        })

        describe('post', function () {
            it('should modify the campaign supplied', async(function () {
                var campaigns = await(request.get('/campaign/all'))
                var campaign = campaigns.body[0]
                var response = await(request.put('/campaign/' + campaign.id)
                    .send({ paid: true, paymentID: '42 baker' }))
                var campaignDatabase = await(Campaign.findOne({ id: campaign.id }))
                return (expect(campaignDatabase.paid).to.equal(true) &&
                    expect(campaignDatabase.paymentID).to.equal('42 baker'))
            }))

            it('should not let me update my keywords', async(function () {
                var campaigns = await(request.get('/campaign/all'))
                var campaign = campaigns.body[0]
                var response = await(request.put('/campaign/' + campaign.id)
                    .send({ keywords: ['42', 'Grand', 'Fiber one'] }))
                var campaignDatabase = await(Campaign.findOne({ id: campaign.id }))
                return (expect(campaignDatabase.keywords).to.not.equal(['42', 'Grand', 'Fiber one']) &&
                    expect(response.statusCode).to.equal(403))
            }))

            it('should let me update the assigned associate', async(function () {
                var associate = await(User.findOne({ username: 'associate' }))
                var campaigns = await(request.get('/campaign/all'))
                var campaign = campaigns.body[0]
                var response = await(request.put('/campaign/' + campaign.id)
                    .send({ assignedUser: associate.id }))
                var campaignDatabase = await(Campaign.findOne({ id: campaign.id }).populate('assignedUser'))
                return (expect(campaignDatabase.assignedUser.username).to.deep.equal(associate.username) &&
                    expect(campaignDatabase.assignedUser.id).to.deep.equal(associate.id) &&
                    expect(response.statusCode).to.equal(200))
            }))

            it('should let me update the acceptedDate', async(function () {
                var date = new Date()
                var campaigns = await(request.get('/campaign/all'))
                var campaign = campaigns.body[0]
                var campaignDatabaseBefore = await(Campaign.findOne({ id: campaign.id }))
                var response = await(request.put('/campaign/' + campaign.id)
                    .send({ acceptedDate: date }))
                var campaignDatabaseAfter = await(Campaign.findOne({ id: campaign.id }))
                return (expect(campaignDatabaseAfter.acceptedDate).to.deep.equal(date) &&
                    expect(response.statusCode).to.equal(200))
            }))

            it('should not let me update the requestedDate', async(function () {
                var date = new Date()
                var campaigns = await(request.get('/campaign/all'))
                var campaign = campaigns.body[0]
                var campaignDatabaseBefore = await(Campaign.findOne({ id: campaign.id }))
                var response = await(request.put('/campaign/' + campaign.id)
                    .send({ requestedDate: date }))
                var campaignDatabaseAfter = await(Campaign.findOne({ id: campaign.id }))
                return (expect(campaignDatabaseAfter.requestedDate).to.not.deep.equal(date) &&
                    expect(campaignDatabaseAfter.requestedDate).to.deep.equal(campaignDatabaseBefore.requestedDate) &&
                    expect(response.statusCode).to.equal(403))
            }))

            it('should let me update the completedDate', async(function () {
                var date = new Date()
                var campaigns = await(request.get('/campaign/all'))
                var campaign = campaigns.body[0]
                var campaignDatabaseBefore = await(Campaign.findOne({ id: campaign.id }))
                var response = await(request.put('/campaign/' + campaign.id)
                    .send({ completedDate: date }))
                var campaignDatabaseAfter = await(Campaign.findOne({ id: campaign.id }))
                return (expect(campaignDatabaseAfter.completedDate).to.deep.equal(date) &&
                    expect(response.statusCode).to.equal(200))
            }))


            it('should not let me update the user', async(function () {
                var campaigns = await(request.get('/campaign/all'))
                var campaign = campaigns.body[0]
                var response = await(request.put('/campaign/' + campaign.id)
                    .send({ user: 42 }))
                var campaignAfter = await(Campaign.findOne({ id: 1 }))
                return (expect(campaignAfter.user).to.deep.equal(campaign.user) &&
                    expect(response.statusCode).to.eql(403))
            }))

            it('should not let me update the product', async(function () {
                var campaigns = await(request.get('/campaign/all'))
                var campaign = campaigns.body[0]
                var response = await(request.put('/campaign/' + campaign.id)
                    .send({ product: 88 }))
                var campaignAfter = await(Campaign.findOne({ id: 1 }))
                return (expect(campaignAfter.product).to.deep.equal(campaign.product) &&
                    expect(response.statusCode).to.equal(403))
            }))
        })
        describe('delete', function () {
            it('should let me delete the campaign', async(function () {
                var campaigns = await(request.get('/campaign/all'))
                var campaign = campaigns.body[0]
                var response = await(request.del('/campaign/' + campaign.id))
                return (expect(response.statusCode).to.equal(200) &&
                    expect(await(Campaign.find({ id: campaign.id })).length).to.equal(0))
            }))
        })
        describe('create', function () {
            it('should allow me to create a campaign', async(function () {
                var newCampaign = {
                    id: 1000,
                    requestedDate: new Date(),
                    keywords: ['Merge Industry and', 'Whatever', 'Else', 'Is', 'Added'],
                    user: user,
                    product: products[0],
                    paid: false,
                    company: 1,
                    visibility: 'company'
                }
                var response = await(request.post('/campaign').send(newCampaign))
                return (expect(response.statusCode).to.equal(201) &&
                    expect(await(Campaign.find({ id: 1000 })).length).to.equal(1))
            }))
        })
    })
    describe('admin users', function () {
        before(function () {
            request = require('supertest-as-promised').agent(sails.hooks.http.app);
            return request
                .post('/auth/local')
                .send({ identifier: 'admin@example.com', password: 'admin1234' })
        })

        describe('#getAll', function () {
            it('should return all campaigns', async(function () {
                var response = await(request.get('/campaign/all'))
                return (
                    expect(response.statusCode).to.equal(200) &&
                    expect(response.body.length).to.equal(4))
            }))

            it('should return all campaigns regardless of verb & nothing should be deleted', async(function () {
                var response = await(request.del('/campaign/all'))
                var data = await(Campaign.find({}))
                return (expect(response.body.length).to.equal(4) &&
                    expect(response.statusCode).to.equal(200) &&
                    expect(data.length).to.equal(4))
            }))
        })
    })
    describe('post', function () {
        it('should modify the campaign supplied', async(function () {
            var campaigns = await(request.get('/campaign/all'))
            var campaign = campaigns.body[0]
            var response = await(request.put('/campaign/' + campaign.id)
                .send({ paid: true, paymentID: '42 baker' }))
            var campaignDatabase = await(Campaign.findOne({ id: campaign.id }))
            return (expect(campaignDatabase.paid).to.equal(true) &&
                expect(campaignDatabase.paymentID).to.equal('42 baker'))
        }))

        it('should not let me update my keywords', async(function () {
            var campaigns = await(request.get('/campaign/all'))
            var campaign = campaigns.body[0]
            var response = await(request.put('/campaign/' + campaign.id)
                .send({ keywords: ['42', 'Grand', 'Fiber one'] }))
            var campaignDatabase = await(Campaign.findOne({ id: campaign.id }))
            return (expect(campaignDatabase.keywords).to.not.equal(['42', 'Grand', 'Fiber one']) &&
                expect(response.statusCode).to.equal(403))
        }))

        it('should let me update the assigned associate', async(function () {
            var associate = await(User.findOne({ username: 'associate' }))
            var campaigns = await(request.get('/campaign/all'))
            var campaign = campaigns.body[0]
            var response = await(request.put('/campaign/' + campaign.id)
                .send({ assignedUser: associate.id }))
            var campaignDatabase = await(Campaign.findOne({ id: campaign.id }).populate('assignedUser'))
            return (expect(campaignDatabase.assignedUser.username).to.deep.equal(associate.username) &&
                expect(campaignDatabase.assignedUser.id).to.deep.equal(associate.id) &&
                expect(response.statusCode).to.equal(200))
        }))

        it('should let me update the acceptedDate', async(function () {
            var date = new Date()
            var campaigns = await(request.get('/campaign/all'))
            var campaign = campaigns.body[0]
            var campaignDatabaseBefore = await(Campaign.findOne({ id: campaign.id }))
            var response = await(request.put('/campaign/' + campaign.id)
                .send({ acceptedDate: date }))
            var campaignDatabaseAfter = await(Campaign.findOne({ id: campaign.id }))
            return (expect(campaignDatabaseAfter.acceptedDate).to.deep.equal(date) &&
                expect(response.statusCode).to.equal(200))
        }))

        it('should not let me update the requestedDate', async(function () {
            var date = new Date()
            var campaigns = await(request.get('/campaign/all'))
            var campaign = campaigns.body[0]
            var campaignDatabaseBefore = await(Campaign.findOne({ id: campaign.id }))
            var response = await(request.put('/campaign/' + campaign.id)
                .send({ requestedDate: date }))
            var campaignDatabaseAfter = await(Campaign.findOne({ id: campaign.id }))
            return (expect(campaignDatabaseAfter.requestedDate).to.not.deep.equal(date) &&
                expect(campaignDatabaseAfter.requestedDate).to.deep.equal(campaignDatabaseBefore.requestedDate) &&
                expect(response.statusCode).to.equal(403))
        }))

        it('should let me update the completedDate', async(function () {
            var date = new Date()
            var campaigns = await(request.get('/campaign/all'))
            var campaign = campaigns.body[0]
            var campaignDatabaseBefore = await(Campaign.findOne({ id: campaign.id }))
            var response = await(request.put('/campaign/' + campaign.id)
                .send({ completedDate: date }))
            var campaignDatabaseAfter = await(Campaign.findOne({ id: campaign.id }))
            return (expect(campaignDatabaseAfter.completedDate).to.deep.equal(date) &&
                expect(response.statusCode).to.equal(200))
        }))


        it('should not let me update the user', async(function () {
            var campaigns = await(request.get('/campaign/all'))
            var campaign = campaigns.body[0]
            var response = await(request.put('/campaign/' + campaign.id)
                .send({ user: 42 }))
            var campaignAfter = await(Campaign.findOne({ id: 1 }))
            return (expect(campaignAfter.user).to.deep.equal(campaign.user) &&
                expect(response.statusCode).to.eql(403))
        }))

        it('should let me update the product', async(function () {
            var campaigns = await(request.get('/campaign/all'))
            var campaign = campaigns.body[0]
            var response = await(request.put('/campaign/' + campaign.id)
                .send({ product: 88 }))
            var campaignAfter = await(Campaign.findOne({ id: 1 }))
            return (expect(campaignAfter.product).to.equal(88) &&
                expect(response.statusCode).to.equal(200))
        }))
    })
    describe('delete', function () {
        it('should let me delete the campaign', async(function () {
            var campaigns = await(request.get('/campaign/all'))
            var campaign = campaigns.body[0]
            var response = await(request.del('/campaign/' + campaign.id))
            return (expect(response.statusCode).to.equal(200) &&
                expect(await(Campaign.find({ id: campaign.id })).length).to.equal(0))
        }))
    })
    describe('create', function () {
        it('should allow me to create a campaign', async(function () {
            var newCampaign = {
                id: 1000,
                requestedDate: new Date(),
                keywords: ['Merge Industry and', 'Whatever', 'Else', 'Is', 'Added'],
                user: user,
                product: products[0],
                paid: false,
                company: 1,
                visibility: 'user'
            }
            var response = await(request.post('/campaign').send(newCampaign))
            return (expect(response.statusCode).to.equal(201) &&
                expect(await(Campaign.find({ id: 1000 })).length).to.equal(1))
        }))
    })
});