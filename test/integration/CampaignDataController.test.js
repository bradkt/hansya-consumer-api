var expect = require('chai').expect

var async = require('asyncawait/async')
var await = require('asyncawait/await')

var request

describe('CampaignDataController', function () {

    beforeEach(async(function () {
        await(Poster.destroy({}))
        await(Message.destroy({}))
        await(Campaign.destroy({}))
        await(Conversation.destroy({}))
        var user = await(User.findOne({ username: 'registered' }))
        var products = await(Product.find({}))
        var ret = await(Campaign.create({
            id: 'asdfasdf',
            requestedDate: new Date(),
            keywords: ['Merge Industry and', 'Whatever', 'Else', 'Is', 'Added'],
            user: user.id,
            product: products[0],
            paid: true,
            paymentID: 'abcd12',
            company: user.company,
            visibility: 'user'
        }))
        return ret
    }))

    describe('AssociateUsers', function () {
        before(function () {
            request = require('supertest-as-promised').agent(sails.hooks.http.app);
            return request
                .post('/auth/local')
                .send({ identifier: 'associate@example.com', password: 'associate1234' })
        })

        describe('#upload()', function () {
            it('should store the data from the file', async(function () {
                var res = await(request.post('/campaignData/upload')
                    .attach('data', 'test/files/data-demo.json'))
                var messages = await(Message.find({}))
                var posters = await(Poster.find({}))
                var conversations = await(Conversation.find({}))
                return (expect(res.statusCode).to.equal(200) &&
                    expect(messages.length).to.equal(26) &&
                    expect(posters.length).to.equal(21) &&
                    expect(conversations.length).to.equal(9)
                )
            }))
        })

        describe('all', function () {
            it('should return all information for the campaign', async(function () {
                await(request.post('/campaignData/upload') // this will fail if the first test fails
                    .attach('data', 'test/files/data-demo.json'))
                var res = await(request.get('/campaignData/all/asdfasdf'))
                return (expect(res.body.messages.length).to.equal(26) &&
                    expect(res.body.conversations.length).to.equal(9) &&
                    expect(res.body.posters.length).to.equal(20))
            }))
        })

        describe('locationSummary', function () {
            it('should return the location summary for all messages in the campaign', async(function () {
                await(request.post('/campaignData/upload') // this will fail if the first test fails
                    .attach('data', 'test/files/data-demo.json'))
                var res = await(request.get('/campaignData/locationSummary/asdfasdf'))
                return (expect(res.statusCode).to.equal(200) &&
                    expect(res.body.sort(function (a, b) { return a['_id'].localeCompare(b['_id']) })).to.deep.equal(
                        [{ _id: 'Addison, TX', count: 3 },
                            { _id: 'Aiken, SC', count: 1 },
                            { _id: 'Arlington, VA', count: 1 },
                            { _id: 'Ashwaubenon, WI', count: 2 },
                            { _id: 'Athens, OH', count: 1 },
                            { _id: 'Atlanta, GA', count: 9 },
                            { _id: 'Atlantic City, NJ', count: 2 },
                            { _id: 'Austin, TX', count: 1 },
                            { _id: 'Baltimore, MD', count: 3 },
                            { _id: 'Barboursville, WV', count: 2 },
                            { _id: 'Bedford, NH', count: 1 }]
                    ))
            }))
        })

        describe('totalLikes', function () {
            it('should return the total number of likes for a campaign', async(function () {
                await(request.post('/campaignData/upload') // this will fail if the first test fails
                    .attach('data', 'test/files/data-demo.json'))
                var res = await(request.get('/campaignData/totalLikes/asdfasdf'))
                return (expect(res.statusCode).to.equal(200) &&
                    expect(res.body).to.deep.equal({ likes: 4606 }))
            }))
        })
        describe('totalShares', function () {
            it('should return the total number of shares for a campaign', async(function () {
                await(request.post('/campaignData/upload') // this will fail if the first test fails
                    .attach('data', 'test/files/data-demo.json'))
                var res = await(request.get('/campaignData/totalShares/asdfasdf'))
                return (expect(res.statusCode).to.equal(200) &&
                    expect(res.body).to.deep.equal({ shares: 5485 }))
            }))
        })
        describe('engagement', function () {
            it('should return the total number of shares for a campaign', async(function () {
                await(request.post('/campaignData/upload') // this will fail if the first test fails
                    .attach('data', 'test/files/data-demo.json'))
                var res = await(request.get('/campaignData/engagement/asdfasdf'))
                return (expect(res.statusCode).to.equal(200) &&
                    expect(res.body).to.deep.equal({
                        "averageEngagementRate": 30.192307692307693,
                        "averageEngagements": 386.9230769230769,
                        "maximumEngagementRate": 52,
                        "maximumEngagements": 3219,
                        "minimumEngagementRate": 18,
                        "minimumEngagements": 39,
                        "totalEngagements": 10060
                    }))
            }))
        })
    })
    describe('RegisteredUsers', function () {
        beforeEach(async(function () {
            request = require('supertest-as-promised').agent(sails.hooks.http.app);
            return await(request
                .post('/auth/local')
                .send({ identifier: 'registered@example.com', password: 'registered1234' }))
        }))

        describe('#upload()', function () {
            it('should reject the data file ', async(function () {
                var res = await(request.post('/campaignData/upload')
                    .attach('data', 'test/files/data-demo.json'))
                var messages = await(Message.find({}))
                var posters = await(Poster.find({}))
                var conversations = await(Conversation.find({}))
                return (expect(res.statusCode).to.equal(403) &&
                    expect(messages.length).to.equal(0) &&
                    expect(posters.length).to.equal(0) &&
                    expect(conversations.length).to.equal(0)
                )
            }))
        })
        describe('all', function () {
            beforeEach(async(function () {
                request2 = require('supertest-as-promised').agent(sails.hooks.http.app);
                await(request2
                    .post('/auth/local')
                    .send({ identifier: 'associate@example.com', password: 'associate1234' }))
                var res = await(request2.post('/campaignData/upload') // this will fail if the first test fails
                    .attach('data', 'test/files/data-demo.json'))
                return true
            }))
            it('should return all information for the campaign', async(function () {
                var res = await(request.get('/campaignData/all/asdfasdf'))
                return (expect(res.statusCode).to.equal(200) &&
                    expect(res.body.messages.length).to.equal(26) &&
                    expect(res.body.conversations.length).to.equal(9) &&
                    expect(res.body.posters.length).to.equal(20))
            }))

        })

        describe('locationSummary', function () {
            beforeEach(async(function () {
                request2 = require('supertest-as-promised').agent(sails.hooks.http.app);
                await(request2
                    .post('/auth/local')
                    .send({ identifier: 'associate@example.com', password: 'associate1234' }))
                var res = await(request2.post('/campaignData/upload') // this will fail if the first test fails
                    .attach('data', 'test/files/data-demo.json'))
                return true
            }))
            it('should return the location summary for all messages in the campaign', async(function () {
                var res = await(request.get('/campaignData/locationSummary/asdfasdf'))
                return (expect(res.statusCode).to.equal(200) &&
                    expect(res.body.sort(function (a, b) { return a['_id'].localeCompare(b['_id']) })).to.deep.equal(
                        [{ _id: 'Addison, TX', count: 3 },
                            { _id: 'Aiken, SC', count: 1 },
                            { _id: 'Arlington, VA', count: 1 },
                            { _id: 'Ashwaubenon, WI', count: 2 },
                            { _id: 'Athens, OH', count: 1 },
                            { _id: 'Atlanta, GA', count: 9 },
                            { _id: 'Atlantic City, NJ', count: 2 },
                            { _id: 'Austin, TX', count: 1 },
                            { _id: 'Baltimore, MD', count: 3 },
                            { _id: 'Barboursville, WV', count: 2 },
                            { _id: 'Bedford, NH', count: 1 }]
                    ))
            }))
        })
        describe('totalLikes', function () {
            beforeEach(async(function () {
                request2 = require('supertest-as-promised').agent(sails.hooks.http.app);
                await(request2
                    .post('/auth/local')
                    .send({ identifier: 'associate@example.com', password: 'associate1234' }))
                var res = await(request2.post('/campaignData/upload') // this will fail if the first test fails
                    .attach('data', 'test/files/data-demo.json'))
                return true
            }))
            it('should return the total number of likes for a campaign', async(function () {
                var res = await(request.get('/campaignData/totalLikes/asdfasdf'))
                return (expect(res.statusCode).to.equal(200) &&
                    expect(res.body).to.deep.equal({ likes: 4606 }))
            }))
        })
        describe('totalShares', function () {
            beforeEach(async(function () {
                request2 = require('supertest-as-promised').agent(sails.hooks.http.app);
                await(request2
                    .post('/auth/local')
                    .send({ identifier: 'associate@example.com', password: 'associate1234' }))
                var res = await(request2.post('/campaignData/upload') // this will fail if the first test fails
                    .attach('data', 'test/files/data-demo.json'))
                return true
            }))
            it('should return the total number of shares for a campaign', async(function () {
                var res = await(request.get('/campaignData/totalShares/asdfasdf'))
                return (expect(res.statusCode).to.equal(200) &&
                    expect(res.body).to.deep.equal({ shares: 5485 }))
            }))
        })
        describe('engagement', function () {
            beforeEach(async(function () {
                request2 = require('supertest-as-promised').agent(sails.hooks.http.app);
                await(request2
                    .post('/auth/local')
                    .send({ identifier: 'associate@example.com', password: 'associate1234' }))
                var res = await(request2.post('/campaignData/upload') // this will fail if the first test fails
                    .attach('data', 'test/files/data-demo.json'))
                return true
            }))
            it('should return the total number of shares for a campaign', async(function () {
                var res = await(request.get('/campaignData/engagement/asdfasdf'))
                return (expect(res.statusCode).to.equal(200) &&
                    expect(res.body).to.deep.equal({
                        "averageEngagementRate": 30.192307692307693,
                        "averageEngagements": 386.9230769230769,
                        "maximumEngagementRate": 52,
                        "maximumEngagements": 3219,
                        "minimumEngagementRate": 18,
                        "minimumEngagements": 39,
                        "totalEngagements": 10060
                    }))
            }))
        })
    })
    describe('AdminUsers', function () {
        before(function () {
            request = require('supertest-as-promised').agent(sails.hooks.http.app);
            return request
                .post('/auth/local')
                .send({ identifier: 'admin@example.com', password: 'admin1234' })
        })

        describe('#upload()', function () {
            it('should store the data from the file', async(function () {
                var res = await(request.post('/campaignData/upload')
                    .attach('data', 'test/files/data-demo.json'))
                var messages = await(Message.find({}))
                var posters = await(Poster.find({}))
                var conversations = await(Conversation.find({}))
                return (expect(res.statusCode).to.equal(200) &&
                    expect(messages.length).to.equal(26) &&
                    expect(posters.length).to.equal(21) &&
                    expect(conversations.length).to.equal(9)
                )
            }))
        })

        describe('#get', function () {
            it('should return 404', async(function () { //if this starts failing, the config in CampaignDataController is set wrong.  should be set to{actions: true,shortcuts: false,rest: false}
                var res = await(request.get('/campaignData'))
                return expect(res.statusCode).to.equal(404)
            }))
        })
        describe('all', function () {
            it('should return all information for the campaign', async(function () {
                await(request.post('/campaignData/upload') // this will fail if the first test fails
                    .attach('data', 'test/files/data-demo.json'))
                var res = await(request.get('/campaignData/all/asdfasdf'))
                return (expect(res.body.messages.length).to.equal(26) &&
                    expect(res.body.conversations.length).to.equal(9) &&
                    expect(res.body.posters.length).to.equal(20))
            }))
        })
        describe('locationSummary', function () {
            it('should return the location summary for all messages in the campaign', async(function () {
                await(request.post('/campaignData/upload') // this will fail if the first test fails
                    .attach('data', 'test/files/data-demo.json'))
                var res = await(request.get('/campaignData/locationSummary/asdfasdf'))
                return (expect(res.statusCode).to.equal(200) &&
                    expect(res.body.sort(function (a, b) { return a['_id'].localeCompare(b['_id']) })).to.deep.equal(
                        [{ _id: 'Addison, TX', count: 3 },
                            { _id: 'Aiken, SC', count: 1 },
                            { _id: 'Arlington, VA', count: 1 },
                            { _id: 'Ashwaubenon, WI', count: 2 },
                            { _id: 'Athens, OH', count: 1 },
                            { _id: 'Atlanta, GA', count: 9 },
                            { _id: 'Atlantic City, NJ', count: 2 },
                            { _id: 'Austin, TX', count: 1 },
                            { _id: 'Baltimore, MD', count: 3 },
                            { _id: 'Barboursville, WV', count: 2 },
                            { _id: 'Bedford, NH', count: 1 }]))
            }))
        })
        describe('totalLikes', function () {
            it('should return the total number of likes for a campaign', async(function () {
                await(request.post('/campaignData/upload') // this will fail if the first test fails
                    .attach('data', 'test/files/data-demo.json'))
                var res = await(request.get('/campaignData/totalLikes/asdfasdf'))
                return (expect(res.statusCode).to.equal(200) &&
                    expect(res.body).to.deep.equal({ likes: 4606 }))
            }))
        })

        describe('totalShares', function () {
            it('should return the total number of shares for a campaign', async(function () {
                await(request.post('/campaignData/upload') // this will fail if the first test fails
                    .attach('data', 'test/files/data-demo.json'))
                var res = await(request.get('/campaignData/totalShares/asdfasdf'))
                return (expect(res.statusCode).to.equal(200) &&
                    expect(res.body).to.deep.equal({ shares: 5485 }))
            }))
        })
        describe('engagement', function () {
            it('should return the total number of shares for a campaign', async(function () {
                await(request.post('/campaignData/upload') // this will fail if the first test fails
                    .attach('data', 'test/files/data-demo.json'))
                var res = await(request.get('/campaignData/engagement/asdfasdf'))
                return (expect(res.statusCode).to.equal(200) &&
                    expect(res.body).to.deep.equal({
                        "averageEngagementRate": 30.192307692307693,
                        "averageEngagements": 386.9230769230769,
                        "maximumEngagementRate": 52,
                        "maximumEngagements": 3219,
                        "minimumEngagementRate": 18,
                        "minimumEngagements": 39,
                        "totalEngagements": 10060
                    }))
            }))
        })
    })
})