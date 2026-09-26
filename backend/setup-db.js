const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT || 5432),
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
      ["Admin User", "admin@business.com", "admin123"]
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
  } finally {
    await pool.end();
  }
}

initializeDatabase();
