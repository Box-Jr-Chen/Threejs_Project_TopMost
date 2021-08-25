'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
    await queryInterface.bulkDelete("setting_projects",null,{restartIdentity: true});

    await queryInterface.sequelize.query("ALTER TABLE setting_projects AUTO_INCREMENT = 1;");

    return await queryInterface.bulkInsert(
      "setting_projects",
      [
        {
          title:"貨物01",
          img:"./sss.png",
          width:730,
          length:905, 
          height:200      
        },
        {
          title:"貨物02",
          img:"./sss.png",
          width:395,
          length:555, 
          height:200      
        },
        {
          title:"貨物03",
          img:"./sss.png",
          width:330,
          length:460, 
          height:200      
        },
        {
          title:"貨物04",
          img:"./sss.png",
          width:285,
          length:425, 
          height:200      
        },
      ]
    );
  },

  down: async (queryInterface, Sequelize) => {
     return await queryInterface.bulkDelete("setting_projects",null,{});
  }
};
