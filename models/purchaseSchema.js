const mongoose = require("mongoose");
var _uuid = require("uuid");

const purchaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  Pnumber: {
    type: Number,
    required: true,
  },
  orderData: {
    type: Array,
    required: true,
  },
  isRead: {
    type: Boolean,
    required: false,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    required: false,
    default: false,
  },
  purchasedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  transactionId:{
    required:false,
    type:String,
    default:''
  },
  _id: {
    type: String,
    default: mongoose.Types.ObjectId(),
  },
  deliveryType:{
    type: String,
    required:false
  }
});
const purchaseImgPath = "uploads/purchaseImages";

purchaseSchema.virtual("purchaseImgPath").get(function () {
  if (this.mainImg != null) {
    return path.join("/", purchaseImgPath);
  }
});
module.exports = mongoose.model("purchases", purchaseSchema);
module.exports.purchaseImgPath = purchaseImgPath;
