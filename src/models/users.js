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
      defaultValue: 'Owner'
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
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'photo-1527578948144.png'
    },
    role: {
      type: DataTypes.ENUM('ADMIN','BUSINESS OWNER'),
      allowNull: false,
      defaultValue: 'BUSINESS OWNER'
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
      allowNull: false,
      defaultValue: 1
    },
    fa_status: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 0
    },
    fa_key: {
      type: DataTypes.CHAR(50),
      allowNull: true

    },
    ip_address: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: '*'
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
    },
    url_qr: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    temp_email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    temp_photo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
  }, {
    tableName: 'users'
  });
};
