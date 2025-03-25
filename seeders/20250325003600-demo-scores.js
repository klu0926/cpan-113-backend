'use strict';
const { User } = require('../models')

const scoresPerUser = 50
const languages = [ // keep all in lower case
  'javascript',
  'python',
  'java',
  'csharp',
  'html',
]; 
const choices = ['1', '2', '3']
const speeds = ['0.5', '1', '2', '3']
// Seed
// Each user have 50 scores
// point range (0 - 1000) (10 point based)  
// level range from 1 to 3
// difficulty randomy range from 1 to 3
// speed randomy range from 1 to 3
// language randomly choose

// const randomPick = choices[Math.floor(Math.random() * choices.length)];

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)]
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // get all the users
    const users = await User.findAll()

    // for each users
    for (let i = 0; i < users.length; i++) {
      const user = users[i]
      const scores = []

      for (let j = 0; j < scoresPerUser; j++) {
        const score = {
          userId: user.id,
          point: Math.floor(Math.random() * 101) * 10,
          level: pickRandom(choices),
          difficulty: pickRandom(choices),
          speed: pickRandom(speeds),
          language: pickRandom(languages),
          data: '',
        }
        scores.push(score)
      }
      // create scores for this users
      await queryInterface.bulkInsert('Scores', scores)
    }

  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Scores', null, {})
  }
};
