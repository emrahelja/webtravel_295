const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    default: "admin",
  },
  password: {
    type: String,
    required: true,
    default: "admin",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "admin",
  },
});

module.exports = mongoose.model("Admin", AdminSchema);
