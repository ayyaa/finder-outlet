/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('outlets', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    id_address: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: true,
      references: {
        model: 'address',
        key: 'id'
      }
    },

    id_bussines: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: true,
      references: {
        model: 'business',
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    contact_no: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    role_public_holiday: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    days_id: {
      type: DataTypes.INTEGER(11),
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
    tableName: 'outlets'
  });
};
