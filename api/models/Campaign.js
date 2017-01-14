var async = require('asyncawait/async')
var await = require('asyncawait/await')
var uuid = require('uuid/v4');
module.exports = {

  attributes: {
    id: {
      type: 'string',
      primaryKey: true,
      unique: true,
      defaultsTo: function () {
        return uuid()
      }
    },
    requestedDate: {
      type: 'datetime',
      required: true,
      index: true,
      defaultsTo: new Date()
    },
    acceptedDate: {
      type: 'datetime'
    },
    completedDate: {
      type: 'datetime'
    },
    keywords: {
      type: 'array',
      required: true
    },
    user: {
      model: 'user',
      required: true,
      index: true
    },
    assignedUser: {
      model: 'user'
    },
    product: {
      model: 'product',
      required: true
    },
    paid: {
      type: 'boolean',
      required: true
    },
    paymentID: { //this will be the authorize.net confirmation ID
      type: 'string'
    }
    // company: {
    //   model: 'company',
    //   required: false
    // },
    // visibility: {
    //   required: false,
    //   enum: ['user', 'company']
    // }
  }
};

