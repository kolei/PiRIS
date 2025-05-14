'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('MenuItem', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      title: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        comment: 'название блюда'
      },
      image: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        comment: 'название файла с изображением блюда'
      },
      description: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
        comment: 'описание блюда'
      },
      price: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('MenuItem')
  }
}
