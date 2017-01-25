var expect = require('chai').expect

var async = require('asyncawait/async')
var await = require('asyncawait/await')

var stripe = require('stripe')('pk_test_XxAEu7EUD1EXhOa10G2FTj2v')

var request

describe('PaymentController', function () {
    beforeEach(async(function () {
        var user = await(User.findOne({ username: 'registered' }))
        var otherUser = await(User.findOne({ username: 'registered2' }))
        var products = await(Product.find({}))
        await(Campaign.create({
            id: 1,
            requestedDate: new Date(),
            keywords: ['Merge Industry and', 'Whatever', 'Else', 'Is', 'Added'],
            user: user.id,
            product: products[0],
            paid: false
        }))
        return await(Campaign.create({
            id: 2,
            requestedDate: new Date(),
            keywords: ['Merge Industry and', 'Whatever', 'Else', 'Is', 'Added'],
            user: otherUser,
            product: products[0],
            paid: false
        }))
    }))
    afterEach(async(function () {
        return await(Campaign.destroy({}))
    }))
    describe('makePayment', function () {
        it('should not allow a logged in user to make a payment', async(function () {
            request = require('supertest-as-promised').agent(sails.hooks.http.app);
            var res = await(request.post('/payment/makePayment')
                .send({ campaignID: 1, token: '42' }))
            return expect(res.statusCode).to.equal(403)
        }))
        it('should not allow a registered user to make a payment for a campaign that is not theirs', async(function () {
            request = require('supertest-as-promised').agent(sails.hooks.http.app);
            await(request.post('/auth/local')
                .send({ identifier: 'registered@example.com', password: 'registered1234' }))
            var res = await(request.post('/payment/makePayment')
                .send({ campaignID: 2, token: '42' }))
            return expect(res.statusCode).to.equal(403)
        }))
        it('should not allow someone to make a payment on a campaign that is already paid for', async(function () {
            var campaign = await(Campaign.findOne({ id: 1 }))
            campaign.paid = true
            await(campaign.save())
            await(request.post('/auth/local')
                .send({ identifier: 'registered@example.com', password: 'registered1234' }))
            var res = await(request.post('/payment/makePayment')
                .send({ campaignID: 1, token: '42' }))
            return expect(res.statusCode).to.equal(400)

        }))
    })
    describe('successful payments', function () {
        var oneUseToken = ''
        var exp_year = new Date().getFullYear() + 1 //sometime next year
        beforeEach(async(function () {
            oneUseToken = await(stripe.tokens.create({
                card: {
                    number: '4242424242424242',
                    exp_month: 1,
                    exp_year: exp_year,
                    cvc: 114
                }
            }))
        }))
        it('should allow a registered user to make a payment for a campaign they own', async(function () {
            request = require('supertest-as-promised').agent(sails.hooks.http.app);
            await(request.post('/auth/local')
                .send({ identifier: 'registered@example.com', password: 'registered1234' }))
            var res = await(request.post('/payment/makePayment')
                .send({ campaignID: 1, token: oneUseToken }))
            var campaign = await(Campaign.findOne({ id: 1 }))
            return (expect(res.statusCode).to.equal(200) &&
                expect(res.body).to.deep.equal({
                    status: 'succeeded',
                    card: '4242',
                    amount: 2999
                }) &&
                expect(campaign.paid).to.equal(true) &&
                expect(campaign.paymentID).to.not.equal(null) &&
                expect(campaign.paymentID).to.not.be.undefined)
        }))
        it('should allow associates to make a payment for anyone', async(function () {
            request = require('supertest-as-promised').agent(sails.hooks.http.app);
            await(request.post('/auth/local')
                .send({ identifier: 'associate@example.com', password: 'associate1234' }))
            var res = await(request.post('/payment/makePayment')
                .send({ campaignID: 1, token: oneUseToken }))
            return (expect(res.statusCode).to.equal(200) &&
                expect(res.body).to.deep.equal({
                    status: 'succeeded',
                    card: '4242',
                    amount: 2999
                }))
        }))
        it('should allow admins to make a payment for anyone', async(function () {
            request = require('supertest-as-promised').agent(sails.hooks.http.app);
            await(request.post('/auth/local')
                .send({ identifier: 'admin@example.com', password: 'admin1234' }))
            var res = await(request.post('/payment/makePayment')
                .send({ campaignID: 1, token: oneUseToken }))
            return (expect(res.statusCode).to.equal(200) &&
                expect(res.body).to.deep.equal({
                    status: 'succeeded',
                    card: '4242',
                    amount: 2999
                }))
        }))
    })
    describe('declined', function () {
        var oneUseToken = ''
        var exp_year = new Date().getFullYear() + 1 //sometime next year
        beforeEach(async(function () {
            oneUseToken = await(stripe.tokens.create({
                card: {
                    number: '4000000000000002',
                    exp_month: 1,
                    exp_year: exp_year,
                    cvc: 114
                }
            }))
            request = require('supertest-as-promised').agent(sails.hooks.http.app);
            await(request.post('/auth/local')
                .send({ identifier: 'registered@example.com', password: 'registered1234' }))
        }))
        it('should throw a declined message', async(function () {
            var res = await(request.post('/payment/makePayment')
                .send({ campaignID: 1, token: oneUseToken }))
            var campaign = await(Campaign.findOne({ id: 1 }))
            console.log(res.body)
            return (expect(res.statusCode).to.equal(400) &&
                expect(res.body).to.deep.equal({
                    status: 'error',
                    message: 'Your card was declined.'
                }) &&
                expect(campaign.paid).to.equal(false) &&
                expect(campaign.paymentID).to.be.undefined)
        }))
    })
})