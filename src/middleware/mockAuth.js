module.exports = (req, res, next) => {
  // Simule un utilisateur connecté
  req.user = { email: 'user1@gmail.com', admin: false }; // ou false pour test
  next();
};