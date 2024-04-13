module.exports = (request, response, next) => {
  response.status(404).json({
    code: 404,
    message: "Not Found",
  });
  next();
};
