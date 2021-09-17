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
     await queryInterface.bulkDelete("warehouses",null,{});

     //重新開始1
     return await queryInterface.sequelize.query("ALTER TABLE warehouses AUTO_INCREMENT = 1;");

    //  return await queryInterface.bulkInsert(
    //   "warehouses",
    //   [
    //     {
    //       title:"騰升工廠 01",
    //       borders:"["+
    //       "[-420,60], "+
    //       "[-420,-140],"+
    //       "[ 320,-140],"+
    //       "[ 320,60],"+
    //       "[ 280,60],"+
    //       "[ 280,200],"+
    //       "[ 130,200],"+
    //       "[ 130,60],"+
    //       "[-420,60]"+
    //       "]",

    //     }
    //   ],
    //   {autoIncrement: true, restartIdentity: true}
    // );

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

     return await queryInterface.bulkDelete("warehouses",null,{});
  }
};
