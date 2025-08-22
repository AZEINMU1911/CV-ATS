'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CV extends Model {
    static associate(models) {
      CV.belongsTo(models.User, { foreignKey: 'userId' });
      CV.hasMany(models.AnalysisHistory, { foreignKey: 'cvId' });
    }
  }
  CV.init({
    fileName: DataTypes.STRING,
    originalName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Original file name is required." },
        notEmpty: { msg: "Original file name cannot be empty." }
      }
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "File URL is required." },
        notEmpty: { msg: "File URL cannot be empty." },
        isUrl: { msg: "A valid File URL must be provided." }
      }
    },
    fileSize: DataTypes.INTEGER,
    atsScore: DataTypes.INTEGER,
    analysisData: DataTypes.JSON,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "CV must be associated with a user." }
      }
    }
  }, {
    sequelize,
    modelName: 'CV',
  });
  return CV;
};