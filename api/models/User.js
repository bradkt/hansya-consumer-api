var _ = require('lodash');
var _super = require('../../node_modules/sails-auth/api/models/User.js');

var uuid = require('uuid/v4');
var async = require('asyncawait/async')
var await = require('asyncawait/await')

_.merge(exports, _super);
_.merge(exports, {
    attributes: {
        id: {
            type: 'string',
            primaryKey: true,
            unique: true,
            defaultsTo: function () {
                return uuid()
            }
        },
        role: {
            model: 'role'
        },
        company: {
            model: 'company',
            required: false,
        }
    },

    afterCreate: async(function (user, next) {
        //Add registered role to user
        _user = await(User.findOne(user.id).populate('role'))
        role = await(Role.findOne({ name: 'registered' }))
        _user.role = role.id
        await(_user.save())
        ////////////////////////////////////////////////////////
        //send email to user
        if (sails.environment === 'production' || sails.environment == 'testing'){
            await(EmailService.sendEmail('hansyaTest@gmail.com', _user.email, 'Thank You from Hansya', '<h1> Thank you for registering</h1>'))
        }
        next();
    })
})