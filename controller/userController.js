const { User } = require('../models')
const apiResponse = require('../helper/apiResponse')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.JWT_SECRET

const userController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body

      if (!email) throw new Error('Missing email')
      if (!password) throw new Error('Missing password')

      const user = await User.findOne({
        where: { email },
      })
      if (!user) throw new Error('Can not find user with this email')

      // check password
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) throw new Error('Email and password do not match')

      // return JWT
      const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' })
      res.json(apiResponse(true, token, 'Successfully login, return JWT token'))

    } catch (err) {
      res.json(apiResponse(false, {}, err.message))

    }
  },
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: {
          exclude: ['updatedAt']
        },
        order: [['name', 'ASC']]
      })
      if (!users) throw new Error('Can not find any users')

      // convert to JSON
      const userJSON = users.map(user => {
        return user.toJSON()
      })
      res.json(apiResponse(true, userJSON, 'Successfully get all users'))

    } catch (err) {
      res.json(apiResponse(false, {}, err.message))
    }
  },
  getUser: async (req, res) => {
    try {
      const { userId } = req.params

      const user = await User.findOne({
        where: { id: userId },
        attributes: {
          exclude: ['updatedAt']
        },
      })
      if (!user) throw new Error('Can not find this user')

      res.json(apiResponse(true, user.toJSON(), 'Successfully get user'))

    } catch (err) {
      res.json(apiResponse(false, {}, err.message))
    }
  },
  postUser: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // check if user exist
      const oldUser = await User.findOne({
        where: { email },
      })
      if (oldUser) throw new Error('Email already exist')
      if (!name) throw new Error('Missing user name')
      if (!password) throw new Error('Missing user password')

      // create
      const user = await User.create({
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        data: '{}'
      })

      if (!user) throw new Error('User can not be created')
      // return 
      res.json(apiResponse(true, user.toJSON(), 'Successfully create user'))
    } catch (err) {
      res.json(apiResponse(false, {}, err.message))
    }
  }

}

module.exports = userController