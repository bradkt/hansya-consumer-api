var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = {

    role: async(function (userID) {
        var userRoles = []
        var user = await(User.findOne({ id: userID }).populate('role'))
        return user.role.name
    }),

    hasRole: async(function (userID, roleName) {
        var hasRole = false
        var userRole = await(this.role(userID))
        return userRole == roleName
    }),

    assignRole: async(function (userID, roleName) {
        var user = await(User.findOne({ id: userID }))
        var role = await(Role.findOne({ name: roleName }))
        user.role = role
        return await(user.save())
    })
};
