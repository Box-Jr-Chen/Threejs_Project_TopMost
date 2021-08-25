'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pallets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id: {
        type: Sequelize.INTEGER
      },
      id_warehouse: {
        type: Sequelize.INTEGER
      },
      id_areas: {
        type: Sequelize.INTEGER
      },
      id_pallet: {
        type: Sequelize.INTEGER
      },
      id_project: {
        type: Sequelize.INTEGER
      },
      pos: {
        type: Sequelize.TEXT
      },
      layout: {
        type: Sequelize.INTEGER
      },
      remove:{
        type:Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
        type: Sequelize.DATE
      },
      updatedAt: {
        defaultValue: Sequelize.fn('now'),
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pallets');
  }
};