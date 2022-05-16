const express = require('express');

const feedControllers = require('../controllers/feed')

const router = express.Router()


router.get('/posts', feedControllers.getPosts)

router.post('/posts', feedControllers.createPost)




module.exports = router