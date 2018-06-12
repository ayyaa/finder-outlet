/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('reviews', {
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
    rating: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: ''
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ver_token: {
      type: DataTypes.CHAR(30),
      allowNull: true
    },
    ip_address: {
      type: DataTypes.STRING(30),
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
    tableName: 'reviews'
  });
};
