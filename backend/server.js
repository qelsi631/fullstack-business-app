const express = require("express");
require("dotenv").config();

const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 5050;

// =========================
// Middleware
// =========================

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// =========================
// PostgreSQL Connection
// =========================

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT || 5432),
});

const DEFAULT_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@business.com").trim().toLowerCase();
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

const buildAuthResponse = (user) => ({
  token: `token-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  user: {
    id: user.id,
    name: user.full_name || user.name || user.email.split("@")[0],
    email: user.email,
  },
});

async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL DEFAULT 'Admin User',
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price NUMERIC(10, 2) NOT NULL CHECK (price > 0)
      );
    `);

    await pool.query(
      `INSERT INTO users (full_name, email, password)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING;`,
      ["Admin User", DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD]
    );

    const productCount = await pool.query("SELECT COUNT(*)::int AS count FROM products");

    if (productCount.rows[0].count === 0) {
      await pool.query(
        `INSERT INTO products (name, price) VALUES
         ('Laptop Pro', 1299.99),
         ('Wireless Mouse', 59.99),
         ('Office Chair', 249.50),
         ('4K Monitor', 399.00)`
      );
    }

    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Database initialization failed:", error.message);
    throw error;
  }
}

async function connectAndInitialize() {
  try {
    const result = await pool.query("SELECT current_database()");
    console.log("CONNECTED TO:", result.rows[0].current_database);
    await initializeDatabase();
  } catch (error) {
    console.error("DATABASE CONNECTION ERROR:", error.message);
    process.exit(1);
  }
}

// =========================
// Auth Routes
// =========================

app.post("/api/login", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "").trim();

  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required.",
    });
  }

  try {
    const result = await pool.query(
      "SELECT id, email, full_name FROM users WHERE email = $1 AND password = $2 LIMIT 1",
      [email, password]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      return res.json(buildAuthResponse({ ...user, email: user.email.toLowerCase() }));
    }
  } catch (error) {
    console.error("Login query failed:", error.message);
    return res.status(500).json({ error: "Database error while logging in." });
  }

  return res.status(401).json({
    error: "Invalid email or password.",
  });
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
    const result = await pool.query("SELECT * FROM products ORDER BY id");
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
    console.error("CREATE DATABASE ERROR:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// =========================
// PUT - Edit a product
// =========================

app.put("/api/products/:id", async (req, res) => {
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
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );

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

connectAndInitialize().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});