const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Upload = sequelize.define('Upload', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  files: {
    type: DataTypes.JSON, // Храним массив файлов как JSON
    allowNull: false
  },
  defectTypes: {
    type: DataTypes.JSON, // Храним массив defectTypes как JSON
    allowNull: false
  }
});

module.exports = Upload;