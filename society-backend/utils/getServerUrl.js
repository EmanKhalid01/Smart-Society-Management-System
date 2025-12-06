module.exports = function getServerUrl(req) {
  return `http://192.168.100.6:${process.env.PORT || 5000}`;
};
