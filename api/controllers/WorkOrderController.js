/**
 * WorkOrderController
 *
 * @description :: Server-side logic for managing Workorders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    find: function (req, res) {
        WorkOrder.find({ user: req.user.id }).then(function (results) {
            res.send(results)
        })
    },

    findOne: function (req, res) {
        WorkOrder.find({ user: req.user.id, id: req.params.id }).then(function (results) {
            if (_.isEmpty(results)){
                res.notFound()
            }
            else{
                res.send(results[0])
            }
        })
    }
};

