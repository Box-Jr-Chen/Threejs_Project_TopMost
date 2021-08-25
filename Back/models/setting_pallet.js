'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class setting_pallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  setting_pallet.init({
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    }, 
    title: DataTypes.STRING,
    img: DataTypes.TEXT,
    width: DataTypes.INTEGER,
    length: DataTypes.INTEGER,
    height: DataTypes.INTEGER
  }, {
    sequelize,
    createdAt:false,
    updatedAt:false,
    modelName: 'setting_pallet',
  });
  return setting_pallet;
};