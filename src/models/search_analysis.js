/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('search_analysis', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    keyword: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    search_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'search_analysis'
  });
};
