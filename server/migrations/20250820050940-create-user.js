'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull : true
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull : true
      },
      email: {
        type: Sequelize.STRING,
        unique : true,
        allowNull : false
      },
      password: {
        type: Sequelize.STRING,
        allowNull : true
      },
      googleId: {
        type: Sequelize.STRING,
        allowNull : true
      },
      isEmailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue : false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};