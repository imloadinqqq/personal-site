const mysql = require("mysql2/promise");
require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

let connectionPool;

async function connectDB() {
  try {
    connectionPool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });    
    const connection = await connectionPool.getConnection();
    connection.release();
    console.log("Database connection pool ready");
    return connectionPool;
  } catch (err) {
    console.error("MySQL connection error:", err);
    throw err;
  }
}

async function getData(query, params = []) {
  if (!connectionPool) throw new Error("DB not connected");
  const [rows] = await connectionPool.execute(query, params);
  return rows;
}

function getPool() {
  if (!connectionPool) throw new Error("DB not connected yet");
  return connectionPool;
}

process.on('SIGINT', async () => {
  if (connectionPool) {
    await connectionPool.end();
    console.log('DB pool closed');
  }
  process.exit(0);
});


module.exports = {
  connectDB,
  getData,
  getPool,
};
