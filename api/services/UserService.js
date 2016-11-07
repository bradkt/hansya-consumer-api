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
    })

    /**
     * @param req
     */
    //   buildCallbackNextUrl: function (req) {
    //     var url = req.query.next;
    //     var includeToken = req.query.includeToken;
    //     var accessToken = _.get(req, 'session.tokens.accessToken');

    //     if (includeToken && accessToken) {
    //       return url + '?access_token=' + accessToken;
    //     }
    //     else {
    //       return url;
    //     }
    //   }
};
