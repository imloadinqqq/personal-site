const { Client } = require("ssh2");
const mysql = require("mysql2/promise");
const fs = require("fs");
require("dotenv").config();

const sshConfig = {
  host: process.env.SSH_HOST,
  port: process.env.SSH_PORT,
  username: process.env.SSH_USER,
  privateKey: fs.readFileSync(process.env.SSH_KEY),
};

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

let connectionPool;
let sshClient;

async function connectSSHAndDB() {
  return new Promise((resolve, reject) => {
    sshClient = new Client();

    sshClient.on("ready", () => {
      console.log("SSH connection ready");

      sshClient.forwardOut(
        process.env.DB_HOST,
        12345,
        process.env.DB_ENDPOINT,
        process.env.DB_PORT,
        async (err, stream) => {
          if (err) {
            console.error("SSH forwardOut error:", err);
            return reject(err);
          }

          try {
            connectionPool = mysql.createPool({
              ...dbConfig,
              stream,
              waitForConnections: true,
              connectionLimit: 10,
              queueLimit: 0,
            });

            resolve();
          } catch (dbErr) {
            console.error("MySQL connection error:", dbErr);
            reject(dbErr);
          }
        }
      );
    });

    sshClient.on("error", (err) => {
      console.error("SSH Client error:", err);
      reject(err);
    });

    sshClient.connect(sshConfig);
  });
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

module.exports = {
  connectSSHAndDB,
  getData,
  getPool,
};
