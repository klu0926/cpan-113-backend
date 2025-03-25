'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Score extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Score.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    }
  }
  Score.init({
    userId: DataTypes.INTEGER,
    point: DataTypes.INTEGER,
    level: DataTypes.STRING,
    difficulty: DataTypes.STRING,
    language: DataTypes.STRING,
    data: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Score',
  });
  return Score;
};