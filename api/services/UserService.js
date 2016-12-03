var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = {

    role: async(function (userID) {
        try {
            var userRoles = []
            var user = await(User.findOne({ id: userID }).populate('role'))
            return user.role.name
        }
        catch (e){
            return null
        }
    }),

    hasRole: async(function (userID, roleName) {
        try {
            var hasRole = false
            var userRole = await(this.role(userID))
            return userRole == roleName
        }
        catch (e){
            return false
        }
    }),

    assignRole: async(function (userID, roleName) {
        var user = await(User.findOne({ id: userID }))
        var role = await(Role.findOne({ name: roleName }))
        user.role = role
        return await(user.save())
    })
};
