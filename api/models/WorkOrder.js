/**
 * WorkOrder.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    requestedDate: {
      type: 'datetime',
      required: true,
      index: true
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
    assignedUser:{
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
  }
};

