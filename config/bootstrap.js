/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

var Promise = require('bluebird');

var userController = require('../api/controllers/UserController')

module.exports.bootstrap = function (done) {

  // Don't populate fake data when running in production
  if (process.env.NODE_ENV === 'production') {
    return done();
  }

  var industries = [
    {
      name: 'Software Development',
      keywords: ['Cloud', 'Docker', 'Continuous Deployment']
    },
    {
      name: 'Industrial',
      keywords: ['Steel', 'Manufacturing', 'Metal Working']
    }
  ]

  var products = [{
    name: 'Small',
    datapoints: parseInt('100'),
    description: '100 Datapoints does not get you a lot. Consider upgrading',
    price: parseInt('2999')
  }, {
      name: 'Medium',
      datapoints: parseInt('1000'),
      description: '1000 Datapoints should get you information over the last fiew days.  YMMV',
      price: parseInt('7999')
    }, {
      name: 'Large',
      datapoints: parseInt('5000'),
      description: '5000 Datapoints should get you information over the last few weeks.  YMMV',
      price: parseInt('14999')
    }, {
      name: 'X-Large',
      datapoints: parseInt('10000'),
      description: '10000 Datapoints should get you information over the last month.  YMMV',
      price: parseInt('24999')
    }, {
      name: 'XX-Large',
      datapoints: parseInt('100000'),
      description: '100000 Datapoints should get you information over the last year.  YMMV',
      price: parseInt('49999')
    }, {
      name: 'custom',
      datapoints: parseInt('0'),
      description: 'use if you need more then 100,000 data points',
      price: parseInt('-1')
    }]

  var users = [
    {
      email: 'registered@example.com',
      username: 'registered',
      password: 'registered1234'
    },
    {
      email: 'registered2@example.com',
      username: 'registered2',
      password: 'registered21234'
    },
    {
      email: 'associate@example.com',
      username: 'associate',
      password: 'associate1234'
    },
    {
      email: 'admin@example.com',
      username: 'admin',
      password: 'admin1234'
    }
    ]

  ok = Promise.resolve();

  ok = ok.then(function () {
    return Role.create({ name: 'registered' })
  })

  ok = ok.then(function () {
    return Role.create({ name: 'associate' })
  })

  ok = ok.then(function () {
    return Role.create({ name: 'admin' })
  })

  ok = ok.then(function () {
    return Promise.map(users, function (user) {
      return User.register(user)
    });
  })

  ok = ok.then(function(){
    return User.findOne({username: 'associate'})
    .then(function(user){
      return UserService.assignRole(user.id, 'associate')
    });
  })

  // ok = ok.then(function () {
  //   return PermissionService.createRole({
  //     name: 'associate',
  //     permissions: [{
  //       action: 'read',
  //       model: 'workOrder'
  //     },
  //       {
  //         action: 'update',
  //         model: 'workOrder'
  //       }],
  //     users: ['associate']
  //   })
  // });

  ok = ok.then(function () {
    return Promise.map(products, function (product) {
      return Product.create(product)
    });
  })

  ok = ok.then(function () {
    return Promise.map(industries, function (industry) {
      return Industry.create(industry)
    }, { concurrency: 1 })
  })

  // ok = ok.then(function () {
  //   return User.find({ username: 'registered' }).exec(function (err, user) {
  //     Product.find({}).exec(function (error, product) {
  //       Campaign.create({
  //         id: 1,
  //         requestedDate: new Date(),
  //         keywords: ['Merge Industry and', 'Whatever', 'Else', 'Is', 'Added'],
  //         user: user[0],
  //         product: product[0],
  //         paid: true,
  //         paymentID: 'abcd12'
  //       }).exec(function (err, workorder) {
  //         console.log(err)
  //         workOrderData.forEach(function (dataPoint) {
  //           WorkOrderData.create({
  //             campaign: workorder,
  //             data: dataPoint
  //           }).exec(function (err) {
  //             err ? console.log(err) : null
  //           })
  //         })
  //       })
  //     })
  //   });
  // })

  // ok = ok.then(function () {
  //   return User.find({ username: 'registered' }).exec(function (err, user) {
  //     Product.find({}).exec(function (error, product) {
  //       Campaign.create({
  //         id: 2,
  //         requestedDate: new Date(),
  //         keywords: ['OTHER', 'Merge Industry and', 'Whatever', 'Else', 'Is', 'Added'],
  //         user: user[0],
  //         product: product[0],
  //         paid: false
  //       }).exec(function (err, workorder) {
  //         console.log(err)
  //         workOrderData.forEach(function (dataPoint) {
  //           WorkOrderData.create({
  //             campaign: workorder,
  //             data: dataPoint
  //           }).exec(function (err) {
  //             err ? console.log(err) : null
  //           })
  //         })
  //       })
  //     })
  //   });
  // })

  // ok = ok.then(function () {
  //   return User.find({ username: 'registered2' }).exec(function (err, user) {
  //     Product.find({}).exec(function (error, product) {
  //       Campaign.create({
  //         id: 3,
  //         requestedDate: new Date(),
  //         keywords: ['OTHER', 'Merge Industry and', 'Whatever', 'Else', 'Is', 'Added'],
  //         user: user[0],
  //         product: product[0],
  //         paid: false
  //       }).exec(function (err, workorder) {
  //         console.log(err)
  //         workOrderData.forEach(function (dataPoint) {
  //           WorkOrderData.create({
  //             campaign: workorder,
  //             data: dataPoint
  //           }).exec(function (err) {
  //             err ? console.log(err) : null
  //           })
  //         })
  //       })
  //     })
  //   });
  // })

  ////////////////////////////////////////////////////////////////////////////////////////
  //permissions
  ////////////////////////////////////////////////////////////////////////////////////////

  // ok = ok.then(function () {
  //   return PermissionService.grant({
  //     role: 'registered',
  //     model: 'workorder',
  //     action: 'update',
  //     criteria: { blacklist: ['keywords', 'assignedUser', 'acceptedDate', 'requestedDate', 'completedDate', 'user', 'product'] }
  //   })
  // })

  // ok = ok.then(function () {
  //   return PermissionService.grant({
  //     role: 'registered',
  //     model: 'workorder',
  //     action: 'read',
  //     criteria: { 
  //       blacklist: ['paymentID'] }
  //   })
  // })

  ok.then(function () {
    done();
  })


  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
};
