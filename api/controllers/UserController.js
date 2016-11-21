var async = require('asyncawait/async')
var await = require('asyncawait/await')

var _ = require('lodash');
var _super = require('../../node_modules/sails-auth/api/controllers/UserController.js');

_.merge(exports, _super);
_.merge(exports, {

  // Extend with custom logic here by adding additional fields, methods, etc.

  find: function (req, res, next) {
    res.ok(req.user);
  },

  create: async(function (req, res, next) {
    var email = req.allParams().identifier
    var username = req.allParams().username

    var user = await(User.find().where({ or: [{ username: username }, { identifier: email }] }))
    if (user.length > 0) {
      res.badRequest('Username or Email Address already in use')
    }
    else {
      sails.services.passport.protocols.local.register(req.body, function (err, user) {
        if (err) return res.negotiate(err);

        res.created(user);
      });
    }
  }),

  all: async(function(req, res, next){
    var users = await(User.find({}).populate('role'))
    res.ok(users)
  })

});
