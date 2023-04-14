const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  
});

module.exports = mongoose.model("adminUser", adminSchema);
