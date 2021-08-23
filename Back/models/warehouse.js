'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class warehouse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  warehouse.init(
    {
      id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      }, 
      title:DataTypes.TEXT,
      borders: DataTypes.TEXT
    }, 
    {
      sequelize,
      createdAt:false,
      updatedAt:false,
      modelName: 'warehouse',
      tableName: 'warehouses',
  });
  return warehouse;
};