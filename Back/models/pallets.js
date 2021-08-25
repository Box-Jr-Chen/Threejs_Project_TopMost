'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pallets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  pallets.init({
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    id_warehouse: DataTypes.INTEGER,
    id_areas: DataTypes.INTEGER,
    id_pallet: DataTypes.INTEGER,
    id_project: DataTypes.INTEGER,
    pos: DataTypes.TEXT,
    layout: DataTypes.INTEGER,
    remove:DataTypes.BOOLEAN ,
    createdAt:DataTypes.DATE,
    updatedAt:DataTypes.DATE,
  }, {
    sequelize,
    timestamps: false,
    modelName: 'pallets',
  });


  pallets.associate = (models)=>{

    models.warehouse.hasMany(pallets,{
      foreignKey:{
        type:DataTypes.INTEGER,
        allowNull:false,
        name:'id_warehouse',
      },
      targetKey: 'id'
    });

    pallets.belongsTo(models.warehouse,{
      foreignKey: 'id_warehouse'
    });
  
  
    models.area.hasMany(pallets,{
      foreignKey:{
        type:DataTypes.INTEGER,
        allowNull:false,
        name:'id_areas',
      },
      targetKey: 'id'
    });

    pallets.belongsTo(models.area,{
      foreignKey: 'id_areas'
    });


    models.setting_pallet.hasMany(pallets,{
      foreignKey:{
        type:DataTypes.INTEGER,
        allowNull:false,
        name:'id_pallet',
      },
      targetKey: 'id'
    });

    pallets.belongsTo(models.setting_pallet,{
      foreignKey: 'id_pallet'
    });

    models.setting_project.hasMany(pallets,{
      foreignKey:{
        type:DataTypes.INTEGER,
        allowNull:false,
        name:'id_project',
      },
      targetKey: 'id'
    });

    pallets.belongsTo(models.setting_project,{
      foreignKey: 'id_project'
    });

}



  return pallets;
};