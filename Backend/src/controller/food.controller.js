const foodModel = require("../models/food.model.js");
const imagekit = require("../services/storage.service");
const likeModel = require("../models/like.model.js");
const saveModel = require("../models/save.model.js");

const createFood = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !req.file) {
      return res.status(400).json({
        message: "Name and Video/Image file are required",
      });
    }

    const uploadResult = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
    });

    const newFood = await foodModel.create({
      name,
      description,
      video: uploadResult.url,
      foodPartner: req.foodPartner._id,
    });

    return res.status(201).json({
      message: "Food created successfully",
      food: newFood,
    });
  } catch (error) {
    console.log("ImageKit Error:", error);

    return res.status(500).json({
      message: "Error uploading file",
      error: error.message,
    });
  }
};

const getAllFood = async (req, res) => {
  try {
    const foodItems = await foodModel
      .find({})
      .populate("foodPartner", "name contactName phone address email");
    res.status(200).json({
      message: "all fooditems fetched successfully",
      foodItems,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching food items", error: error.message });
  }
};

const likeFoodItem = async (req, res) => {
  try {
    const { foodId } = req.body;
    const userId = req.user._id;

    // Check if user already liked this food
    const isAlreadyLiked = await likeModel.findOne({
      food: foodId,
      user: userId,
    });

    let isLiked = false;

    if (isAlreadyLiked) {
      // Dubara click kiya => Unlike (delete like)
      await likeModel.deleteOne({ _id: isAlreadyLiked._id });
      isLiked = false;
    } else {
      // Pehli baar click kiya => Like (create like)
      await likeModel.create({
        user: userId,
        food: foodId,
      });
      isLiked = true;
    }

    // Direct database se total likes count lena (never negative, always accurate)
    const totalLikes = await likeModel.countDocuments({ food: foodId });
    await foodModel.findByIdAndUpdate(foodId, { likeCount: totalLikes });

    return res.status(200).json({
      message: isLiked
        ? "Food item liked successfully"
        : "Food item unliked successfully",
      isLiked,
      likeCount: totalLikes,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error liking food item",
      error: error.message,
    });
  }
};

const saveFoodItem = async (req, res) => {
  try {
    const { foodId } = req.body;
    const userId = req.user._id;

    const isAlreadySaved = await saveModel.findOne({
      user: userId,
      food: foodId,
    });

    let isSaved = false;

    if (isAlreadySaved) {
      await saveModel.deleteOne({
        _id: isAlreadySaved._id,
      });
      isSaved = false;
    } else {
      await saveModel.create({
        user: userId,
        food: foodId,
      });
      isSaved = true;
    }

    const totalSaves = await saveModel.countDocuments({ food: foodId });
    await foodModel.findByIdAndUpdate(foodId, {
      saveCount: totalSaves,
    });

    return res.status(200).json({
      message: isSaved
        ? "Food saved successfully"
        : "Food unsaved successfully",
      isSaved,
      saveCount: totalSaves,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error saving food item",
      error: error.message,
    });
  }
};

const getSavedFood = async (req, res) => {
  try {
    const userId = req.user._id;

    const savedFoods = await saveModel.find({ user: userId }).populate("food");

    if (!savedFoods || savedFoods.length === 0) {
      return res.status(404).json({
        message: "No saved food found",
        savedFoods: [],
      });
    }

    return res.status(200).json({
      message: "Saved foods retrieved successfully",
      savedFoods,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching saved foods",
      error: error.message,
    });
  }
};

module.exports = {
  createFood,
  getAllFood,
  likeFoodItem,
  saveFoodItem,
  getSavedFood,
};
