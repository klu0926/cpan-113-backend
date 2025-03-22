const path = require('path')
const router = require('express').Router()
const userController = require('../controller/userController')
const apiResponse = require('../helper/apiResponse')
const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.JWT_SECRET


router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

router.post('/login', userController.login)

// Authentica JWT of all following routes below
// ...
router.get('/users/:userId', userController.getUser)
router.get('/users', userController.getUsers)
router.post('/users', userController.postUser)


// 404
// if the pages doesn't exist
// return something
router.use((req, res) => {
  res.status(404).json(apiResponse(false, null, 'Page not found'))
})


module.exports = router