'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Scores', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      point: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      level: {
        type: Sequelize.STRING
      },
      difficulty: {
        type: Sequelize.STRING
      },
      speed: {
        type: Sequelize.STRING
      },
      language: {
        type: Sequelize.STRING
      },
      data: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()

      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()

      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Scores');
  }
};