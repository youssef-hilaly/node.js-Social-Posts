const express = require('express');
const { body } = require('express-validator')

const router = express.Router();

const feedController = require('../controller/feed');

const isAuth = require('../middleware/is-auth');

// GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts);

// PoST /feed/posts
router.post('/post', isAuth, [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
], feedController.createPost);

// GET /feed/post/id
router.get('/post/:postId', isAuth, feedController.getPost)

// PUT /feed/post/id
router.put('/post/:postId', isAuth, [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
], feedController.editPost)

// DELETE /feed/post/id
router.delete('/post/:postId', isAuth, feedController.deletePost)

module.exports = router;