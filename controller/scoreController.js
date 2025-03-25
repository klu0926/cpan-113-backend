const { User, Score } = require('../models')
const apiResponse = require('../helper/apiResponse')


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
  }
}


module.exports = scoreController