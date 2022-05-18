const bcrypt = require("bcryptjs");
const User = require('../models/users')


module.exports = {
   createUser: async (args, req) => {
       const {email, password} = args.userInput
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