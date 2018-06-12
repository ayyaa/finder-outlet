/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('days', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    outlet_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    d1_open: {
      type: DataTypes.TIME,
      allowNull: true
    },
    d1_close: {
      type: DataTypes.TIME,
      allowNull: true
    },
    d2_close: {
      type: DataTypes.TIME,
      allowNull: true
    },
    d2_open: {
      type: DataTypes.TIME,
      allowNull: true
    },
    d3_open: {
      type: DataTypes.TIME,
      allowNull: true
    },
    d3_close: {
      type: DataTypes.TIME,
      allowNull: true
    },
    d4_open: {
      type: DataTypes.TIME,
      allowNull: true
    },
    d4_close: {
      type: DataTypes.TIME,
      allowNull: true
    },
    d5_open: {
      type: DataTypes.TIME,
      allowNull: true
    },
    d5_close: {
      type: DataTypes.TIME,
      allowNull: true
    },
    d6_open: {
      type: DataTypes.TIME,
      allowNull: true
    },
    d6_close: {
      type: DataTypes.TIME,
      allowNull: true
    },
    d7_open: {
      type: DataTypes.TIME,
      allowNull: true
    },
    d7_close: {
      type: DataTypes.TIME,
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
    tableName: 'days'
  });
};
