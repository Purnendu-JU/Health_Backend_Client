const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  razorpayOrderId: String,
  paymentId: String,
  signature: String,
  productName: String,
  amount: Number,
  dispatchStatus: {
    type: String,
    default: "Pending"
  },
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  customerAddress: String
});

module.exports = mongoose.model("Order", OrderSchema);
