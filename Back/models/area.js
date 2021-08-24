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
    id_wavehouse: DataTypes.INTEGER,
    title: DataTypes.STRING,
    borders: DataTypes.TEXT,
    data_rect_position: DataTypes.TEXT,
    data_rect: DataTypes.TEXT
  }, {
    sequelize,
    createdAt:false,
    updatedAt:false,
    modelName: 'area',
  });

  area.associate = (models)=>{
       
      models.warehouse.hasMany(area,{
        as:'id_wavehouse',
        foreignKey:{
          type:DataTypes.INTEGER,
          allowNull:false,
          name:'id_wavehouse',
        },
        targetKey: 'id'
      });

      area.belongsTo(models.warehouse,{
        foreignKey: 'id_wavehouse'
    }); 
  }


  return area;
};