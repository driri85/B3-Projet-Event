const jwt = require('jsonwebtoken');
const { SECRET_JWT } = require('../core/config');

module.exports = function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token requis' });

  jwt.verify(token, SECRET_JWT, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalide' });

    req.user = user;
    next();
  });
};