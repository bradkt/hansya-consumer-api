var expect = require('chai').expect

var async = require('asyncawait/async')
var await = require('asyncawait/await')

var request

describe('WorkOrderController', function () {

    describe('RegisteredUsers', function () {
        before(function () {
            request = require('supertest-as-promised').agent(sails.hooks.http.app);
            return request
                .post('/auth/local')
                .send({ identifier: 'registered@example.com', password: 'registered1234' })
        })

        describe('#get()', function () {
            it('should return all the work orders for the registered user', async(function () {
               var res = await(request.get('/workOrder'))
               return (expect(res.body.length).to.equal(2) && 
                       expect(res.statusCode).to.equal(200)) 

            }))

            it('should return a single workorder for the registered user', async(function () {
                var wos = await(request.get('/workOrder'))
                var wo = wos.body[0]
                var response = await(request.get('/workOrder/' + wo.id))
                return (expect(response.body).to.deep.equal(wo) &&
                        expect(response.statusCode).to.equal(200))
            }))

            it('should not let me return a workorder for another user', async(function () {
                var response = await(request.get('/workOrder/3'))
                return (expect(response.body).to.deep.equal({}) &&
                        expect(response.statusCode).to.equal(404))
            }))

            it('should not return the paymentID to the registered user', async( function () {
                var response = await(request.get('/workOrder/1'))
                return expect(response.body.paymentID).to.equal(undefined)
            }))

            it('should not let me get all workorders', async(function(){
                var response = await(request.get('/workOrder/all'))
                return expect(response.statusCode).to.equal(403)
            }))
        })

        describe('#put()', function () {
            it('should modify the work order supplied', async(function () {
                var workOrders = await(request.get('/workOrder'))
                var workOrder = workOrders.body[0]
                var response = await(request.put('/workOrder/' + workOrder.id)
                                            .send({paid: true, paymentID: '42 baker'}))
                var workOrderDatabase = await(WorkOrder.findOne({id: workOrder.id}))
                return (expect(workOrderDatabase.paid).to.equal(true) &&
                        expect(workOrderDatabase.paymentID).to.equal('42 baker'))
            }))

            it('should not let me update my keywords', async(function () {
                var workorders = await(request.get('/workOrder'))
                var workOrder = workorders.body[0]
                var response = await(request.put('/workOrder/' + workOrder.id)
                                            .send({ keywords: ['42', 'Grand', 'Fiber one'] }))
                var workOrderDatabase = await(WorkOrder.findOne({ id: workOrder.id }))
                return (expect(workOrderDatabase.keywords).to.not.equal(['42', 'Grand', 'Fiber one']) &&
                        expect(response.statusCode).to.equal(403))
            }))

            it('should not let me update the assigned associate', async(function () {
                var workorders = await(request.get('/workOrder'))
                var workOrder = workorders.body[0]
                var response = await(request.put('/workOrder/' + workOrder.id)
                                            .send({ assignedUser: 'Donald Duck' }))
                var workOrderDatabase = await(WorkOrder.findOne({ id: workOrder.id }))
                return (expect(workOrderDatabase.assignedUser).to.not.deep.equal('Donald Duck') &&
                        expect(response.statusCode).to.equal(403))
            }))

            it('should not let me update the acceptedDate', async(function () {
                               var date = new Date()
                var workorders = await(request.get('/workOrder'))
                var workOrder = workorders.body[0]
                var workOrderDatabaseBefore = await(WorkOrder.findOne({ id: workOrder.id }))
                var response = await(request.put('/workOrder/' + workOrder.id)
                                            .send({ acceptedDate: date }))
                var workOrderDatabaseAfter = await(WorkOrder.findOne({ id: workOrder.id }))
                return (expect(workOrderDatabaseAfter.acceptedDate).to.not.deep.equal(date) &&
                        expect(workOrderDatabaseAfter.acceptedDate).to.deep.equal(workOrderDatabaseBefore.acceptedDate) &&
                        expect(response.statusCode).to.equal(403))
            }))

            it('should not let me update the requestedDate', async(function () {
                                var date = new Date()
                var workorders = await(request.get('/workOrder'))
                var workOrder = workorders.body[0]
                var workOrderDatabaseBefore = await(WorkOrder.findOne({ id: workOrder.id }))
                var response = await(request.put('/workOrder/' + workOrder.id)
                                            .send({ requestedDate: date }))
                var workOrderDatabaseAfter = await(WorkOrder.findOne({ id: workOrder.id }))
                return (expect(workOrderDatabaseAfter.requestedDate).to.not.deep.equal(date) &&
                        expect(workOrderDatabaseAfter.requestedDate).to.deep.equal(workOrderDatabaseBefore.requestedDate) &&
                        expect(response.statusCode).to.equal(403))
            }))

            it('should not let me update the completedDate', async(function () {
                                 var date = new Date()
                var workorders = await(request.get('/workOrder'))
                var workOrder = workorders.body[0]
                var workOrderDatabaseBefore = await(WorkOrder.findOne({ id: workOrder.id }))
                var response = await(request.put('/workOrder/' + workOrder.id)
                                            .send({ completedDate: date }))
                var workOrderDatabaseAfter = await(WorkOrder.findOne({ id: workOrder.id }))
                return (expect(workOrderDatabaseAfter.completedDate).to.not.deep.equal(date) &&
                        expect(workOrderDatabaseAfter.completedDate).to.deep.equal(workOrderDatabaseBefore.completedDate) &&
                        expect(response.statusCode).to.equal(403))
            }))


            it('should not let me update the user', async(function () {
                var workorders = await(request.get('/workOrder'))
                var workOrder = workorders.body[0]
                var response = await(request.put('/workOrder/' + workOrder.id)
                                            .send({user: 42}))
                var workOrderAfter = await(WorkOrder.findOne({id: 1}))
                return (expect(workOrderAfter.user).to.deep.equal(workOrder.user) &&
                        expect(response.statusCode).to.eql(403))
            }))

            it('should not let me update the product', async(function () {
                var workorders = await(request.get('/workOrder'))
                var workOrder = workorders.body[0]
                var response = await(request.put('/workOrder/' + workOrder.id)
                                            .send({product: 88}))
                var workorderAfter = await(WorkOrder.findOne({ id: 1 }))                                            
                return (expect(workorderAfter.product).to.deep.equal(workOrder.product) &&
                        expect(response.statusCode).to.equal(403))
            }))

        })
    })
});