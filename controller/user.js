const User = require('../models/user');

exports.getStatus = (req, res, next) => {
    User.findById(req.userId)
    .then(user => {
        res.status(200).json({status: user.status})
    })
    .catch((err) => {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    });
};