'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('MenuItem', [   
      {id: 1, title: 'Салат', image: 'Салат.jpg', price: 100},
      {id: 2, title: 'Суп', image: 'Суп.jpg', price: 100},
      {id: 3, title: 'Компот', image: 'Компот.jpg', price: 100}
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('MenuItem', null /* тут можно прописать условие WHERE */)
  }
}
