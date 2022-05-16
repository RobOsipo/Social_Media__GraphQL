const { validationResult } = require('express-validator')

const Post = require('../models/post')


exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "First Post",
        content: "This is the first post",
        imageUrl: "images/img1.jpg",
        creator: { name: "Rob" },
        createdAt: new Date(),
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: 'Title And Post Must Not Be Empty',
            errors: errors.array()
        });
    }
  const { title, content, imageUrl } = req.body;
  // create in DB
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: { name: "Rob" }
  })
  post.save().then(result => {
      console.log(result)
      res.status(201).json({
        message: "Post created successfully",
        post: result
      });
  }).catch(err => console.log('failed to save POST to Atlas', err))

  
};
