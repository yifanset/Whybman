const express = require('express');
const multer = require('multer');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const router = express.Router();

// Настройка SQLite для загрузок
const uploadsDb = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../databases/uploads.db'),
  logging: false
});

// Модель для загрузок
const Upload = uploadsDb.define('Upload', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  filename: DataTypes.STRING,
  path: DataTypes.STRING,
  url: DataTypes.STRING,
  defectTypes: DataTypes.JSON
});

// Инициализация БД
(async () => {
  await uploadsDb.sync();
})();

// Multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Роут для загрузки
router.post('/', upload.array('files'), async (req, res) => {
  try {
    const files = req.files;
    const defectTypes = req.body.defectTypes || [];

    const uploadedFiles = files.map(file => ({
      name: file.originalname,
      path: file.path,
      url: `http://localhost:5000/uploads/${file.filename}`
    }));

    await Upload.create({
      filename: files[0].originalname,
      path: uploadedFiles[0].path,
      url: uploadedFiles[0].url,
      defectTypes
    });

    res.json({ success: true, files: uploadedFiles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;