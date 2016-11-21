var _ = require('lodash');
var _super = require('../../node_modules/sails-auth/api/models/User.js');

var async = require('asyncawait/async')
var await = require('asyncawait/await')

_.merge(exports, _super);
_.merge(exports, {
    attributes: {
        role: {
            model: 'role'
        },
        company: {
            model: 'company'
        }
    },

    afterCreate: function setRole(user, next){
        User.findOne(user.id)
        .populate('role')
        .then(function(_user){
            user = _user;
            return Role.findOne({name: 'registered'})
        })
        .then(function(role){
            user.role = role.id
            return user.save()
        })
        .then(function(usr){
            next();
        })
        
        
        // var role = await(Role.findOne({name: 'registered'}))
        // console.log(role.Prototype)
        // values.role = role
        // next();
    } 
})