const express = require('express');
const passport = require('./config/passport');
const session = require('express-session');
const cors = require('cors');
const multer = require('multer');
const sharp = require('sharp'); // Importar sharp para manipulação de imagens
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const genericRoutes = require('./routes/genericRoutes');
const sequelize = require('./config/dbConfig');
const errorHandler = require('./middleware/errorHandler');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Configuração do Multer com sharp para redimensionar imagens
const storage = multer.memoryStorage(); // Usar memoryStorage para trabalhar com buffers de imagem
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {  // This should be 'image/' instead of 'uploads/'
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos de imagem são permitidos.'));
    }
  }
});


app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/generic', genericRoutes);


app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
  res.send('API está a funcionar. Acesse /api/data para obter dados.');
});

app.get('/health', (req, res) => {
  res.send('API está funcionando corretamente.');
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Redimensionar a imagem usando sharp
    const resizedImage = await sharp(req.file.buffer)
      .resize({ width: 300, height: 300 })
      .toBuffer();

    // Salvar a imagem redimensionada
    const filename = Date.now() + '-' + req.file.originalname;
    const filepath = path.join(__dirname, 'uploads/', filename);
    await sharp(resizedImage).toFile(filepath);

    console.log('Arquivo enviado:', filename);
    res.send('Arquivo enviado com sucesso!');
  } catch (err) {
    console.error('Erro ao processar imagem:', err);
    res.status(500).send('Erro ao processar imagem');
  }
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
  
  
  
  

module.exports = { app, upload };;
