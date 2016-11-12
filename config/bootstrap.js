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
    }]

  var workOrderData = [
    {
      "dev": "ios",
      "dt": "2016-03-29 22:04:56",
      "loc": "Addison, TX",
      "r_data": "Thanks @chipotletweets for the free meal. #dinnertime @ Chipotle https://www.instagram.com/p/BDj0xBXJO2M/",
      "s_name": "DJ Counts",
      "tid": "714996802353758208",
      "u_name": "1maclassicman"
    },
    {
      "dev": "ios",
      "dt": "2016-06-10 21:14:46",
      "loc": "Aiken, SC",
      "r_data": "Celebrating @skatparker getting a job the best way we know how: Chipotle. So proud of how\u2026 https://www.instagram.com/p/BGftDbvhTCg/\u00a0",
      "s_name": "Jarrett Parker",
      "tid": "741438490576072704",
      "u_name": "jarrettp_"
    },
    {
      "dev": "ios",
      "dt": "2016-05-15 15:20:36",
      "loc": "Anaheim, CA",
      "r_data": "The douchebag parking award of day goes to... #fail @ Chipotle Mexican Grill https://www.instagram.com/p/BFcH2izrWil/",
      "s_name": "Michael Quiles",
      "tid": "731927280310591488",
      "u_name": "Mike12329"
    },
    {
      "dev": "ios",
      "dt": "2016-02-26 01:46:59",
      "loc": "Anaheim, CA",
      "r_data": "When I realize I'm hungry after recording all day but Chipotle is closed. #hangryface\u2026 https://www.instagram.com/p/BCPWz5EyCzl/",
      "s_name": "Steve Channell",
      "tid": "703108983385554944",
      "u_name": "SteveChannell"
    },
    {
      "dev": "ios",
      "dt": "2016-02-08 16:25:33",
      "loc": "Anaheim, CA",
      "r_data": "I love my wonderful friends :) #chipotle #freeburrito #quicktellsteve @chipotletweets #burrito\u2026 https://www.instagram.com/p/BBilCuBSC1X/",
      "s_name": "Steve Channell",
      "tid": "696807099687264256",
      "u_name": "SteveChannell"
    },
    {
      "dev": "ios",
      "dt": "2016-01-07 15:54:12",
      "loc": "Apple Valley, CA",
      "r_data": "Think for yourself???????? @chipotletweets #chipotle #weightloss #weightwatchers #weightlosssupport\u2026 https://www.instagram.com/p/BAQIBDjRK52/",
      "s_name": "Mshealthycanbegood",
      "tid": "685202799865556993",
      "u_name": "Mshealthycanbgd"
    },
    {
      "dev": "ios",
      "dt": "2016-04-13 19:11:43",
      "loc": "Arcadia, CA",
      "r_data": "My burrito @ Chipotle Mexican Grill https://www.instagram.com/p/BEKI3hknuGrRoW9NdHS62YT_TTwKwd3i0-OZ380/\u00a0\u2026",
      "s_name": "Jonathan Ippolito",
      "tid": "720389030802796544",
      "u_name": "JonathanIppoli1"
    },
    {
      "dev": "ios",
      "dt": "2016-04-13 19:10:57",
      "loc": "Arcadia, CA",
      "r_data": "Large Root-beer . @ Chipotle Mexican Grill https://www.instagram.com/p/BEKIx0_nuGikRzUU7YKTVMbAX-AH2690jKOx0s0/\u00a0\u2026",
      "s_name": "Jonathan Ippolito",
      "tid": "720388835142692864",
      "u_name": "JonathanIppoli1"
    }]

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

  ok = ok.then(function () {
    return User.find({ username: 'registered' }).exec(function (err, user) {
      Product.find({}).exec(function (error, product) {
        Campaign.create({
          id: 1,
          requestedDate: new Date(),
          keywords: ['Merge Industry and', 'Whatever', 'Else', 'Is', 'Added'],
          user: user[0],
          product: product[0],
          paid: true,
          paymentID: 'abcd12'
        }).exec(function (err, workorder) {
          console.log(err)
          workOrderData.forEach(function (dataPoint) {
            WorkOrderData.create({
              workOrder: workorder,
              data: dataPoint
            }).exec(function (err) {
              err ? console.log(err) : null
            })
          })
        })
      })
    });
  })

  ok = ok.then(function () {
    return User.find({ username: 'registered' }).exec(function (err, user) {
      Product.find({}).exec(function (error, product) {
        Campaign.create({
          id: 2,
          requestedDate: new Date(),
          keywords: ['OTHER', 'Merge Industry and', 'Whatever', 'Else', 'Is', 'Added'],
          user: user[0],
          product: product[0],
          paid: false
        }).exec(function (err, workorder) {
          console.log(err)
          workOrderData.forEach(function (dataPoint) {
            WorkOrderData.create({
              workOrder: workorder,
              data: dataPoint
            }).exec(function (err) {
              err ? console.log(err) : null
            })
          })
        })
      })
    });
  })

  ok = ok.then(function () {
    return User.find({ username: 'registered2' }).exec(function (err, user) {
      Product.find({}).exec(function (error, product) {
        Campaign.create({
          id: 3,
          requestedDate: new Date(),
          keywords: ['OTHER', 'Merge Industry and', 'Whatever', 'Else', 'Is', 'Added'],
          user: user[0],
          product: product[0],
          paid: false
        }).exec(function (err, workorder) {
          console.log(err)
          workOrderData.forEach(function (dataPoint) {
            WorkOrderData.create({
              workOrder: workorder,
              data: dataPoint
            }).exec(function (err) {
              err ? console.log(err) : null
            })
          })
        })
      })
    });
  })

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
