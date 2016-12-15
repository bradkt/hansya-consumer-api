var async = require('asyncawait/async')
var await = require('asyncawait/await')

var _ = require('lodash');
var _super = require('../../node_modules/sails-auth/api/controllers/UserController.js');

_.merge(exports, _super);
_.merge(exports, {

  // Extend with custom logic here by adding additional fields, methods, etc.

  find: async(function (req, res, next) {
    var user = await(User.findOne({id: req.user.id}).populate('role'))
    res.ok(user);
  }),

  create: async(function (req, res, next) {
    var email = req.allParams().identifier
    var username = req.allParams().username

    var user = await(User.find().where({ or: [{ username: username }, { identifier: email }] }))
    if (user.length > 0) {
      res.badRequest('Username or Email Address already in use')
    }
    else {
      var user = await(User.register(req.allParams()))
      res.created(user)
    }
  }),

  all: async(function(req, res, next){
    var users = await(User.find({}).populate('role'))
    res.ok(users)
  }),

  changeRole: async(function(req, res){
    var user = await(UserService.assignRole(req.param('userID'), req.param('role')))
    res.send(user)    
  })

});
