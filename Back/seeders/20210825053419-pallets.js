'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete("pallets",null,{restartIdentity: true});

    await queryInterface.sequelize.query("ALTER TABLE pallets AUTO_INCREMENT = 1;");


    return await queryInterface.bulkInsert(
      "pallets",
      [
        {
          id_warehouse:1,
          id_areas:0,
          id_pallet:1,
          id_project:1, 
          pos:"",
          layout:0,
          remove:0,
        },
        {
          id_warehouse:1,
          id_areas:0,
          id_pallet:1,
          id_project:1, 
          pos:"",
          layout:0,
          remove:0,
        },
        {
          id_warehouse:1,
          id_areas:0,
          id_pallet:1,
          id_project:1, 
          pos:"",
          layout:0,
          remove:0,
        }
      ]
    );

  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete("pallets",null,{});
  }
};
