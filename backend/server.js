// backend/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5001;
const SECRET = "mysecretkey"; // Move to .env in production

app.use(cors());
app.use(express.json());

// -------------------- MongoDB Connection --------------------
mongoose
  .connect("mongodb://127.0.0.1:27017/inventory")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// -------------------- MODELS --------------------
// Product Model
const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  stock: Number,
});
const Product = mongoose.model("Product", productSchema);

// User Model
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
});
const User = mongoose.model("User", userSchema);

// -------------------- ROUTES --------------------
// Register a new user
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed });
    await user.save();
    res.json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ error: "Failed to register user" });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1h" });
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// -------------------- PRODUCT ROUTES (Protected) --------------------
// Get all products
app.get("/products", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Add a product
app.post("/products", authMiddleware, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to add product" });
  }
});

// Update a product
app.put("/products/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete a product
app.delete("/products/:id", authMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// -------------------- START SERVER --------------------
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  // Auto-register user "krishi" on server start
  try {
    const existingUser = await User.findOne({ username: "krishi" });
    if (!existingUser) {
      const hashed = await bcrypt.hash("1234", 10);
      const user = new User({ username: "krishi", password: hashed });
      await user.save();
      console.log("User 'krishi' registered automatically");
    } else {
      console.log("User 'krishi' already exists");
    }
  } catch (err) {
    console.error("Failed to auto-register user:", err);
  }
});