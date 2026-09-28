const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "token is required for blackLising"],
    },
  },
  {
    timestamps: true,
  },
);

const blacklistModel = mongoose.model("blackList", blacklistSchema);

module.exports = blacklistModel;
