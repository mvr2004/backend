// src/app.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const sequelize = require('./config/dbConfig');
const errorHandler = require('./middleware/errorHandler');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.get('/', (req, res) => {
  res.send('API está a funcionar. Acesse /api/data para obter dados.');
});

app.get('/health', (req, res) => {
  res.send('API está funcionando corretamente.');
});

app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file);
  res.send('Arquivo enviado com sucesso!');
});

app.use(errorHandler);

const port = process.env.PORT || 3000;
sequelize.sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor está a funcionar em http://localhost:${port}`);
    });
  })
  .catch(err => console.log(err));

module.exports = app;
