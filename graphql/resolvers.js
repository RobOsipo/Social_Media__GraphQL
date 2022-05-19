require('dotenv').config()
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const User = require('../models/users')


module.exports = {
   createUser: async (args, req) => {
       const {email, password} = args.userInput
       const errors = []
       if(!validator.isEmail(email)) {
           errors.push({message: 'E-mail is invalid'})
       }

       if(validator.isEmpty(password) || !validator.isLength(password, {min: 1})) {
            errors.push({message: 'Must enter a password'})
       }

       if(errors.length > 0) {
            const error = new Error('Invalid Input')
            error.data = errors
            error.code = 422
            throw error
       }

       const existingUser = await User.findOne({email: email})
       if (existingUser) {
           const error = new Error('User exist already')
           throw error
       }
      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({
          email: email,
          password: hashedPassword
      })
      const createdUser = await user.save()
      return { ...createdUser._doc, _id: createdUser._id.toString() }
   },
   login: async ({email, password}, req) => {
        const user = await User.findOne({email: email})
        if(!user) {
            const error = new Error('User Not Found')
            error.code = 401
            throw err
        }

        const isEqual = await bcrypt.compare(password, user.password)
        if(!isEqual) {
            const error = new Error('Password Is Incorrect')
            error.code = 401
            throw error
        }

        const token = jwt.sign({
            userId: user._id.toString(),
            email: user.email,
            
        }, process.env.SECRET, { expiresIn: '1h'})

        return {
            token: token, 
            userId: user._id.toString()
        }
   }
}