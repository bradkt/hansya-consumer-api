var expect = require('chai').expect

var async = require('asyncawait/async')
var await = require('asyncawait/await')

var request

describe('UserController', function () {
    describe('newUser', function () {
        it('should create a new user under the registered role', async(function () {
            request = require('supertest-as-promised').agent(sails.hooks.http.app);
            var res = await(request
                .post('/user')
                .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'newuser' }))
            var user = await(User.findOne({ username: 'newuser' }).populate('role'))
            return (expect(user.role.name).to.equal('registered') &&
                expect(res.statusCode).to.equal(200))
        }))

        it('should not allow 2 users with the same username', async(function () {
            request = require('supertest-as-promised').agent(sails.hooks.http.app);
            await(request
                .post('/user')
                .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'newuser' }))
            var res = await(request
                .post('/user')
                .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'newuser' }))
            return (expect(res.statusCode).to.equal(400) &&
                expect(res.text).to.equal('Username or Email Address already in use'))
        }))

        it('should not allow 2 users with the same email address', async(function () {
            request = require('supertest-as-promised').agent(sails.hooks.http.app);
            await(request
                .post('/user')
                .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'newuser' }))
            var res = await(request
                .post('/user')
                .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'othernewuser' }))
            console.log(res)
            return (expect(res.statusCode).to.equal(400) &&
                expect(res.text).to.equal('Username or Email Address already in use'))
        }))

        after(async(function () {
            await(User.destroy({ username: 'newuser' }))
            await(User.destroy({ username: 'othernewuser' }))
        }))


    })
})