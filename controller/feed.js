const { validationResult } = require('express-validator')
const fs = require('fs');
const Path = require('path');

const User = require('../models/user');
const Post = require('../models/post');

const clearImage = (filePath) => {
    filePath = Path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => {
        if (err)
            console.log('clearImage: ', err);
    });
}

exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;
    Post.find().countDocuments()
        .then(count => {
            totalItems = count;

            return Post.find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage)
        })
        .then(posts => {
            res.status(200).json({
                message: 'Posts fetched',
                posts: posts,
                totalItems: totalItems,
            })
        })
        .catch((err) => {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        });

};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect');
        error.statusCode = 422;
        throw error;
    }

    if (!req.file) {
        console.log(req);
        const error = new Error('No image provided.');
        error.statusCode = 422;
        throw error;
    }

    const imageUrl = req.file.path.replace("\\", "/");
    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: req.userId,
    });


    let creator;

    post.save()
        .then(result => {
            return User.findOne({ _id: req.userId });
        })
        .then(user => {
            creator = user;
            user.posts.push(post);
            return user.save();
        })
        .then((result) => {
            res.status(201).json({
                message: 'post created successfully',
                post: post,
                creator: { _id: creator._id, name: creator.name },
            });
        })
        .catch((err) => {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        });
}

exports.getPost = (req, res, next) => {
    const postId = req.params.postId

    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Post Not Found');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                message: 'Post fetched',
                post: post
            })
        })
        .catch(err => {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        })
}

exports.editPost = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect');
        error.statusCode = 422;
        throw error;
    }

    const postId = req.params.postId
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;

    if (req.file)
        imageUrl = req.file.path.replace("\\", "/");

    if (!imageUrl) {
        const error = new Error('No image picked');
        error.statusCode = 422;
        throw error;
    }

    Post.findById(postId)
        .then(post => {
            
            if (!post) {
                const error = new Error('Post Not Found');
                error.statusCode = 404;
                throw error;
            }

            if(req.userId !== post.creator.toString()){
                const error = new Error('Not authorized!');
                error.statusCode = 403;
                throw error;
            }
            
            // if the image changed then delete the old one.
            if (post.imageUrl != imageUrl)
                clearImage(post.imageUrl);

            post.title = title;
            post.content = content;
            post.imageUrl = imageUrl;

            return post.save()
        })
        .then(post => {
            res.status(200).json({
                message: 'Post Updated',
                post: post
            });
        })
        .catch(err => {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        })
}

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    let imageUrl;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Post Not Found');
                error.statusCode = 404;
                throw error;
            }
            if(req.userId !== post.creator.toString()){
                const error = new Error('Not authorized!');
                error.statusCode = 403;
                throw error;
            }
            //check logged in user
            imageUrl = post.imageUrl;
            return Post.findOneAndDelete({ _id: postId })

        })
        .then(result => {
            clearImage(imageUrl);
            return User.findById(req.userId)

        })
        .then(user => {
            user.posts.pull(postId);
            return user.save();
        })
        .then(result => {
            res.status(200).json({message: 'Post Deleted',});
        })
        .catch(err => {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        })

}

