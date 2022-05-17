require("dotenv").config();
const express = require("express");
const { body } = require("express-validator");

const feedControllers = require("../controllers/feed");
// TODO - ADD isAuth middlware to all routes after I finish the inital testing on the client side
const isAuth = require('../middleware/is-auth')

const router = express.Router();

router.get("/posts", feedControllers.getPosts);

router.post(
  "/posts",
  isAuth,
  [
    body("title").trim().isLength({ min: 1 }),
    body("content").trim().isLength({ min: 1 }),
  ],
  feedControllers.createPost
);

router.get("/posts/:postId", feedControllers.getPost);

router.put(
  "/posts/:postId",
  [
    body("title").trim().isLength({ min: 1 }),
    body("content").trim().isLength({ min: 1 }),
  ],
  feedControllers.updatePost
);

router.delete('/posts/:postId', isAuth, feedControllers.deletePost);

module.exports = router;
