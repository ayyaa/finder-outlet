/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('business', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: ''
    },
    owner_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    address_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: true,
      references: {
        model: 'address',
        key: 'id'
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    website: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    contact_no: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'business'
  });
};
