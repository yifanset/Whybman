const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Подключение к defects.db

const DefectImage = sequelize.define('DefectImage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  processedImage: {
    type: DataTypes.STRING,
    allowNull: false
  },
  matchPercent: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0, max: 100 }
  },
  confidence: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0, max: 100 }
  }
}, {
  timestamps: true // Добавляет createdAt и updatedAt
});

module.exports = DefectImage;