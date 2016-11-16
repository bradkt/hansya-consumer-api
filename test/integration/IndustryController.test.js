var expect = require('chai').expect

var async = require('asyncawait/async')
var await = require('asyncawait/await')

var request

describe('IndustryController', function () {
    beforeEach(async(function () {
        await(Industry.destroy({}))
        await(Industry.create({
            name: 'Software Development',
            keywords: ['Cloud', 'Docker', 'Continuous Deployment']
        }))
        await(Industry.create({
            name: 'Industrial',
            keywords: ['Steel', 'Manufacturing', 'Metal Working']
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
            it('should return all the industries', async(function () {
                var response = await(request.get('/industry'))
                return (expect(response.statusCode).to.equal(200) &&
                    expect(response.body.length).to.equal(2) &&
                    expect(response.body[0].name).to.equal('Software Development') &&
                    expect(response.body[0].keywords).to.deep.equal(['Cloud', 'Docker', 'Continuous Deployment']))
            }))
            it('should not let me add a new industry', async(function () {
                var response = await(request.post('/industry').send({ name: 'coffee', keywords: ['dunkin', 'starbucks', 'panara'] }))
                return (expect(response.statusCode).to.equal(403) &&
                    expect(await(Industry.findOne({ name: 'coffee' }))).to.equal(undefined))
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
            it('should return all the industries', async(function () {
                var response = await(request.get('/industry'))
                return (expect(response.statusCode).to.equal(200) &&
                    expect(response.body.length).to.equal(2) &&
                    expect(response.body[0].name).to.equal('Software Development') &&
                    expect(response.body[0].keywords).to.deep.equal(['Cloud', 'Docker', 'Continuous Deployment']))
            }))
            it('should not let me add a new industry', async(function () {
                var response = await(request.post('/industry').send({ name: 'coffee', keywords: ['dunkin', 'starbucks', 'panara'] }))
                return (expect(response.statusCode).to.equal(403) &&
                    expect(await(Industry.findOne({ name: 'coffee' }))).to.equal(undefined))
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
            it('should return all the industries', async(function () {
                var response = await(request.get('/industry'))
                return (expect(response.statusCode).to.equal(200) &&
                    expect(response.body.length).to.equal(2) &&
                    expect(response.body[0].name).to.equal('Software Development') &&
                    expect(response.body[0].keywords).to.deep.equal(['Cloud', 'Docker', 'Continuous Deployment']))
            }))
            it('should let me add a new industry', async(function () {
                var response = await(request.post('/industry').send({ name: 'coffee', keywords: ['dunkin', 'starbucks', 'panara'] }))
                return (expect(response.statusCode).to.equal(201) &&
                    expect(await(Industry.find({ name: 'coffee' })).length).to.equal(1))
            }))
        })
    })
})