const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); 
var fetchuser = require('../middleware/fetchuser');
router.get("/firstaid", fetchuser, async (req, res) => {
  const products = await Product.find({});
  res.json({ products });
});
router.get("/firstaid/:id", fetchuser, async (req, res) => {
  const products = await Product.findById(req.params.id);
  res.json({ products });
});

router.put("/purchase/:id", fetchuser, async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.id, stock: { $gt: 0 } },
      { $inc: { stock: -1 } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(400).json({ error: "Out of stock or product not found" });
    }
    if (updatedProduct.stock <= 0) {
      await Product.deleteOne({ _id: req.params.id });
      return res.status(200).json({ message: "Product sold out and removed from database", stockLeft: 0 });
    }

    res.status(200).json({ message: "Stock decremented", stockLeft: updatedProduct.stock });
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;