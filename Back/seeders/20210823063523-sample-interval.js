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
     await queryInterface.bulkDelete("setting_area_intervals",null,{});

     await queryInterface.sequelize.query("ALTER TABLE setting_area_intervals AUTO_INCREMENT = 1;");

     return await queryInterface.bulkInsert(
      "setting_area_intervals",
      [
        {
          interval:10,
        }
      ]
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

     return await queryInterface.bulkDelete("setting_area_intervals",null,{});
  }
};
