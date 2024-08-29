const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  status: { type: String, required: true },
});

module.exports = mongoose.model('Order', orderSchema);
