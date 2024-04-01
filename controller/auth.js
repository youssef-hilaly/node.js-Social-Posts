const { validationResult } = require('express-validator')
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

exports.signup = (req, res, next) => {
    const errors = validationResult(req).errors;
    if (errors.length > 0) {
        const error = new Error('invalid Data');
        error.statusCode = 422;
        error.data = errors;
        throw error;
    }

    const { name, email, password } = req.body;

    bcrypt.hash(password, 12)
        .then(hashedPW => {
            const user = new User({
                name,
                email,
                password: hashedPW,
                posts: []
            });
            return user.save();
        })
        .then(result => {
            return res.status(201).json({
                message: 'user created',
                userId: result._id,
            })
        })
        .catch((err) => {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        });
}

exports.login = (req, res, next) => {
    const { email, password } = req.body;
    let loadedUser;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                const error = new Error('Wrong email or password');
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password)
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong email or password');
                error.statusCode = 401;
                throw error;
            }

            const token = jwt.sign(
                {
                    email: loadedUser.email,
                    userId: loadedUser._id.toString(),
                },
                '123654789secretkey321789546',
                { expiresIn: '1h', }
            );

            res.status(200).json({ token: token, userId: loadedUser._id.toString() });
        })
        .catch(err => {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        })
}