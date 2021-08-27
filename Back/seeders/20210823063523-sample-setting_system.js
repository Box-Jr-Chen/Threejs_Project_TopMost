'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     //await queryInterface.bulkDelete("setting_area_intervals",null,{truncate: true, restartIdentity: true});
     await queryInterface.bulkDelete("setting_systems",null,{});

     await queryInterface.sequelize.query("ALTER TABLE setting_systems AUTO_INCREMENT = 1;");

     return await queryInterface.bulkInsert(
      "setting_systems",
      [
        {
          interval:10,
          sort_amount:10
        }
      ]
    );
  },

  down: async (queryInterface, Sequelize) => {

     return await queryInterface.bulkDelete("setting_systems",null,{});
  }
};
