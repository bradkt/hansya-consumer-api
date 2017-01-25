var expect = require('chai').expect

var async = require('asyncawait/async')
var await = require('asyncawait/await')

var request

describe('UserController', function () {
    afterEach(async(function () {
        await(User.destroy({ username: 'newuser' }))
        await(User.destroy({ username: 'othernewuser' }))
    }))
    describe('logout', function () {
        before(async(function () {
            request = require('supertest-as-promised').agent(sails.hooks.http.app);
            return await(request
                .post('/auth/local')
                .send({ identifier: 'registered@example.com', password: 'registered1234' }))
        }))
        it('should log a user out', async(function () {
            var user = await(User.findOne({ username: 'registered' }).populate('role'))
            loggedIn = await(request.get('/user'))
            await(request.get('/logout'))
            loggedOut = await(request.get('/user'))
            return (expect(loggedIn.body.id).to.equal(user.id) &&
                    expect(loggedOut.statusCode).to.equal(403))
        }))
    })
    describe('forgotPassword', function () {
        var request
        before(async(function () {
            request = require('supertest-as-promised').agent(sails.hooks.http.app);
        }))
        it('should assign a temporary code to the user and set the expiration date ', async(function () {
            var user = await(User.findOne({ username: 'registered' }).populate('role'))
            await(request.post('/user/forgotPassword').send({ email: user.email }))
            var user = await(User.findOne({ username: 'registered' }).populate('role'))
            return (expect(user.temporary_code).to.not.be.undefined &&
                expect(user.temporary_code_exp).to.not.be.undefined)
        }))
    })
    describe('resetPasswordLink', function () {
        var request
        before(async(function () {
            request = require('supertest-as-promised').agent(sails.hooks.http.app);
        }))
        beforeEach(async(function () {
            var user = await(User.findOne({ username: 'registered' }).populate('role'))
            await(request.post('/user/forgotPassword').send({ email: user.email }))
        }))
        afterEach(async(function () {
            var user = await(User.findOne({ username: 'registered' }).populate('role'))
            passport = await(Passport.findOne({ user: user.id }))
            passport.password = 'registered1234'
            await(passport.save())
        }))
        it('should return bad request if the email address and code do not match, and not update the password', async(function () { //this is so a user can't determine a valid email address
            var user = await(User.findOne({ username: 'registered' }).populate('role'))
            var passReset = await(request.post('/user/resetPasswordLink').send({ email: user.email, code: '42', password: 'newPassword1' }))
            var res = (await(request.post('/auth/local').send({ identifier: 'registered@example.com', password: 'registered1234' })))
            var res2 = (await(request.post('/auth/local').send({ identifier: 'registered@example.com', password: 'newPassword1' })))
            return (expect(res.statusCode).to.equal(200) &&
                expect(res2.statusCode).to.equal(403) &&
                expect(passReset.statusCode).to.equal(400))
        }))
        it('should return bad request if the code has expired', async(function () {
            var user = await(User.findOne({ username: 'registered' }).populate('role'))
            user.temporary_code_exp = new Date(new Date().getTime() - (30 * 60 * 1000)) //expired 30 minutes ago
            await(user.save())
            var passReset = await(request.post('/user/resetPasswordLink').send({ email: user.email, code: user.temporary_code, password: 'newPassword1' }))
            var res = (await(request.post('/auth/local').send({ identifier: 'registered@example.com', password: 'registered1234' })))
            var res2 = (await(request.post('/auth/local').send({ identifier: 'registered@example.com', password: 'newPassword1' })))
            return (expect(res.statusCode).to.equal(200) &&
                expect(res2.statusCode).to.equal(403) &&
                expect(passReset.statusCode).to.equal(400))
        }))
        it('should update the password if the correct email, code, and a new password are sent', async(function () {
            var user = await(User.findOne({ username: 'registered' }).populate('role'))
            var passReset = await(request.post('/user/resetPasswordLink').send({ email: user.email, code: user.temporary_code, password: 'newPassword1' }))
            var user = await(User.findOne({ username: 'registered' }).populate('role'))
            var res = (await(request.post('/auth/local').send({ identifier: 'registered@example.com', password: 'registered1234' })))
            var res2 = (await(request.post('/auth/local').send({ identifier: 'registered@example.com', password: 'newPassword1' })))
            return (expect(passReset.statusCode).to.equal(200) &&
                expect(res.statusCode).to.equal(403) &&
                expect(res2.statusCode).to.equal(200) &&
                expect(user.temporary_code).to.equal(null) &&
                expect(user.temporary_code_exp).to.equal(null))
        }))
    })
    describe('registered', function () {
        var request
        before(async(function () {
            request = require('supertest-as-promised').agent(sails.hooks.http.app);
            await(request
                .post('/auth/local')
                .send({ identifier: 'registered@example.com', password: 'registered1234' }))
        }))

        describe('get', function () {
            it('should only return my user information', async(function () {
                var user = await(User.findOne({ username: 'registered' }).populate('role'))
                var response = await(request.get('/user'))
                return (expect(response.statusCode).to.equal(200) &&
                    expect(response.body.username).to.deep.equal(user.username) &&
                    expect(response.body.role.id).to.equal(user.role.id) &&
                    expect(response.body.id).to.deep.equal(user.id))
            }))
        })
        describe('get/all', function () {
            it('should not return all users', async(function () {
                var response = await(request.get('/user/all'))
                return (expect(response.statusCode).to.equal(403))
            }))
        })
        describe('post', function () {
            it('should not let me create a new user when logged in', async(function () {
                var res = await(request
                    .post('/user')
                    .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'newuser', company: 'Target' }))
                return expect(res.statusCode).to.equal(403)
            }))
        })
        describe('register', function () {
            it('should not let me create a new user when logged in', async(function () {
                var res = await(request
                    .post('/register')
                    .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'newuser', company: 'Target' }))
                return expect(res.statusCode).to.equal(403)
            }))
        })

        describe('put', function () {
            beforeEach(async(function () {
                request2 = require('supertest-as-promised').agent(sails.hooks.http.app);
                var res = await(request2
                    .post('/register')
                    .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'newuser', company: 'Target' }))
            }))
            afterEach(async(function () {
                await(User.destroy({ username: 'newuser' }))
                await(User.destroy({ username: 'not allowed' }))
            }))
            it('should not allow me to update anything about anyone', async(function () {
                var user = await(User.findOne({ username: 'newuser' }))
                var res = await(request.put('/user/' + user.id).send({ username: 'not allowed' }))
                var noUser = await(User.findOne({ username: 'not allowed' }))
                return (expect(res.statusCode).to.equal(403) &&
                    expect(noUser).to.eql(undefined))
            }))
        })

        describe('delete', function () {
            beforeEach(async(function () {
                request2 = require('supertest-as-promised').agent(sails.hooks.http.app);
                var res = await(request2
                    .post('/register')
                    .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'newuser', company: 'Target' }))
            }))
            afterEach(async(function () {
                await(User.destroy({ username: 'newuser' }))
                await(User.destroy({ username: 'not allowed' }))
            }))
            it('should not allow me to delete anyone', async(function () {
                var user = await(User.findOne({ username: 'newuser' }))
                var res = await(request.del('/user/' + user.id).send({ username: 'not allowed' }))
                var noUser = await(User.findOne({ username: 'not allowed' }))
                return (expect(res.statusCode).to.equal(403) &&
                    expect(noUser).to.eql(undefined))
            }))
        })
        describe('changeRole', function () {
            beforeEach(async(function () {
                request2 = require('supertest-as-promised').agent(sails.hooks.http.app);
                var res = await(request2
                    .post('/register')
                    .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'newuser', company: 'Target' }))
            }))
            afterEach(async(function () {
                await(User.destroy({ username: 'newuser' }))
            }))
            it('should not allow me to change someones role', async(function () {
                var user = await(User.findOne({ username: 'newuser' }).populate('role'))
                if (user.role.name != 'registered') {
                    return expect(user.role.name).to.equal('registered')
                }
                var res = await(request.put('/user/changeRole').send({ userID: user.id, role: 'admin' }))
                return (expect(user.role.name).to.equal('registered') &&
                    expect(res.statusCode).to.equal(403))
            }))
        })
    })
    describe('associate', function () {
        before(async(function () {
            request = require('supertest-as-promised').agent(sails.hooks.http.app);
            await(request
                .post('/auth/local')
                .send({ identifier: 'associate@example.com', password: 'associate1234' }))
        }))
        describe('get', function () {
            it('should only return my user information', async(function () {
                var user = await(User.findOne({ username: 'associate' }).populate('role'))
                var response = await(request.get('/user'))
                return (expect(response.statusCode).to.equal(200) &&
                    expect(response.body.username).to.deep.equal(user.username) &&
                    expect(response.body.role.id).to.equal(user.role.id) &&
                    expect(response.body.id).to.deep.equal(user.id))
            }))
        })
        describe('get/all', function () {
            it('should return all users', async(function () {
                var allUsers = await(User.find({}))
                var response = await(request.get('/user/all'))
                return (expect(response.statusCode).to.equal(200) &&
                    expect(response.body.length).to.equal(allUsers.length))
            }))
        })
        describe('post', function () {
            it('should let me create a new user when logged in', async(function () {
                var res = await(request
                    .post('/user')
                    .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'newuser', company: 'Target' }))
                var user = await(User.findOne({ username: 'newuser' }))
                var users = await(User.find({}))
                return (expect(res.statusCode).to.equal(201) &&
                    expect(user).to.not.equal(undefined) &&
                    expect(user.username).to.equal('newuser'))
            }))
        })
        describe('register', function () {
            it('should let me create a new user when logged in', async(function () {
                var res = await(request
                    .post('/register')
                    .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'newuser', company: 'Target' }))
                var user = await(User.findOne({ username: 'newuser' }))
                return (expect(res.statusCode).to.equal(201) &&
                    expect(user).to.not.equal(undefined) &&
                    expect(user.username).to.equal('newuser'))
            }))
        })
        describe('put', function () {
            beforeEach(async(function () {
                request2 = require('supertest-as-promised').agent(sails.hooks.http.app);
                var res = await(request2
                    .post('/register')
                    .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'newuser', company: 'Target' }))
            }))
            afterEach(async(function () {
                await(User.destroy({ username: 'newuser' }))
                await(User.destroy({ username: 'not allowed' }))
            }))
            it('should not allow me to update anything about anyone', async(function () {
                var user = await(User.findOne({ username: 'newuser' }))
                var res = await(request.put('/user/' + user.id).send({ username: 'not allowed' }))
                var noUser = await(User.findOne({ username: 'not allowed' }))
                return (expect(res.statusCode).to.equal(403) &&
                    expect(noUser).to.eql(undefined))
            }))
        })

        describe('delete', function () {
            beforeEach(async(function () {
                request2 = require('supertest-as-promised').agent(sails.hooks.http.app);
                var res = await(request2
                    .post('/register')
                    .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'newuser', company: 'Target' }))
            }))
            afterEach(async(function () {
                await(User.destroy({ username: 'newuser' }))
                await(User.destroy({ username: 'not allowed' }))
            }))
            it('should not allow me to delete anyone', async(function () {
                var user = await(User.findOne({ username: 'newuser' }))
                var res = await(request.del('/user/' + user.id).send({ username: 'not allowed' }))
                var noUser = await(User.findOne({ username: 'not allowed' }))
                return (expect(res.statusCode).to.equal(403) &&
                    expect(noUser).to.eql(undefined))
            }))
        })
        describe('changeRole', function () {
            beforeEach(async(function () {
                request2 = require('supertest-as-promised').agent(sails.hooks.http.app);
                var res = await(request2
                    .post('/register')
                    .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'newuser', company: 'Target' }))
            }))
            afterEach(async(function () {
                await(User.destroy({ username: 'newuser' }))
            }))
            it('should not allow me to change someones role', async(function () {
                var user = await(User.findOne({ username: 'newuser' }).populate('role'))
                if (user.role.name != 'registered') {
                    return expect(user.role.name).to.equal('registered')
                }
                var res = await(request.put('/user/changeRole').send({ userID: user.id, role: 'admin' }))
                return (expect(user.role.name).to.equal('registered') &&
                    expect(res.statusCode).to.equal(403))
            }))
        })

    })
    describe('admin', function () {
        before(async(function () {
            request = require('supertest-as-promised').agent(sails.hooks.http.app);
            await(request
                .post('/auth/local')
                .send({ identifier: 'admin@example.com', password: 'admin1234' }))
        }))
        describe('get', function () {
            it('should only return my user information', async(function () {
                var user = await(User.findOne({ username: 'admin' }).populate('role'))
                var response = await(request.get('/user'))
                return (expect(response.statusCode).to.equal(200) &&
                    expect(response.body.username).to.deep.equal(user.username) &&
                    expect(response.body.role.id).to.equal(user.role.id) &&
                    expect(response.body.id).to.deep.equal(user.id))
            }))
        })
        describe('get/all', function () {
            it('should return all users', async(function () {
                var allUsers = await(User.find({}))
                var response = await(request.get('/user/all'))
                return (expect(response.statusCode).to.equal(200) &&
                    expect(response.body.length).to.equal(allUsers.length))
            }))
        })
        describe('post', function () {
            it('should let me create a new user when logged in', async(function () {
                var res = await(request
                    .post('/user')
                    .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'newuser', company: 'Target' }))
                var user = await(User.findOne({ username: 'newuser' }))
                return (expect(res.statusCode).to.equal(201) &&
                    expect(user).to.not.equal(undefined) &&
                    expect(user.username).to.equal('newuser'))
            }))
        })
        describe('register', function () {
            it('should let me create a new user when logged in', async(function () {
                var res = await(request
                    .post('/register')
                    .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'newuser', company: 'Target' }))
                var user = await(User.findOne({ username: 'newuser' }))
                return (expect(res.statusCode).to.equal(201) &&
                    expect(user).to.not.equal(undefined) &&
                    expect(user.username).to.equal('newuser'))
            }))
        })
        describe('put', function () {
            beforeEach(async(function () {
                request2 = require('supertest-as-promised').agent(sails.hooks.http.app);
                var res = await(request2
                    .post('/register')
                    .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'newuser', company: 'Target' }))
            }))
            afterEach(async(function () {
                await(User.destroy({ username: 'newuser' }))
                await(User.destroy({ username: 'not allowed' }))
            }))
            it('should allow me to update anything about anyone', async(function () {
                var user = await(User.findOne({ username: 'newuser' }))
                var res = await(request.put('/user/' + user.id).send({ username: 'not allowed' }))
                var updatedUser = await(User.findOne({ username: 'not allowed' }))
                var oldUser = await(User.findOne({ username: 'newuser' }))
                return (expect(res.statusCode).to.equal(200) &&
                    expect(updatedUser.username).to.eql('not allowed') &&
                    expect(updatedUser.id).to.equal(user.id) &&
                    expect(oldUser).to.equal(undefined))
            }))
        })

        describe('delete', function () {
            beforeEach(async(function () {
                request2 = require('supertest-as-promised').agent(sails.hooks.http.app);
                var res = await(request2
                    .post('/register')
                    .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'newuser', company: 'Target' }))
            }))
            afterEach(async(function () {
                await(User.destroy({ username: 'newuser' }))
                await(User.destroy({ username: 'not allowed' }))
            }))
            it('should allow me to delete anyone', async(function () {
                var user = await(User.findOne({ username: 'newuser' }))
                var res = await(request.del('/user/' + user.id))
                var noUser = await(User.findOne({ username: 'newuser' }))
                return (expect(res.statusCode).to.equal(200) &&
                    expect(noUser).to.eql(undefined))
            }))
        })
        describe('changeRole', function () {
            beforeEach(async(function () {
                request2 = require('supertest-as-promised').agent(sails.hooks.http.app);
                var res = await(request2
                    .post('/register')
                    .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'newuser', company: 'Target' }))
            }))
            afterEach(async(function () {
                await(User.destroy({ username: 'newuser' }))
            }))
            it('should allow me to change someones role', async(function () {
                var user = await(User.findOne({ username: 'newuser' }).populate('role'))
                if (user.role.name != 'registered') {
                    return expect(user.role.name).to.equal('registered')
                }
                var res = await(request.put('/user/changeRole').send({ userID: user.id, role: 'admin' }))
                var admin = await(User.findOne({ username: 'newuser' }).populate('role'))
                return (expect(admin.role.name).to.equal('admin') &&
                    expect(res.statusCode).to.equal(200))
            }))
        })
    })
    describe('notLoggedIn', function () {
        describe('get', function () {
            it('should not allow me to get any users', async(function () {
                request = require('supertest-as-promised').agent(sails.hooks.http.app);
                var response = await(request.get('/user'))
                return (expect(response.statusCode).to.equal(403) &&
                    expect(response.body).to.deep.equal({}))
            }))
        })
        describe('create', function () {
            it('should create a new user under the registered role', async(function () {
                request = require('supertest-as-promised').agent(sails.hooks.http.app);
                var res = await(request
                    .post('/user')
                    .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'newuser', company: 'Target' }))
                var user = await(User.findOne({ username: 'newuser' }).populate('role'))
                return (expect(user.role.name).to.equal('registered') &&
                    expect(res.statusCode).to.equal(201))
            }))
            it('should keep all atrributes sent', async(function () {
                request = require('supertest-as-promised').agent(sails.hooks.http.app);
                var companies = await(Company.find({}))
                var res = await(request
                    .post('/user')
                    .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'newuser', company: companies[0].id, handler: 'Borne' }))
                var user = await(User.findOne({ username: 'newuser' }).populate('role'))
                return (expect(user.role.name).to.equal('registered') &&
                    expect(res.statusCode).to.equal(201) &&
                    expect(user.identifier).to.equal('newuser@example.com') &&
                    expect(user.username).to.equal('newuser') &&
                    expect(user.company).to.equal(companies[0].id) &&
                    expect(user.handler).to.equal('Borne'))
            }))

            it('should not allow 2 users with the same username', async(function () {
                request = require('supertest-as-promised').agent(sails.hooks.http.app);
                await(request
                    .post('/user')
                    .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'newuser', company: 'Target' }))
                var res = await(request
                    .post('/user')
                    .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'newuser', company: 'Target' }))
                return (expect(res.statusCode).to.equal(400) &&
                    expect(res.text).to.equal('Username or Email Address already in use'))
            }))

            it('should not allow 2 users with the same email address', async(function () {
                request = require('supertest-as-promised').agent(sails.hooks.http.app);
                await(request
                    .post('/user')
                    .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'newuser', company: 'Target' }))
                var res = await(request
                    .post('/user')
                    .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'othernewuser', company: 'Target' }))
                return (expect(res.statusCode).to.equal(400) &&
                    expect(res.text).to.equal('Username or Email Address already in use'))
            }))
        })

        describe('register', function () {
            it('should create a new user under the registered role', async(function () {
                request = require('supertest-as-promised').agent(sails.hooks.http.app);
                var res = await(request
                    .post('/register')
                    .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'newuser', company: 'Target' }))
                var user = await(User.findOne({ username: 'newuser' }).populate('role'))
                return (expect(user.role.name).to.equal('registered') &&
                    expect(res.statusCode).to.equal(201))
            }))

            it('should keep all atrributes sent', async(function () {
                request = require('supertest-as-promised').agent(sails.hooks.http.app);
                var companies = await(Company.find({}))
                var res = await(request
                    .post('/register')
                    .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'newuser', company: companies[0].id, handler: 'Borne' }))
                var user = await(User.findOne({ username: 'newuser' }).populate('role'))
                return (expect(user.role.name).to.equal('registered') &&
                    expect(res.statusCode).to.equal(201) &&
                    expect(user.identifier).to.equal('newuser@example.com') &&
                    expect(user.username).to.equal('newuser') &&
                    expect(user.company).to.equal(companies[0].id) &&
                    expect(user.handler).to.equal('Borne'))
            }))

            it('should not allow 2 users with the same username', async(function () {
                request = require('supertest-as-promised').agent(sails.hooks.http.app);
                await(request
                    .post('/register')
                    .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'newuser', company: 'Target' }))
                var res = await(request
                    .post('/register')
                    .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'newuser', company: 'Target' }))
                return (expect(res.statusCode).to.equal(400) &&
                    expect(res.text).to.equal('Username or Email Address already in use'))
            }))

            it('should not allow 2 users with the same email address', async(function () {
                request = require('supertest-as-promised').agent(sails.hooks.http.app);
                await(request
                    .post('/register')
                    .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'newuser', company: 'Target' }))
                var res = await(request
                    .post('/register')
                    .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'othernewuser', company: 'Target' }))
                return (expect(res.statusCode).to.equal(400) &&
                    expect(res.text).to.equal('Username or Email Address already in use'))
            }))
        })
        describe('put', function () {
            beforeEach(async(function () {
                request2 = require('supertest-as-promised').agent(sails.hooks.http.app);
                request = require('supertest-as-promised').agent(sails.hooks.http.app);
                var res = await(request2
                    .post('/register')
                    .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'newuser', company: 'Target' }))
            }))
            afterEach(async(function () {
                await(User.destroy({ username: 'newuser' }))
                await(User.destroy({ username: 'not allowed' }))
            }))
            it('should not allow me to update anything about anyone', async(function () {
                var user = await(User.findOne({ username: 'newuser' }))
                var res = await(request.put('/user/' + user.id).send({ username: 'not allowed' }))
                var noUser = await(User.findOne({ username: 'not allowed' }))
                return (expect(res.statusCode).to.equal(403) &&
                    expect(noUser).to.eql(undefined))
            }))
        })

        describe('delete', function () {
            beforeEach(async(function () {
                request = require('supertest-as-promised').agent(sails.hooks.http.app);
                request2 = require('supertest-as-promised').agent(sails.hooks.http.app);
                var res = await(request2
                    .post('/register')
                    .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'newuser', company: 'Target' }))
            }))
            afterEach(async(function () {
                await(User.destroy({ username: 'newuser' }))
            }))
            it('should not allow me to delete anyone', async(function () {
                var user = await(User.findOne({ username: 'newuser' }))
                var res = await(request.del('/user/' + user.id))
                var noUser = await(User.findOne({ username: 'newuser' }))
                return (expect(res.statusCode).to.equal(403) &&
                    expect(noUser).to.not.eql(undefined))
            }))
        })

        describe('changeRole', function () {
            beforeEach(async(function () {
                request2 = require('supertest-as-promised').agent(sails.hooks.http.app);
                var res = await(request2
                    .post('/register')
                    .send({ identifier: 'newuser@example.com', password: 'newuser1234', username: 'newuser', company: 'Target' }))
            }))
            afterEach(async(function () {
                await(User.destroy({ username: 'newuser' }))
            }))
            it('should not allow me to change someones role', async(function () {
                request = require('supertest-as-promised').agent(sails.hooks.http.app);
                var user = await(User.findOne({ username: 'newuser' }).populate('role'))
                if (user.role.name != 'registered') {
                    return expect(user.role.name).to.equal('registered')
                }
                var res = await(request.put('/user/changeRole').send({ userID: user.id, role: 'admin' }))
                return (expect(user.role.name).to.equal('registered') &&
                    expect(res.statusCode).to.equal(403))
            }))
        })
    })
})