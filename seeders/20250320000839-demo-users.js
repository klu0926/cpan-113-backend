'use strict';
const bcrypt = require('bcrypt')

// user1, user1@gmail.com, password1, {}
// user2, user2@gmail.com, password2, {}
// ...

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    // password
    const hashedPassword = await Promise.all(
      Array.from({ length: 10 }, (_, i) => bcrypt.hash(`password${i + 1}`, 10))
    )

    const users = []
    for (let i = 0; i < 10; i++) {
      const user = {
        name: `user${i + 1}`,
        email: `user${i + 1}@gmail.com`,
        password: hashedPassword[i],
        data: '{}'
      }
      users.push(user)
    }
    return queryInterface.bulkInsert('Users', users)
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {})
  }
};
