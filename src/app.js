const express = require('express');
const passport = require('./config/passport');
const session = require('express-session');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const genericRoutes = require('./routes/genericRoutes');  // Importação correta de genericRoutes
const sequelize = require('./config/dbConfig');
const errorHandler = require('./middleware/errorHandler');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/generic', genericRoutes);  // Utilização de genericRoutes

app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('API está a funcionar. Acesse /api/data para obter dados.');
});

app.get('/health', (req, res) => {
  res.send('API está funcionando corretamente.');
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
