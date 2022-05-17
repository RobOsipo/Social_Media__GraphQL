const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization')
    if(!authHeader) {
        console.log('no authorization header attached')
        const error = new Error('No authorization header attached')
        error.statusCode = 401
        throw error
    }

    const token = req.headers.authorization.split(' ')[1]
    let decodedToken
    try {
        decodedToken = jwt.verify(token, 'gugigistufandog')
    } catch(err) {
        console.log('.catch block of is-auth')
        err.statusCode = 500
        throw err;
    }

    if(!decodedToken) {
        console.log('!decodedToken is-auth')
        const error = new Error('Not Authenticated')
        error.statusCode = 401
        throw error;
    }

    req.userId = decodedToken.userId
    next()
}