require("dotenv").config();
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const User = require("../models/users");
const Post = require("../models/post");

module.exports = {
  createUser: async (args, req) => {
    const { email, password } = args.userInput;
    const errors = [];
    if (!validator.isEmail(email)) {
      errors.push({ message: "E-mail is invalid" });
    }

    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 1 })
    ) {
      errors.push({ message: "Must enter a password" });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid Input");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      const error = new Error("User exist already");
      throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPassword,
    });
    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },
  login: async ({ email, password }, req) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("User Not Found");
      error.code = 401;
      throw err;
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Password Is Incorrect");
      error.code = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      process.env.SECRET,
      { expiresIn: "1h" }
    );

    return {
      token: token,
      userId: user._id.toString(),
    };
  },
  createPost: async ({ postInput }, req) => {
    //   if (!req.isAuth) {
    //       const error = new Error('You Must Login To Create A Post')
    //       error.code = 401
    //       throw error
    //   }
    const errors = [];
    if (
      validator.isEmpty(postInput.title) ||
      !validator.isLength(postInput.title, { min: 1 })
    ) {
      errors.push({ message: "Must Include A Title" });
    }
    if (
      validator.isEmpty(postInput.content) ||
      !validator.isLength(postInput.content, { min: 1 })
    ) {
      errors.push({ message: "Must Include Content" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid Input");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    //    const user = await User.findById(req.userId)
    //    if (!user) {
    //     const error = new Error('Invalid User')
    //     error.data = errors
    //     error.code = 422
    //     throw error
    //    }
    const post = new Post({
      title: postInput.title,
      content: postInput.content,
      imageUrl: postInput.imageUrl,
      creator: postInput.creator,
    });

    const createdPost = await post.save();
    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString(),
    };
  },
  posts: async (args, req) => {
    //   const totalPosts = await Post.find().countDocuments()
    const posts = await Post.find();

    return {
      posts: posts.map((p) => {
        return {
          ...p._doc,
          id: p._id.toString(),
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
        };
      }),
    };
  },
  deletePost: async ({id}, req) => {
      try {
        await Post.findByIdAndRemove(id)
        return true
      } catch {
        return false
      }
     
  }
};
