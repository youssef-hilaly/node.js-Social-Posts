const express = require('express');
const { body } = require('express-validator')

const router = express.Router();

const isAuth = require('../middleware/is-auth');
const userController = require('../controller/user');
// GET /user/posts
router.get('/status', isAuth, userController.getStatus);

module.exports = router;