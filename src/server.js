const express = require("express");
const authRoutes = require("./routes/authRoutes");

// Initialize express application
const app = express();

// Middleware for JSON parsing
app.use(express.json());

// Hello World
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Route configuration
app.use("/auth", authRoutes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}!`));
