require("dotenv").config();
const express = require("express");
const { body } = require("express-validator");

const feedControllers = require("../controllers/feed");

const router = express.Router();

router.get("/posts", feedControllers.getPosts);

router.post(
  "/posts",
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

router.delete('/posts/:postId', feedControllers.deletePost);

module.exports = router;
