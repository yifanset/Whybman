const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const router = express.Router();

// Настройка SQLite для дефектов
const defectsDb = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../databases/defects.db'),
  logging: false
});

// Модели для дефектов
const DefectImage = defectsDb.define('DefectImage', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  filename: DataTypes.STRING,
  processedImage: DataTypes.STRING,
  matchPercent: DataTypes.INTEGER,
  confidence: DataTypes.INTEGER
});

const Defect = defectsDb.define('Defect', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type: DataTypes.STRING,
  region: DataTypes.STRING,
  correctionSvg: DataTypes.STRING
});

DefectImage.hasMany(Defect);
Defect.belongsTo(DefectImage);

// Инициализация с тестовыми данными
(async () => {
  await defectsDb.sync({ force: true });
  
  const image = await DefectImage.create({
    filename: 'image1.jpg',
    processedImage: '/images/image1.jpg',
    matchPercent: 87,
    confidence: 95
  });
  
  await Defect.bulkCreate([
    {
      type: 'царапина',
      region: 'верхний левый угол',
      correctionSvg: '/svg/defect_101.svg',
      DefectImageId: image.id
    },
    {
      type: 'пятно',
      region: 'центр',
      correctionSvg: '/svg/defect_102.svg',
      DefectImageId: image.id
    }
  ]);
})();

// Роут для получения данных
router.get('/', async (req, res) => {
  try {
    const images = await DefectImage.findAll({
      include: [Defect]
    });

    const response = images.map(image => ({
      id: image.id,
      filename: image.filename,
      processedImage: image.processedImage,
      matchPercent: image.matchPercent,
      confidence: image.confidence,
      defects: image.Defects.map(defect => ({
        id: defect.id,
        type: defect.type,
        region: defect.region,
        correctionSvg: defect.correctionSvg
      }))
    }));

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;