// env
require('dotenv').config()
// test env
const expect = require('chai').expect;
const sinon = require('sinon');
// db
const mongoose = require('mongoose');
const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Auth Controller', function () {
  // init setup
  before(function (done) {
    mongoose
      .connect(
        process.env.DATABASE_URL_TEST,
        {
          useUnifiedTopology: true, useNewUrlParser: true
        }
      )
      .then(() => {
        const user = new User({
          email: 'test@test.com',
          password: 'tester',
          name: 'Test',
          posts: [],
          _id: '5c0f66b979af55031b34728a' // set explicitly to then check it
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });
  // tests
  it('should throw an error with code 500 if accessing the database fails', function (done) {
    // stubbing access to DB
    sinon.stub(User, 'findOne');
    User.findOne.throws();
    // provide fake req
    const req = {
      body: {
        email: 'test@test.com',
        password: 'tester'
      }
    };

    AuthController.login(req, {}, () => { }).then(result => {
      expect(result).to.be.an('error');
      expect(result).to.have.property('statusCode', 500);
      done();
    });
    // un-stub
    User.findOne.restore();
  });

  it('should send a response with a valid user status for an existing user', function (done) {
    // fave req
    const req = { userId: '5c0f66b979af55031b34728a' };
    // fake res obj
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this; // to continue chain status().json()
      },
      json: function (data) {
        this.userStatus = data.status;
      }
    };
    AuthController.getUserStatus(req, res, () => { }).then(() => {
      expect(res.statusCode).to.be.equal(200);
      expect(res.userStatus).to.be.equal('I am new!'); // predefined in model
      done();
    });
  });
  // clear up
  after(function (done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
