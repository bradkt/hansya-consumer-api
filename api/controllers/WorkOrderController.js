/**
 * WorkOrderController
 *
 * @description :: Server-side logic for managing Workorders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = {
    find: async(function (req, res) {
        var workOrders = await(WorkOrder.find({ user: req.user.id }))
        res.send(workOrders)
    }),

    findOne: async(function (req, res) {
        var workOrder = await(WorkOrder.findOne({ user: req.user.id, id: req.params.id }))
        if (!workOrder){
            res.notFound()
        }
        else{
            res.send(workOrder)
        }
    }),

    all: async(function(req, res){
        var allowed = await(UserService.hasRole(req.user.id, 'admin'))
        if(!allowed){
            res.forbidden()
        }
        WorkOrder.find({}).then(function(results){
            res.send(results);
        })
    })
};

