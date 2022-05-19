const bcrypt = require("bcryptjs");
const validator = require("validator");
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
   }
}