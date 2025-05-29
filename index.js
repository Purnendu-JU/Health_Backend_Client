require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const mongoURI = process.env.MONGO_URL;
async function main() {
  await mongoose.connect(mongoURI);
  console.log("Connected to Mongo");
}
main();
const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/prompt', require('./routes/chat'));
app.use('/api/review', require('./routes/review'));
app.use("/api/orders", require('./routes/orders.js'));
app.use("/api/products", require('./routes/product.js'));
app.listen(port, () => {
  console.log(`Listening at ${port}`);
})