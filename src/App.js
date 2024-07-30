const express = require('express');
const passport = require('./configs/passport');
const session = require('express-session');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const genericRoutes = require('./routes/genericRoutes');
const areaRoutes = require('./routes/areaRoutes');
const estabRoutes = require('./routes/estabelecimentoRoutes');
const eventRoutes = require('./routes/eventoRoutes');
const partRoutes = require('./routes/participacaoRoutes');
const sequelize = require('./configs/database');
const errorHandler = require('./middleware/errorHandler');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');

dotenv.config();

const app = express();

app.set('port', process.env.PORT || 3000);

// Middleware para servir arquivos estáticos na pasta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Middlewares
app.use(express.json());
app.use(cors());

// Configuração de headers CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Rotas
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/generic', genericRoutes);
app.use('/estab', estabRoutes);
app.use('/areas', areaRoutes);
app.use('/envt', eventRoutes);
app.use('/part', partRoutes);

app.get('/', (req, res) => {
    res.send('API está a funcionar. Acesse /api/data para obter dados.');
});

app.get('/health', (req, res) => {
    res.send('API está funcionando corretamente.');
});

// Configuração do armazenamento de arquivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public/uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Nome do arquivo no destino
    }
});

// Instância do multer com as configurações
const upload = multer({ storage });
app.use(upload.single('file')); // Middleware para upload de arquivos

// Configuração de sessões
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Middleware de tratamento de erros
app.use(errorHandler);

// Sincroniza os modelos com a base de dados e inicia o servidor
sequelize.sync({ alter: true })
    .then(() => {
        app.listen(app.get('port'), () => {
            console.log(`Servidor está a funcionar em http://localhost:${app.get('port')}`);
        });
    })
    .catch(err => {
        console.error('Erro ao sincronizar com a base de dados:', err);
    });

module.exports = app;
