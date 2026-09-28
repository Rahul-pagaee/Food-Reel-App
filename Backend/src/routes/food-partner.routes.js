const express = require("express");
const foodPartnerController = require("../controller/food-partner.controller");

const router = express.Router();

router.get("/profile/:id", foodPartnerController.getFoodPartnerProfile);

module.exports = router;
