const jwt = require("jsonwebtoken");

module.exports = (request, response, next) => {
  // зчитуємо токен із заголовків
  // перевіряємо чи переданий токен і чи це токен авторизації (bearer)
  // розшифровуємо токен
  // якшо токен валідний, то request.user = user
  // якшо токен невалідний то повертаємо помилку шо токен не авторизований

  try {
    // const token  = request.headers.authorization.split(' ');
    const [Bearer, token] = request.headers.authorization.split(" ");

    if (token && Bearer === "Bearer") {
      const decodedData = jwt.verify(token, "pretty_boy");
      //   console.log("decodedData", decodedData)

      //  return response.status(200).json({
      //     code: 200,
      //     message: "Token is valid",
      //   });

        request.user = decodedData;
        next();
    }
  } catch (error) {
    return response.status(403).json({
      code: 403,
      message: "Not authorize",
    });
  }
};
