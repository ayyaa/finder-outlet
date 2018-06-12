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
    administrative_area_1: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    administrative_area_2: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    administrative_area_3: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    administrative_area_4: {
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
    tableName: 'address'
  });
};
