var expect = require('chai').expect

var async = require('asyncawait/async')
var await = require('asyncawait/await')

describe('UserService', function () {
    describe('role', function () {

        it('should return the role for a given userID', async(function () {
            var user = await(User.findOne({ username: 'associate' }))
            var role = await(UserService.role(user.id))
            return expect(role).to.equal('associate')
        }))

        it('should assign a role to a user', async(function () {
            var user = await(User.findOne({ username: 'registered' }))
            var role = await(Role.findOne({ name: 'associate' }))
            await(UserService.assignRole(user.id, role.name))
            var afterUser = await(User.findOne({ id: user.id }))
            return expect(afterUser.role).to.equal(role.id)
        }))

        it('should assign a role back to a user', async(function () {
            var user = await(User.findOne({ username: 'registered' }))
            var role = await(Role.findOne({ name: 'registered' }))
            await(UserService.assignRole(user.id, role.name))
            var afterUser = await(User.findOne({ id: user.id }))
            return expect(afterUser.role).to.equal(role.id)
        }))
    })

    describe('hasRole', function () {
        it('should return true when a role matches', async(function () {
            var user = await(User.findOne({ username: 'associate' }))
            var hasRole = await(UserService.hasRole(user.id, 'associate'))
            return expect(hasRole).to.equal(true)
        }))

        it('should return false when a role does not match', async(function () {
            var user = await(User.findOne({ username: 'associate' }))
            var hasRole = await(UserService.hasRole(user.id, 'admin'))
            return expect(hasRole).to.equal(false)
        }))
    })
})