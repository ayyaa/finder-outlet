/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('page_views', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    outlet_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: true,
      references: {
        model: 'outlets',
        key: 'id'
      }
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    visit_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    lat_lng: {
      type: "POINT",
      allowNull: true
    }
  }, {
    tableName: 'page_views'
  });
};
