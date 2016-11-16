var expect = require('chai').expect

var async = require('asyncawait/async')
var await = require('asyncawait/await')

var request

describe('ProductController', function () {
    beforeEach(async(function () {
        await(Product.destroy({}))
        await(Product.create({
            name: 'Small',
            datapoints: parseInt('100'),
            description: '100 Datapoints does not get you a lot. Consider upgrading',
            price: parseInt('2999')
        }))
        await(Product.create({
            name: 'Medium',
            datapoints: parseInt('1000'),
            description: '1000 Datapoints should get you information over the last fiew days.  YMMV',
            price: parseInt('7999')
        }))
    }))
    describe('registeredUsers', function () {
        before(async(function () {
            request = require('supertest-as-promised').agent(sails.hooks.http.app);
            await(request
                .post('/auth/local')
                .send({ identifier: 'registered@example.com', password: 'registered1234' }))
        }))
        describe('get', function () {
            it('should return all the produccts', async(function () {
                var response = await(request.get('/product'))
                return (expect(response.statusCode).to.equal(200) &&
                    expect(response.body.length).to.equal(2) &&
                    expect(response.body[0].name).to.equal('Small') &&
                    expect(response.body[0].description).to.equal('100 Datapoints does not get you a lot. Consider upgrading'))
            }))
        })
        describe('POST', function () {
            it('should not let me add a new product', async(function () {
                var response = await(request.post('/product').send({
                    name: 'large',
                    datapoints: parseInt('10000'),
                    description: '10000 Datapoints WOW!',
                    price: parseInt('17999')
                }))
                return (expect(response.statusCode).to.equal(403) &&
                    expect(await(Product.findOne({ name: 'large' }))).to.equal(undefined))
            }))
        })

    })
    describe('associateUsers', function () {
        before(async(function () {
            request = require('supertest-as-promised').agent(sails.hooks.http.app);
            await(request
                .post('/auth/local')
                .send({ identifier: 'associate@example.com', password: 'associate1234' }))
        }))
        describe('get', function () {
            it('should return all the produccts', async(function () {
                var response = await(request.get('/product'))
                return (expect(response.statusCode).to.equal(200) &&
                    expect(response.body.length).to.equal(2) &&
                    expect(response.body[0].name).to.equal('Small') &&
                    expect(response.body[0].description).to.equal('100 Datapoints does not get you a lot. Consider upgrading'))
            }))
        })
        describe('POST', function () {
            it('should not let me add a new product', async(function () {
                var response = await(request.post('/product').send({
                    name: 'large',
                    datapoints: parseInt('10000'),
                    description: '10000 Datapoints WOW!',
                    price: parseInt('17999')
                }))
                return (expect(response.statusCode).to.equal(403) &&
                    expect(await(Product.findOne({ name: 'large' }))).to.equal(undefined))
            }))
        })
    })
    describe('adminUsers', function () {
        before(async(function () {
            request = require('supertest-as-promised').agent(sails.hooks.http.app);
            await(request
                .post('/auth/local')
                .send({ identifier: 'admin@example.com', password: 'admin1234' }))
        }))
        describe('get', function () {
            it('should return all the produccts', async(function () {
                var response = await(request.get('/product'))
                return (expect(response.statusCode).to.equal(200) &&
                    expect(response.body.length).to.equal(2) &&
                    expect(response.body[0].name).to.equal('Small') &&
                    expect(response.body[0].description).to.equal('100 Datapoints does not get you a lot. Consider upgrading'))
            }))
        })
        describe('POST', function () {
            it('should not let me add a new product', async(function () {
                var response = await(request.post('/product').send({
                    name: 'large',
                    datapoints: parseInt('10000'),
                    description: '10000 Datapoints WOW!',
                    price: parseInt('17999')
                }))
                return (expect(response.statusCode).to.equal(201) &&
                    expect(await(Product.find({ name: 'large' })).length).to.equal(1))
            }))
        })
    })
})