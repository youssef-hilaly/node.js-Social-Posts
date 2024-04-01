const path = require('path')
const express = require('express');

const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const feedRoutes = require('./routers/feed');
const authRoutes = require('./routers/auth');
const userRoutes = require('./routers/user');

const app = express();


const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    )

        cb(null, true);
    else
        cb(null, false);
}

// app.use(bodyParser().urlencoded()); // x-www-from-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();

})

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const statusCode = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(statusCode).json({ message: message, data: data });
})

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        app.listen(8080);
    })
    .catch((err) => {
        console.log(err);
    })