const request = require("supertest");
const express = require("express");
const diseaseRoutes = require("../routes/disease.route");

const app = express();
app.use(express.json());
app.use("/diseases", diseaseRoutes);

describe("Disease API Endpoints - Critical Path Testing", () => {
  it("GET /diseases - should return all diseases", async () => {
    const res = await request(app).get("/diseases");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0); // Assuming seed data exists
  });

  it("GET /diseases/:id - should return disease by id", async () => {
    const res = await request(app).get("/diseases/1"); // Assuming ID 1 exists from seed
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("diseaseid", 1);
  });

  it("GET /diseases/:id - should return 404 for non-existent id", async () => {
    const res = await request(app).get("/diseases/999");
    expect(res.statusCode).toEqual(404);
  });
});
