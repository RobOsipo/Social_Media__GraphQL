const express = require("express");
const { body } = require("express-validator");

const User = require("../models/users");
const authControllers = require("../controllers/auth");

const router = express.Router();

router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email already exists");
          }
        });
      })
      .normalizeEmail(),
    body("password").not().isEmpty(),
  ],
  authControllers.register
);


router.post('/login', authControllers.login)

module.exports = router;
