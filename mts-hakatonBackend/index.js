const express = require('express');
const cors = require('cors');
const path = require('path');

// Инициализация сервера
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Подключение роутов
const uploadRoutes = require('./routes/uploadRoutes');
const defectRoutes = require('./routes/defectRoutes');

app.use('/api/uploads', uploadRoutes);
app.use('/api/defects', defectRoutes);

// Статика для файлов
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/svg', express.static(path.join(__dirname, 'svg')));

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});