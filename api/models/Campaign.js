var async = require('asyncawait/async')
var await = require('asyncawait/await')
var uuid = require('uuid/v4');
module.exports = {

  attributes: {
    id: {
      type: 'string',
      primaryKey: true,
      unique: true,
      defaultsTo: async(function () {
        uuid = uuid();
        while (await(Campaign.findOne({id: uuid}))) {
          uuid = uuid();
        }
        return uuid
      })
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
    },
    company: {
      model: 'company',
      required: true
    },
    visibility: {
      required: true,
      enum: ['user', 'company']
    }
  }
};

