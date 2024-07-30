const express = require('express');
const path = require('path');
const app = express();

//bd
const sequelize = require('./configs/database'); 

//declarar routes
const adminRoutes = require('./routes/adminRoutes');
const centroRoutes = require('./routes/centroRoutes');
const reportRoutes = require('./routes/reportRoutes');
const userRoutes = require('./routes/userRoutes');
const areaRoutes = require('./routes/areasubareaRoutes');
const estabelecimentoRoutes = require('./routes/estabelecimentoRoutes');
const eventoRoutes = require('./routes/eventoRoutes');

//Configurações
app.set('port', process.env.PORT || 3000);

// Middleware para servir arquivos estáticos na pasta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // Modificado para garantir o caminho correto

//Middlewares
app.use(express.json());

// Configuração de headers CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Rotas
app.use('/admin', adminRoutes);
app.use('/centro', centroRoutes);
app.use('/report', reportRoutes);
app.use('/user', userRoutes);
app.use('/area', areaRoutes);
app.use('/estabelecimento', estabelecimentoRoutes);
app.use('/eventos', eventoRoutes);

app.use('/teste', (req, res) => {
    res.send("Rota TESTE.");
});

app.use('/', (req, res) => {
    res.send("Hello World");
});

// Sincroniza os modelos com a base de dados
sequelize.sync({ alter: true })
  .then(() => {
    app.listen(app.get('port'), () => {
      console.log(`Servidor iniciado na porta ${app.get('port')}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao sincronizar com a base de dados:', error);
  });

// multer:configurations
const multer = require('multer');

// Configuração do armazenamento de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads')); // Modificado para garantir o caminho correto
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Nome do arquivo no destino
  }
});

// Instância do multer com as configurações
const upload = multer({ storage });

module.exports = upload;
