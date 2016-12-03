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
        await(Campaign.create({
            id: 'asdfasdf',
            requestedDate: new Date(),
            keywords: ['Merge Industry and', 'Whatever', 'Else', 'Is', 'Added'],
            user: user,
            product: products[0],
            paid: true,
            paymentID: 'abcd12',
            company: 1,
            visibility: 'user'
        }))
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
    })
})