function buildAPIResponse(status, message, data) {
  return { status, message, data };
}

module.exports = { buildAPIResponse };