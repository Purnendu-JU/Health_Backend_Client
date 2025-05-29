require('dotenv').config();
const express = require('express');
const Razorpay = require('razorpay');
var Order = require('../models/Order.js');
const nodemailer = require('nodemailer');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


router.post("/create-order", fetchuser, async (req, res) => {
  const { amount, productName, customer } = req.body;
  if (!amount || !productName || !customer) {
    return res.status(400).json({ error: "Missing amount, product name, or customer info" });
  }

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json({ order });
  } 
  catch (err) {
    console.error("Error creating Razorpay order:", err.message);
    res.status(500).send("Order creation failed");
  }
});


router.post("/payment-success", fetchuser, async (req, res) => {
  const { razorpayOrderId, paymentDetails, productName, amount, customer } = req.body;

  try {
    const newOrder = new Order({
      user: req.user.id,
      razorpayOrderId,
      paymentId: paymentDetails.paymentId,
      signature: paymentDetails.signature,
      productName,
      amount,
      dispatchStatus: "Pending",
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      customerAddress: customer.address
    });

    await newOrder.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });


    const mailOptions = {
      from: "pkmisra.it.ug@jadavpuruniversity.in",
      to: customer.email,
      subject: "Payment Confirmation - PocketCare First Aid Store",
      html: `<h3>Hi ${customer.name},</h3>
            <p>Thank you for your purchase of <b>${productName}</b> worth ₹${amount}.</p>
            <p>Your order has been successfully placed.</p>
            <p><b>Order ID:</b> ${razorpayOrderId}</p>
            <br><p>Stay safe,</p><p>Team PocketCare</p>`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Payment recorded and confirmation sent" });
  } 
  catch (err) {
    console.error("Payment success handling failed:", err);
    res.status(500).send("Payment handling failed");
  }
});

router.get('/vieworders', fetchuser, async(req, res) => {
  try{
    const orders = await Order.find({user: req.user.id});
    res.json(orders);
  }
  catch(error){
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" }); 
  }
});
module.exports = router;
