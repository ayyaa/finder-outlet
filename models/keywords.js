/* jshint indent: 2 */

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
    }
  }, {
    tableName: 'keywords'
  });
};
