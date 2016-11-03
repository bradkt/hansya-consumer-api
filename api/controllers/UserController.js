var _ = require('lodash');
var _super = require('../../node_modules/sails-auth/api/controllers/UserController.js');

_.merge(exports, _super);
_.merge(exports, {

  // Extend with custom logic here by adding additional fields, methods, etc.

  find: function(req, res, next) {
      res.ok(req.user);
  }

});
