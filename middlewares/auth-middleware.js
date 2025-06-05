import jwt from "jsonwebtoken";
import Flyuser from "../models/betUser.js";

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized HTTP, Token not provided" });
  }

  const jwtToken = token.replace("Bearer", "").trim();

  try {
    const isVerified = jwt.verify(jwtToken, process.env.TOKEN_SECRET_KEY);
    const userData = await Flyuser.findOne({ email: isVerified.email }).select({
      password: 0,
    });

    req.user = userData;
    req.token = token;
    req.userID = userData._id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized HTTP, Invalid or expired token" });
  }
};

export default authMiddleware;
