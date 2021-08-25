'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class setting_project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  setting_project.init({
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
    modelName: 'setting_project',
  });
  return setting_project;
};