import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new Error("Invalid authorization header", 401));
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, payload) => {
    if (err) {
        return next(new Error("Forbidden", 403));
    }
    
    req.user = payload;
    next();
  });
};
