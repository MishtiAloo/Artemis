const fs = require("fs");
const path = require("path");
const db = require("./db");

async function runSeed() {
  try {
    const filePath = path.join(__dirname, "seed.sql");
    const sql = fs.readFileSync(filePath, "utf8");

    console.log("Running seed SQL...");
    // Execute whole file. PostgreSQL accepts multiple statements in one query.
    await db.query(sql);
    console.log("Seed completed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Error running seed:", err.message || err);
    process.exit(1);
  }
}

runSeed();
