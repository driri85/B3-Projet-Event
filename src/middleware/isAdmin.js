module.exports = (req, res, next) => {
  if (!req.user || !req.user.admin) {
    return res.status(403).json({ message: "Accès interdit : admin requis" });
  }
  next();
};