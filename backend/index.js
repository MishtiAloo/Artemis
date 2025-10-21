const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

// Routes
const areaRoutes = require("./routes/area.route");
const patientRoutes = require("./routes/patient.route");
const diseaseRoutes = require("./routes/disease.route");
const hospitalRoutes = require("./routes/hospital.route");
const infectionRoutes = require("./routes/infection.route");
const vaccineRoutes = require("./routes/vaccine.route");
const vaccineBatchRoutes = require("./routes/vaccineBatch.route");
const vaccinationRecordRoutes = require("./routes/vaccinationRecord.route");
const contactsRoutes = require("./routes/contacts.route");

app.use("/areas", areaRoutes);
app.use("/patients", patientRoutes);
app.use("/diseases", diseaseRoutes);
app.use("/hospitals", hospitalRoutes);
app.use("/infections", infectionRoutes);
app.use("/vaccines", vaccineRoutes);
app.use("/vaccine-batches", vaccineBatchRoutes);
app.use("/vaccination-records", vaccinationRecordRoutes);
app.use("/contacts", contactsRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

// Test route
app.get("/", (req, res) => res.send("Hello World from index!"));

// DB check
app.get("/users", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
