const { User, Score } = require('../models')
const apiResponse = require('../helper/apiResponse')
const { where } = require('sequelize')


// No route require authentication
const scoreController = {
  getScores: async (req, res) => {
    try {
      const { userId, level, difficulty, speed, language, order = 'DESC', count } = req.query
      const whereOptions = {}
      if (userId) whereOptions.userId = userId
      if (level) whereOptions.level = level
      if (difficulty) whereOptions.difficulty = difficulty
      if (speed) whereOptions.speed = speed
      if (language) whereOptions.language = language.toLowerCase()

      const scores = await Score.findAll({
        where: whereOptions,
        order: [['point', order]],
        limit: count ? parseInt(count) : undefined,
      })

      // convert to JSON
      const scoreJSON = scores.map(score => {
        return score.toJSON()
      })

      res.json(apiResponse(true, scoreJSON, `Successfully get scores. count: ${scoreJSON.length}`))

    } catch (err) {
      res.json(apiResponse(false, {}, err.message))
    }
  },
  postScore: async (req, res) => {
    try {
      const { userId, point, level, difficulty, speed, language, data } = req.body;

      if (userId === undefined) throw new Error('Missing userId')
      if (point === undefined) throw new Error('Missing score point')

      const score = await Score.create({
        userId,
        point,
        level: level ? level.toString() : '',
        difficulty: difficulty ? difficulty.toString() : '',
        speed: speed ? speed.toString() : '',
        language: language ? language.toLowerCase() : '',
        data: data ? data : ''
      })

      if (!score) throw new Error('Score cannot be created')

      res.json(apiResponse(true, score.toJSON(), 'Successfully create new score'))

    } catch (err) {
      res.json(apiResponse(false, {}, err.message))
    }
  },
  // Admin required
  deleteScore: async (req, res) => {
    try {
      // check score id
      const { scoreId } = req.body
      if (scoreId === undefined) throw new Error('Missing scoreId')

      // checking is admin
      if (req.user?.role !== 'admin') {
        throw new Error('Only admin can delete score')
      }

      const deleteRow = await Score.destroy({
        where: { id: scoreId }
      });
      if (deleteRow === 0) {
        throw new Error(`No score with id ${scoreId}`)
      }
      // return 
      res.json(apiResponse(true, {}, `Successfully deleted score with id: ${scoreId}`))

    } catch (err) {
      res.json(apiResponse(false, {}, err.message))
    }
  }
}


module.exports = scoreController