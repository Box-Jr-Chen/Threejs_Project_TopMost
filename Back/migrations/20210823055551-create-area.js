'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('areas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_wavehouse: {
        type: Sequelize.INTEGER,
        references: {
          model: 'warehouses',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      title:{
        type: Sequelize.STRING
      },
      borders: {
        type: Sequelize.TEXT
      },
      data_rect_position: {
        type: Sequelize.TEXT
      },
      data_rect: {
        type: Sequelize.TEXT
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('areas');
  }
};