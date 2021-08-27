'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class setting_system extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  setting_system.init({
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    }, 
    interval: DataTypes.INTEGER,
    sort_amount: DataTypes.INTEGER
  }, {
    sequelize,
    createdAt:false,
    updatedAt:false,
    modelName: 'setting_system',
    tableName:'setting_systems'
  });
  return setting_system;
};