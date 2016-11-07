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

    describe('hasRole', function(){
        it('should return true when a role matches', async(function(){
            var user = await(User.findOne({ username: 'associate'}))
            var hasRole = await(UserService.hasRole(user.id, 'associate'))
            return expect(hasRole).to.equal(true)
        }))

        it('should return false when a role does not match', async(function(){
            var user = await(User.findOne({ username: 'associate'}))
            var hasRole = await(UserService.hasRole(user.id, 'admin'))
            return expect(hasRole).to.equal(false)
        }))

        it('should return true when one role matches and one does not', async(function(){
            var user = await(User.findOne({ username: 'associate'}))
            var hasRole = await(UserService.hasRole(user.id, ['admin','associate']))
            return expect(hasRole).to.equal(true)
        }))
    })
})