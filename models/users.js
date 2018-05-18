/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ''
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ''
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    contact_no: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    photo: {
      type: "LONGBLOB",
      allowNull: true
    },
    rule: {
      type: DataTypes.ENUM('ADMIN','BO'),
      allowNull: false,
      defaultValue: 'BO'
    },
    password_token: {
      type: DataTypes.CHAR(50),
      allowNull: true
    },
    password_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    reg_token: {
      type: DataTypes.CHAR(50),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    2fa_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    2fa_key: {
      type: DataTypes.CHAR(50),
      allowNull: false,
      defaultValue: '*'
    },
    ip_address: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    dateadd: {
      type: DataTypes.DATE,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'users'
  });
};
