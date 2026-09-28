const userModel = require("../models/user.model.js");
const blacklistModel = require("../models/blacklist.model.js");
const foodPartnerModel = require("../models/foodPartner.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * @name RegisterUserController
 * @description register a new user, expects username email & paswword in the requirement
 * @access public
 */
const registerController = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({
      message: "Please Provide All Credentials",
    });
  }

  const isAlreadyExist = await userModel.findOne({
    $or: [{ fullName }, { email }],
  });

  if (isAlreadyExist) {
    return res.status(409).json({
      message: "An account already exists with this email.",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    fullName,
    email,
    password: hashPassword,
  });

  const token = await jwt.sign(
    { _id: user._id, email: user.email },
    process.env.JWT_KEY,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, { httpOnly: false, sameSite: "lax" });

  return res.status(201).json({
    message: "User Account is created",
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
    },
    token,
  });
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password." });
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = jwt.sign(
    { _id: user._id, email: user.email },
    process.env.JWT_KEY,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, { httpOnly: false, sameSite: "lax" });

  return res.status(200).json({
    message: "User Login Successfully",
    token,
  });
};

const logoutController = async (req, res) => {
  const token = req.cookies.token;

  if (token) {
    await blacklistModel.create({ token });
  }

  res.clearCookie("token");
  res.status(200).json({ message: "logout successfully" });
};

const registerFoodPartner = async (req, res) => {
  const { name, email, password, contactName, phone, address } = req.body;
  if (!name || !email || !password || !contactName || !phone || !address) {
    return res.status(401).json({
      message: "Please Provide All Credentials",
    });
  }
  const isAlreadyExist = await foodPartnerModel.findOne({
    $or: [{ name }, { email }],
  });
  if (isAlreadyExist) {
    return res.status(401).json({
      message: "Account alreay exist",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const foodPartner = await foodPartnerModel.create({
    name,
    email,
    contactName,
    phone,
    address,
    password: hashPassword,
  });

  const token = await jwt.sign(
    { _id: foodPartner._id, email: foodPartner.email },
    process.env.JWT_KEY,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, { httpOnly: false, sameSite: "lax" });

  res.status(201).json({
    message: "Account Created Successfully",
    foodPartner: {
      id: foodPartner._id,
      name: foodPartner.name,
      email: foodPartner.email,
      contactName: foodPartner.contactName,
      phone: foodPartner.phone,
      address: foodPartner.address,
    },
    token,
  });
};

const loginFoodPartner = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(402).json({ message: "Please Provide All Credentials" });
  }

  const foodPartner = await foodPartnerModel.findOne({ email });

  if (!foodPartner) {
    return res.status(402).json({ message: "This Account is not exist" });
  }

  const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

  if (!isPasswordValid) {
    return res.status(402).json({
      message: "Incorrct email % password",
    });
  }

  const token = await jwt.sign(
    { _id: foodPartner._id, email: foodPartner.email },
    process.env.JWT_KEY,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, { httpOnly: false, sameSite: "lax" });

  res.status(200).json({ message: "FoodPartner Login Successfully", token });
};

const logoutFoodPartner = async (req, res) => {
  const token = req.cookies.token;
  if (token) {
    await blacklistModel.create({ token });
  }
  res.clearCookie("token");

  res.status(200).json({
    message: "Account logout Successfully",
  });
};

module.exports = {
  registerController,
  loginController,
  logoutController,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
};
