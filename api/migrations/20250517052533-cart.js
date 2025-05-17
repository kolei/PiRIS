'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Cart', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      menuItemId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        comment: 'для внешнего ключа'
      },
      quantity: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        comment: 'количество'
      }
    })

    /**
     * Внешний ключ корзина_блюдо
     */
    await queryInterface.addConstraint('Cart', {
      fields: ['menuItemId'],
      type: 'foreign key',
      name: 'FK_cart_menu-item',
      references: {
          table: 'MenuItem',
          field: 'id'
      },
      onDelete: 'no action',
      onUpdate: 'no action'
    })

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Cart', 'FK_cart_menu-item')
    await queryInterface.dropTable('Cart')
  }
}
