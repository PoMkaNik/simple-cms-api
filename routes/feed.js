// server
const express = require('express');
const isAuth = require('../middleware/is-auth');
const feedController = require('../controllers/feed');
const router = express.Router();
// validation
const { body } = require('express-validator/check');
// 
// GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts);
// POST /feed/post
router.post(
  '/post',
  isAuth,
  // validation
  [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ],
  feedController.createPost
);
// GET /feed/post/[id]
router.get('/post/:postId', isAuth, feedController.getPost);
// PUT /feed/post/[id]
router.put(
  '/post/:postId',
  isAuth,
  // validation
  [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ],
  feedController.updatePost
);
// DELETE /feed/post/[id]
router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = router;
