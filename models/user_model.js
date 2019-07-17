const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  id: String,
  address: String,
  description: String,
  pricing: {
    price: String,
    date: String
  }
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = { UserModel, UserSchema };
