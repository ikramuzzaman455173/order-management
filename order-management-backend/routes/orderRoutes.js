const express = require('express');
const router = express.Router();

// Ensure this is the correct model path
const Order = require('../models/Order.js');
const generatePdf = require('../utils/generatePdf.js');

// Fetch all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Create a new order
router.post('/orders', async (req, res) => {
  try {
    const { name, date, status } = req.body;

    // Check if order already exists
    const existingOrder = await Order.findOne({ name });
    if (existingOrder) {
      return res.status(400).json({ message: 'Order already exists' });
    }

    // Create and save new order
    const order = new Order({ name, date, status });
    await order.save();

    res.status(201).json(order);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Update an existing order
router.put('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, date, status } = req.body;

    const order = await Order.findByIdAndUpdate(id, { name, date, status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ message: 'Error updating order' });
  }
});

// Delete an order
router.delete('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(204).send(); // No content
  } catch (err) {
    console.error('Error deleting order:', err);
    res.status(500).json({ message: 'Error deleting order' });
  }
});

// Generate a PDF report of all orders
router.get('/orders/report', async (req, res) => {
  try {
    const orders = await Order.find();

    const pdfBuffer = await generatePdf(orders);

    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (err) {
    console.error('Error generating PDF report:', err);
    res.status(500).json({ message: 'Error generating PDF report' });
  }
});

module.exports = router;
