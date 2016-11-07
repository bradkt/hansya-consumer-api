var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = {

    roles: async(function (userID) {
        var userRoles = []
        var user = await(User.findOne({ id: userID }).populate('roles'))
        user.roles.forEach(function (role) {
            role.active ? userRoles.push(role.name) : null
        })
        return userRoles
    }),

    hasRole: async(function(userID, roleNames){
        var hasRole = false
        var userRoles = await(this.roles(userID))
        if (!Array.isArray(roleNames)){
            roleNames = [roleNames]
        }
        roleNames.forEach(function(role){
            if (userRoles.indexOf(role) > -1){
                hasRole = true // user has an authorized role
                return //stop at the first appropriate role
            } 
        })
        //no user roles satisified role requirement
        return hasRole
    })
};
