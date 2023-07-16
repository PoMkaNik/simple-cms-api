const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const FeedController = require('../controllers/feed');

describe('Feed Controller', function () {
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
          _id: '5c0f66b979af55031b34728a'
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });
  // tests
  it('should add a created post to the posts of the creator', function (done) {
    const req = {
      body: {
        title: 'Test Post',
        content: 'A Test Post'
      },
      file: {
        path: 'abc' // need to be -> no matter real or not :)
      },
      userId: '5c0f66b979af55031b34728a'
    };
    const res = {
      status: function () {
        return this;
      },
      json: function () { }
    };

    FeedController.createPost(req, res, () => { }).then(savedUser => {
      expect(savedUser).to.have.property('posts');
      expect(savedUser.posts).to.have.length(1);
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
