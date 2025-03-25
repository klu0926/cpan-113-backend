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
      const token = jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role,
      }
        , SECRET_KEY, { expiresIn: '1h' })

      // return
      res.json(apiResponse(true, token, 'Successfully login, return JWT token'))

    } catch (err) {
      res.json(apiResponse(false, {}, err.message))

    }
  },
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: {
          exclude: ['password']
        },
        order: [['id', 'ASC']],
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
          exclude: ['password']
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

      // remove password
      const json = user.toJSON()
      delete json.password

      // return 
      res.json(apiResponse(true, json, 'Successfully create user'))
    } catch (err) {
      res.json(apiResponse(false, {}, err.message))
    }
  },
  // Role: "user", can only edit himself
  // Role: "admin", can edit anyone
  // files: name, data (string)
  putUser: async (req, res) => {
    try {
      // check userId
      const { userId, name, data } = req.body
      if (!userId) throw new Error('Missing userId')

      // confirm user data
      const user = req.user
      if (!user) throw new Error('Cannot find req.user data')
      if (!user.id) throw new Error('Cannot find user.id')

      // check is admin or user
      if (user.role !== 'admin' && Number(user.id) !== Number(userId)) {
        throw new Error('You cannot edit another user')
      }

      // find user in database
      const userData = await User.findOne({ where: { id: userId } })
      if (!userData) throw new Error(`Cannot find user data for user id : ${userId}`)

      // update user 
      if (name) userData.name = name
      if (data) userData.data = data
      await userData.save()

      // remove password
      const json = userData.toJSON()
      delete json.password

      // return 
      res.json(apiResponse(true, userData, 'Successfully updated user'))
    } catch (err) {
      res.json(apiResponse(false, {}, err.message))
    }
  },
  // Role: "user", can only delete himself
  // Role: "admin", can delete anyone but himself
  deleteUser: async (req, res) => {
    try {
      // check userId
      const { userId } = req.body
      if (!userId) throw new Error('Missing userId')

      // confirm user data
      const user = req.user
      if (!user) throw new Error('Cannot find req.user data')
      if (!user.id) throw new Error('Cannot find user.id')

      // check is admin or user
      if (user.role !== 'admin' && Number(user.id) !== Number(userId)) {
        throw new Error('You cannot delete another user')
      }
      // Cannot delete admin
      if (Number(userId) === 1) throw new Error('Cannot delete admin')

      // delete user
      const deleteRow = await User.destroy({ where: { id: userId } })
      if (deleteRow === 0) {
        throw new Error(`No user with id: ${userId}`)
      }

      // return 
      res.json(apiResponse(true, {}, `Successfully delete user with id: ${userId}`))
    } catch (err) {
      res.json(apiResponse(false, {}, err.message))
    }
  }
}

module.exports = userController