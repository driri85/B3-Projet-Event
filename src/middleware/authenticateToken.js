const jwt = require('jsonwebtoken');

module.exports = function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token requis' });

  jwt.verify(token, process.env.SECRET_JWT, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalide' });

    req.user = user;
    next();
  });
};
