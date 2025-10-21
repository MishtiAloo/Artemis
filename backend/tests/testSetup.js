const db = require("../db");

beforeAll(async () => {
  // Ensure database connection
  try {
    await db.query("SELECT 1");
  } catch (err) {
    console.error("Database connection failed:", err);
  }
});

afterAll(async () => {
  // Close database connection
  await db.end();
});
