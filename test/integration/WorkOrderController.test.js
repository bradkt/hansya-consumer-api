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

                
                // return request
                //     .get('/workOrder')
                //     .expect(200)
                //     .then(function (res) {
                //         return expect(res.body.length).to.equal(2)
                //     })
            }))

            it('should return a single workorder for the registered user', function () {
                return request
                    .get('/workOrder')
                    .expect(200)
                    .then(function (res) {
                        var wo = res.body[0]
                        return request
                            .get('/workOrder/' + wo.id)
                            .then(function (workOrder) {
                                return expect(workOrder.body).to.deep.equal(wo)
                            })
                    })
            })

            it('should not let me return a workorder for another user', function () {
                return request
                    .get('/workOrder/3')
                    .expect(404)
                    .then(function (workOrder) {
                        return expect(workOrder.body).to.deep.equal({})
                    })
            })

            it('should not return the paymentID to the registered user', function () {
                return request
                    .get('/workOrder/1')
                    .expect(200)
                    .then(function (res) {
                        return expect(res.body.paymentID).to.equal(undefined)
                    })
            })

            it('should not let me get all workorders', function(){
                return request
                    .get('/workOrder/all')
                    .expect(403)
            })
        })

        describe('#put()', function () {
            it('should modify the work order supplied', function () {
                return request
                    .get('/workOrder')
                    .expect(200)
                    .then(function (res) {
                        var workOrder = res.body[0]
                        return request
                            .put('/workOrder/' + workOrder.id)
                            .send({ paid: true, paymentID: '42 baker' })
                            .expect(200)
                            .then(function (res) {
                                return WorkOrder.find({ id: workOrder.id })
                                    .then(function (wo) {
                                        return (expect(wo[0].paid).to.equal(true) && expect(wo[0].paymentID).to.equal('42 baker'))
                                    })
                            })
                    })
            })

            it('should not let me update my keywords', function () {
                return request
                    .get('/workOrder')
                    .expect(200)
                    .then(function (res) {
                        var workOrder = res.body[0]
                        return request
                            .put('/workOrder/' + workOrder.id)
                            .send({ keywords: ['42', 'Grand', 'Fiber one'] })
                            .expect(403)
                            .then(function (res) {
                                return WorkOrder.find({ id: workOrder.id })
                                    .then(function (wo) {
                                        return expect(wo[0].keywords).to.not.equal(['42', 'Grand', 'Fiber one'])
                                    })
                            })
                    })
            })

            it('should not let me update the assigned associate', function () {
                return request
                    .get('/workOrder')
                    .expect(200)
                    .then(function (res) {
                        var workOrder = res.body[0]
                        return request
                            .put('/workOrder/' + workOrder.id)
                            .send({ assignedUser: 'Donald Duck' })
                            .expect(403)
                            .then(function (res) {
                                return WorkOrder.find({ id: workOrder.id })
                                    .then(function (wo) {
                                        return expect(wo[0].assignedUser).to.not.equal('Donald Duck')
                                    })
                            })
                    })
            })

            it('should not let me update the acceptedDate', function () {
                return WorkOrder.find({ id: 1 }).then(function (wkOrders) {
                    workOrder = wkOrders[0]
                    var date = new Date()
                    return request
                        .put('/workOrder/' + workOrder.id)
                        .send({ acceptedDate: date })
                        .expect(403)
                        .then(function (res) {
                            return WorkOrder.find({ id: workOrder.id })
                                .then(function (wo) {
                                    return expect(wo[0].acceptedDate).to.deep.equal(workOrder.acceptedDate)
                                })
                        })
                })
            })

            it('should not let me update the requestedDate', function () {
                return WorkOrder.find({ id: 1 }).then(function (wkOrders) {
                    workOrder = wkOrders[0]
                    var date = new Date()
                    return request
                        .put('/workOrder/' + workOrder.id)
                        .send({ requestedDate: date })
                        .expect(403)
                        .then(function (res) {
                            return WorkOrder.find({ id: workOrder.id })
                                .then(function (wo) {
                                    return expect(wo[0].requestedDate).to.deep.equal(workOrder.requestedDate)
                                })
                        })
                })
            })

            it('should not let me update the completedDate', function () {
                return WorkOrder.find({ id: 1 }).then(function (wkOrders) {
                    workOrder = wkOrders[0]
                    var date = new Date()
                    return request
                        .put('/workOrder/' + workOrder.id)
                        .send({ completedDate: date })
                        .expect(403)
                        .then(function (res) {
                            return WorkOrder.find({ id: workOrder.id })
                                .then(function (wo) {
                                    return expect(wo[0].completedDate).to.deep.equal(workOrder.completedDate)
                                })
                        })
                })
            })


            it('should not let me update the user', function () {
                return WorkOrder.find({ id: 1 }).then(function (wkOrders) {
                    workOrder = wkOrders[0]
                    return request
                        .put('/workOrder/' + workOrder.id)
                        .send({ user: 42 })
                        .expect(403)
                        .then(function (res) {
                            return WorkOrder.find({ id: workOrder.id })
                                .then(function (wo) {
                                    return expect(wo[0].user).to.deep.equal(workOrder.user)
                                })
                        })
                })
            })

            it('should not let me update the product', function () {
                return WorkOrder.find({ id: 1 }).then(function (wkOrders) {
                    workOrder = wkOrders[0]
                    return request
                        .put('/workOrder/' + workOrder.id)
                        .send({ product: 88 })
                        .expect(403)
                        .then(function (res) {
                            return WorkOrder.find({ id: workOrder.id })
                                .then(function (wo) {
                                    return expect(wo[0].product).to.deep.equal(workOrder.product)
                                })
                        })
                })
            })


        })
    })
});