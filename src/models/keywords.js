/* jshint indent: 2 */
// const DataTypes = require('sequelize')

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('keywords', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    keyword: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    search_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'keywords'
  });
};
