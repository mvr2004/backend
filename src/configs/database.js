require('dotenv').config();
const Sequelize = require('sequelize');

//credenciais para entrar na Base de dados
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false 
      }
    }
  }
);

//Ver se a conexão da BD está ativa
sequelize.authenticate()
  .then(() => {
    console.log('Conexão a BD estabelecida com sucesso.');
  })
  .catch(err => {
    console.error('Não foi possível conectar a Base de Dados:', err);
  });

module.exports = sequelize;
