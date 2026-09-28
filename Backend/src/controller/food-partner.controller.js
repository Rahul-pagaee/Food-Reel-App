const foodPartnerModel = require("../models/foodPartner.model.js");
const foodModel = require("../models/food.model.js");

const getFoodPartnerProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await foodPartnerModel.findById(id).select("-password");
    if (!partner) {
      return res.status(404).json({ message: "Food partner not found" });
    }
    const foods = await foodModel.find({ foodPartner: id });
    return res.status(200).json({
      message: "Food partner profile fetched successfully",
      partner,
      foods,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
};

const getLoggedPartnerProfile = async (req, res) => {
  try {
    const partner = req.foodPartner;
    if (!partner) {
      return res.status(404).json({ message: "Food partner not found" });
    }
    const foods = await foodModel.find({ foodPartner: partner._id });
    return res.status(200).json({
      message: "Food partner profile fetched successfully",
      partner: {
        _id: partner._id,
        name: partner.name,
        contactName: partner.contactName,
        phone: partner.phone,
        address: partner.address,
        email: partner.email,
      },
      foods,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
};

module.exports = {
  getFoodPartnerProfile,
  getLoggedPartnerProfile,
};
