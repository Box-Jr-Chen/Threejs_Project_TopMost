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
      id_warehouse: {
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
      width: {
        type: Sequelize.INTEGER
      },
      length: {
        type: Sequelize.INTEGER
      },
      pos_init: {
        type: Sequelize.TEXT
      },
      interval: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue:0
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('areas');
  }
};