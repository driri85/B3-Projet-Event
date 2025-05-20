module.exports = (res, code, message, data = null) => {
  return res.status(code).json({
    code,
    message,
    data
  });
};