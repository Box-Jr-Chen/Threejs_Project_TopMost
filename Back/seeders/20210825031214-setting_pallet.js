'use strict';
//單位mm
module.exports = {
  up: async (queryInterface, Sequelize) => {
  
    await queryInterface.bulkDelete("setting_pallets",null,{restartIdentity: true});

    await queryInterface.sequelize.query("ALTER TABLE setting_pallets AUTO_INCREMENT = 1;");

    return await queryInterface.bulkInsert(
      "setting_pallets",
      [
        {
          title:"棧板01",
          img:"./sss.png",
          width:1500,
          length:1500, 
          height:150      
        },
      ]
    );

  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete("setting_pallets",null,{});
  }
};
