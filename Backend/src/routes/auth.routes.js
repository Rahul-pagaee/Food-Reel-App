const express = require("express");
const authController = require("../controller/auth.controller");
const router = express.Router();

/**
 * ==========================================
 * USER AUTHENTICATION ROUTES
 * ==========================================
 */
router.post("/user/register", authController.registerController);
router.post("/user/login", authController.loginController);
router.get("/user/logout", authController.logoutController);

/**
 * ==========================================
 * FOOD PARTNER AUTHENTICATION ROUTES
 * ==========================================
 */
router.post("/food-partner/register", authController.registerFoodPartner);
router.post("/food-partner/login", authController.loginFoodPartner);
router.get("/food-partner/logout", authController.logoutFoodPartner);

module.exports = router;
