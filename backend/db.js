const pool = require("pg").Pool;

const db = new pool({
  user: "postgres",
  password: "an32bell206",
  host: "localhost",
  port: 5432,
  database: "artemis",
});

module.exports = db;
