'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AnalysisHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AnalysisHistory.belongsTo(models.User, { foreignKey: 'userId' });
      AnalysisHistory.belongsTo(models.CV, { foreignKey: 'cvId' });
    }
  }
  AnalysisHistory.init({
    score: DataTypes.INTEGER,
    feedback: DataTypes.JSON,
    suggestions: DataTypes.JSON,
    analyzedAt: DataTypes.DATE,
    cvId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'AnalysisHistory',
  });
  return AnalysisHistory;
};