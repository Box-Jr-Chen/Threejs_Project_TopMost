'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

  //  await queryInterface.bulkDelete("areas",null,{truncate: true, restartIdentity: true });
    await queryInterface.bulkDelete("areas",null,{restartIdentity: true});

    await queryInterface.sequelize.query("ALTER TABLE areas AUTO_INCREMENT = 1;");

    return await queryInterface.bulkInsert(
      "areas",
      [
        {
          id_warehouse:1,
          title:"區域 A",
          borders:"["+
                "[-410,     50],"+
                "[-410,    -130],"+
                "[-200,    -130],"+
                "[ -200,    50],"+
                "[-410,     50] "+
                "] ",
          width:0,
          length:0, 
          pos_init:""      
        },
        {
          id_warehouse:1,
          title:"區域 B",
          borders:"["+
                "[-160, 50], "+
                "[-160,-130],"+
                "[  20,-130],  "+
                "[  20,  50],  "+
                "[-160,  50]  "+
                  "] " ,
          width:0,
          length:0, 
          pos_init:""         
        },
        {
          id_warehouse:1,
          title:"區域 C",
          borders:"["+
                  "[60,50],"+
                  "[60,-130],"+
                  "[280,-130],"+
                  "[280,50],"+
                  "[60,50]"+
                  "] ",
          width:0,
          length:0, 
          pos_init:""     
        }
      ]
    );
  },

  down: async (queryInterface, Sequelize) => {
     return await queryInterface.bulkDelete("areas",null,{});
  }
};
