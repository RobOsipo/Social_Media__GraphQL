const { validationResult } = require("express-validator");

const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res
        .status(200)
        .json({ message: "Fetch all posts success", posts: posts });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statucCode = 500;
      }
      console.log("failed to get single post by ID", err);
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("No fields can be empty!");
    error.statusCode = 422;
    throw error;
  }
  const { title, content, imageUrl } = req.body;

  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: { name: "Rob" },
  });
  post
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Post created successfully",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statucCode = 500;
      }
      console.log("failed to save POST to Atlas", err);
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const { postId } = req.params;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find a post by that ID");
        error.statusCode = 404;
        throw error;
      }
      res
        .status(200)
        .json({ message: "Post successfully fetched", post: post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statucCode = 500;
      }
      console.log("failed to get single post by ID", err);
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  const { postId } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("No fields can be empty!");
    error.statusCode = 422;
    throw error;
  }
  const { title, content, imageUrl } = req.body;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find a post to update");
        error.statusCode = 404;
        throw error;
      }
      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save();
    })
    .then((result) => {
      res
        .status(200)
        .json({ message: "Post updated successfully", post: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      console.log("failed to get single post by ID and update it", err);
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
    const {postId} = req.params
    Post.findById(postId)
        .then(post => {
            // delete once I have 
            if (!post) {
                const error = new Error("Could not find a post to delete");
                error.statusCode = 404;
                throw error;
              }
              return Post.findByIdAndRemove(postId)
              
        })
        .then(result => {
            console.log('results', result)
            res.status(200).json({message: 'Post deleted successfully'})
        })
        .catch((err) => {
            if (!err.statusCode) {
              err.statusCode = 500;
            }
            console.log("failed to get single post by ID and delete it", err);
            next(err);
          })
}
