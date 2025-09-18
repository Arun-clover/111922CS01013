const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db.js");
const urlRoutes = require("./routes/routes.js");
const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(morgan("combined"));

// Connect DB
connectDB();

// Routes
app.use("/", urlRoutes);

// Error Handling
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
