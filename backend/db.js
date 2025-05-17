const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function getData(query, params = []) {
  try {
    const [rows] = await pool.query(query, params);
    return rows;
  } catch (err) {
    console.error("Database error:", err);
    throw err;
  }
}

module.exports = { getData };
