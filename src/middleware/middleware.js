const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = require('../configs/config').JWT_SECRET_KEY;

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
