const path = require('path')
const router = require('express').Router()
const userController = require('../controller/userController')
const scoreController = require('../controller/scoreController')
const apiResponse = require('../helper/apiResponse')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

// INDEX
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

// USER
// Login, and return JWT
router.post('/login', userController.login)

// JWT Authentication
function jwtAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1] // [0] is "Bear"
    if (!token) throw new Error('Missing token, not authorized')

    // check JTW
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) throw new Error(err.message)
      // put JWT payload to req
      req.user = user
      console.log("req.user:", req.user)
      next()
    })
  } catch (err) {
    res.json(apiResponse(false, {}, err.message))
  }
}

router.get('/users/:userId', userController.getUser) // Get 1 user
router.get('/users', userController.getUsers) // Get all users
router.post('/users', userController.postUser) // Register
router.put('/users', jwtAuth, userController.putUser) // Edit User
router.delete('/users', jwtAuth, userController.deleteUser)

// SCORE
router.get('/scores', scoreController.getScores);
router.post('/scores', scoreController.postScore);
router.delete('/scores', jwtAuth, scoreController.deleteScore);


// 404
// if the pages doesn't exist
// return something
router.use((req, res) => {
  res.status(404).json(apiResponse(false, null, 'No API at this URL'))
})


module.exports = router