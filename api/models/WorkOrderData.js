/**
 * WorkOrderData.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    campaign: {
      model: 'campaign',
      required: true,
      index: true
    },
    data:{
      type: 'json',
      required: true
    }

  }
};

