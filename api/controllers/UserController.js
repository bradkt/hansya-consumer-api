var uuid = require('uuid/v4');
var async = require('asyncawait/async')
var await = require('asyncawait/await')

var _ = require('lodash');
var _super = require('../../node_modules/sails-auth/api/controllers/UserController.js');

_.merge(exports, _super);
_.merge(exports, {

  // Extend with custom logic here by adding additional fields, methods, etc.

  find: async(function (req, res, next) {
    if (req.session.passport) {
      var user = await(User.findOne({ id: req.session.passport.user }).populate('role'))
      res.ok(user);
    }
    else{
      res.forbidden()
    }
  }),

  create: async(function (req, res, next) {
    var email = req.param('email')
    var username = req.param('username')

    var user = await(User.find().where({ or: [{ username: username }, { email: email }] }))
    if (user.length > 0) {
      res.badRequest('Username or Email Address already in use')
    }
    else {
      var user = await(User.register(req.allParams()))
      res.created(user)
    }
  }),

  all: async(function (req, res, next) {
    var users = await(User.find({}).populate('role'))
    res.ok(users)
  }),

  changeRole: async(function (req, res) {
    var user = await(UserService.assignRole(req.param('userID'), req.param('role')))
    res.send(user)
  }),

  forgotPassword: async(function (req, res) {
    var user = await(User.findOne({ email: req.param('email') }))
    if (!user) {
      res.ok()
    }
    else {
      var temp_code = uuid();
      var code_exp = new Date(new Date().getTime() + (30 * 60 * 1000)) //minutes * seconds(60) * ms (1000)
      console.log(code_exp)
      user.temporary_code = temp_code
      user.temporary_code_exp = code_exp
      await(user.save())
      await(EmailService.sendEmail('hansyaTest@gmail.com', _user.email, 'Forgot Password Link', `<h1> Forgot Password </h1><h3> <a href="http://localhost:1337/user/resetPasswordLink/${temp_code}">Click Here to reset your password</a></h3> <p>Your unlock code will be valid for 30 minutes.</p>`))
      res.ok();
    }
  }),

  resetPasswordLink: async(function (req, res) {
    var user = await(User.findOne({ email: req.param('email'), temporary_code: req.param('code') }))
    if (!user || user.temporary_code_exp == undefined || user.temporary_code_exp == null) { //user not found or temporary code not active
      res.badRequest();
    }
    else {
      var exp_date = new Date(user.temporary_code_exp).getTime();
      var now = new Date().getTime();
      if (exp_date < now) {
        console.log(`${user.email} attempted to reset their password with an expired code`)
        res.badRequest();
      }
      else {
        passport = await(Passport.findOne({ user: user.id }))
        passport.password = req.param('password')
        await(passport.save())
        user.temporary_code = null
        user.temporary_code_exp = null
        await(user.save())
        res.ok();
      }
    }

  })

});
