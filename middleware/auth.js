require('dotenv').config()
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization
    if(!authHeader) {
        console.log('no authorization header attached')
        req.isAuth = false
        return next()
    }

    const token = req.headers.authorization.split(' ')[1]
    let decodedToken
    try {
        decodedToken = jwt.verify(token, process.env.SECRET)
    } catch(err) {
        req.isAuth = false
        return next()
    }

    if(!decodedToken) {
        console.log('!decodedToken is-auth')
        req.isAuth = false
        return next()
    }

    req.userId = decodedToken.userId
    req.isAuth = true
    next()
}