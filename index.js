const dotenv = require('dotenv');
dotenv.config();
const app = require('./src/app');
const port = process.env.PORT || 3000;
