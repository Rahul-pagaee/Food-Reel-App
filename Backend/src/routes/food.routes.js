const { Router } = require("express");
const foodController = require("../controller/food.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const multer = require("multer");

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

/**
 * @route POST /api/food/ [protected]
 * @description Create food item (Food Partner only)
 * @access Private
 */
router.post(
  "/",
  authMiddleware.authfoodPartnerMiddleware,
  upload.single("video"),
  foodController.createFood,
);

/**
 * @route GET /api/food/ [public]
 * @description Get all food items for reels feed (Public for all visitors)
 * @access Public
 */
router.get("/", foodController.getAllFood);

/**
 * @route Post /api/food/like
 * @description Like a food item (User only)
 * @access public
 */

router.post(
  "/like",
  authMiddleware.authUserMiddleware,
  foodController.likeFoodItem,
);

/**
 * @route POST /api/food/save
 * @description Save a food item (User only)
 * @access public
 */

router.post(
  "/save",
  authMiddleware.authUserMiddleware,
  foodController.saveFoodItem,
);


/**
 * @route GET /api/food/save
 * @description Get all saved food items for a user (User only)
 * @access public
 */

router.get("/save", authMiddleware.authUserMiddleware,foodController.getSavedFood)

module.exports = router;
