const express = require("express");
require("dotenv").config();
console.log("DB PASSWORD EXISTS:", typeof process.env.DB_PASSWORD);
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

const PORT = 5050;

// =========================
// Middleware
// =========================

app.use(cors());
app.use(express.json());

// =========================
// PostgreSQL Connection
// =========================

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test database connection
pool.query("SELECT current_database()", (error, result) => {
  if (error) {
    console.error("DATABASE CONNECTION ERROR:", error);
  } else {
    console.log(
      "CONNECTED TO:",
      result.rows[0].current_database
    );
  }
});

// =========================
// Home Route
// =========================

app.get("/", (req, res) => {
  res.send("Business API is running!");
});

// =========================
// GET - Get all products
// =========================

app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY id"
    );

    console.log("PRODUCTS FROM DATABASE:", result.rows);

    res.json(result.rows);
  } catch (error) {
    console.error("DATABASE ERROR:", error);

    res.status(500).json({
      error: "Database error",
    });
  }
});

// =========================
// POST - Add a product
// =========================

app.post("/api/products", async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        error: "Product name is required",
      });
    }

    if (price === undefined || price === null || Number(price) <= 0) {
      return res.status(400).json({
        error: "Price must be greater than 0",
      });
    }

    const result = await pool.query(
      "INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *",
      [name, price]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    // ...
  }
});

// =========================
// PUT - Edit a product
// =========================

app.put("/api/products/:id", async (req, res) => {
  console.log("PUT ROUTE HIT!");
  console.log("ID:", req.params.id);
  console.log("BODY:", req.body);

  try {
    const { id } = req.params;
    const { name, price } = req.body;

    if (!name || !name.trim()) {
  return res.status(400).json({
    error: "Product name is required",
  });
}

if (price === undefined || price === null || Number(price) <= 0) {
  return res.status(400).json({
    error: "Price must be greater than 0",
  });
}

    const result = await pool.query(
      "UPDATE products SET name = $1, price = $2 WHERE id = $3 RETURNING *",
      [name, price, id]
    );

    console.log("UPDATE RESULT:", result.rows);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("UPDATE DATABASE ERROR:", error);

    res.status(500).json({
      error: "Database error",
    });
  }
});

// =========================
// DELETE - Delete a product
// =========================

app.delete("/api/products/:id", async (req, res) => {
  console.log("DELETE ROUTE HIT!");
  console.log("ID:", req.params.id);

  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );

    console.log("DELETE RESULT:", result.rows);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("DELETE DATABASE ERROR:", error);

    res.status(500).json({
      error: "Database error",
    });
  }
});

// =========================
// Start Server
// =========================

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});