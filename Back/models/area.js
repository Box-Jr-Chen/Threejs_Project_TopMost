'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class area extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  area.init({
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    }, 
    id_warehouse: DataTypes.INTEGER,
    title: DataTypes.STRING,
    borders: DataTypes.TEXT,
    width: DataTypes.INTEGER,
    length: DataTypes.INTEGER,
    pos_init:DataTypes.TEXT,
    interval:DataTypes.INTEGER
  }, {
    sequelize,
    createdAt:false,
    updatedAt:false,
    modelName: 'area',
  });

  area.associate = (models)=>{
       
      models.warehouse.hasMany(area,{
        as:'id_warehouse',
        foreignKey:{
          type:DataTypes.INTEGER,
          allowNull:false,
          name:'id_warehouse',
        },
        targetKey: 'id'
      });

      area.belongsTo(models.warehouse,{
        foreignKey: 'id_warehouse'
    }); 
  }


  return area;
};