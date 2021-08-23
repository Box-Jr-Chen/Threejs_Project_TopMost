'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class setting_area_interval extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  setting_area_interval.init({
    interval: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'setting_area_interval',
  });
  return setting_area_interval;
};