const foodPartnerModel = require("../models/foodPartner.model");
const userModel = require("../models/user.model.js");
const jwt = require("jsonwebtoken");

async function authfoodPartnerMiddleware(req, res, next) {
  const authorization = req.get("authorization");
  const bearerToken = authorization?.startsWith("Bearer ")
    ? authorization.slice(7).trim()
    : null;
  const token = req.cookies.token || bearerToken;
  if (!token) {
    return res.status(401).json({
      message: "Please Login First",
    });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_KEY);
    const foodPartner = await foodPartnerModel.findById(decode._id);
    req.foodPartner = foodPartner;
    if (!foodPartner || foodPartner == null) {
      return res.status(404).json({ message: "you are not a foodPartner" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "invalid token" });
  }
}

async function authUserMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Please Login First",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await userModel.findById(decoded._id);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "invalid token" });
  }
}

module.exports = { authfoodPartnerMiddleware, authUserMiddleware };
