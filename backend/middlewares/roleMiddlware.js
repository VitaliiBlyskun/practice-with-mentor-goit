const jwt = require("jsonwebtoken");
const UserModel = require("../models/usersModel");

module.exports = (rolesArray) => {
  return async (request, response, next) => {
    try {
      const [Bearer, token] = request.headers.authorization.split(" ");

      if (token && Bearer === "Bearer") {
        const decodedData = jwt.verify(token, "pretty_boy");
        const user = await UserModel.findById(decodedData.id);

        let hasRole = false;
        const findRole = user.roles.find((item) => rolesArray.includes(item));
        if (findRole) {
          hasRole = true;
        }
        if (!findRole) {
          response.status(403).json({
            code: 403,
            message: "No permission",
          });
        }
        next();
      }
    } catch (error) {
      return response.status(403).json({
        code: 403,
        message: "No permission",
      });
    }
  };
};
