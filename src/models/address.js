/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('address', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    line1: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    line2: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    prov: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    postalcode: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    point: {
      type: "POINT",
      allowNull: true
    }
  }, {
    tableName: 'address'
  });
};
