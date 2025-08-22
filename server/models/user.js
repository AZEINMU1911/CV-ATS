'use strict';
const { Model } = require('sequelize');
const { hashPwd } = require('../utils/utils');


module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.hasMany(models.CV, { foreignKey: 'userId' });
      User.hasMany(models.AnalysisHistory, { foreignKey: 'userId' });
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "First name cannot be empty" },
        notEmpty: { msg: "First name cannot be empty" }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Last name cannot be empty" },
        notEmpty: { msg: "Last name cannot be empty" }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "An account with this email already exists."
      },
      validate: {
        notNull: { msg: "Email cannot be empty." },
        notEmpty: { msg: "Email cannot be empty." },
        isEmail: { msg: "Please provide a valid email address." },
      }
    },

    password: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        checkPassword(value) {
          if (!this.googleId) {
            if (!value) {
              throw new Error("Password is required")
            }
            if (value.length < 6) {
              throw new Error("Password must be atleast 6 characters")
            }
          }
        }
      }
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {

      beforeCreate: (user, options) => {
        if (user.password) {
          user.password = hashPwd(user.password);
        }
      },

      beforeUpdate: (user, options) => {
        if (user.changed('password') && user.password) {
          user.password = hashPwd(user.password);
        }
      }
    }
  });
  return User;
};