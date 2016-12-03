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
    name:{
      type: 'string',
      required: true
    }
  }
};

