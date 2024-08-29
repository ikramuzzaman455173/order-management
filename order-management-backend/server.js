const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const orderRoutes = require("./routes/orderRoutes.js");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection error:", err));

app.use(
  cors({
    // origin: "http://localhost:3000",
    origin: "https://order-management-sand.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    // allowedHeaders: ["Content-Type", "Authorization"]
  })
);
// app.options('*', cors());

app.use(bodyParser.json());

app.use("/api", orderRoutes);

// Home route with a JSON message that includes a link to the orders API
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the order management API.",
    note: "Use the link below to access the orders.",
    link: "/api/orders" // Replace with your actual domain if different
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

