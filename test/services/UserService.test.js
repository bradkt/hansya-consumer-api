var expect = require('chai').expect

var async = require('asyncawait/async')
var await = require('asyncawait/await')

describe('UserService', function () {
    describe('roles', function () {

        it('should return all roles for a given userID', async(function () {
            var user = await(User.findOne({ username: 'associate' }))
            var roles = await (UserService.roles(user.id))
            return expect(roles).to.deep.equal(['registered', 'associate'])
        }))
    })
})