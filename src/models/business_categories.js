/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('business_categories', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    business_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    category_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'business_categories'
  });
};
