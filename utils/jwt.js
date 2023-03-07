
import jwt from "jsonwebtoken";
import ErrorHandler from "./errorHandler.js";

export const generateToken = (userInfo) => {
  return new Promise((resolve, reject) => {
    const user = {
      id: userInfo._id,
      username: userInfo.name,
    };

    const secret = process.env.ACCESS_TOKEN_SECRET_KEY;
    const options = {
      expiresIn: "7d",
    };
    jwt.sign(user, secret, options, (err, token) => {
      if (err) {
        reject(new ErrorHandler("Internal server error", 500))
      }
      resolve(token);
    });
  });
};