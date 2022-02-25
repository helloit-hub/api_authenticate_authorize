const jwt = require("jsonwebtoken");
const mongoUserModel = require("../model/user");
require("dotenv").config();

const auth = async (req, res, next) => {
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await mongoUserModel
        .findOne({ email: verifiedToken.email })
        .select("-password");
    }
    if (!token) {
      res.status(401).json({ message: "no token" });
    }
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(401);
  }
};

module.exports = auth;
