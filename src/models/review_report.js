/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('review_report', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    review_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    report_type: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: ''
    }
  }, {
    tableName: 'review_report'
  });
};
