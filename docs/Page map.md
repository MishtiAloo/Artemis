* Make real-world sense for your “Artemis – Disease Tracker & Vaccination” system,
* Cover **every required SQL topic** from the lab, and
* Stay clean and consistent for a single-user role (e.g. “System Operator” / “Admin”).

---

## 🌐 PAGE MAP — Artemis Disease & Vaccination Tracker

### 1️⃣ **Dashboard**

**Description:**
Home page giving an overview of system stats — total patients, infections, vaccines, hospitals, high-risk areas, etc.
Acts as the entry point for data exploration.

**Features Covered:**

* Summary queries (counts, averages) → simple `SELECT`, `GROUP BY`, aggregate functions.
* `WHERE` filters to show “Active infections”, “High risk areas”, etc.
* “Hospitals nearing capacity” (misc).
* “Find areas with infection rate higher than global average infection rate” (misc).

---

### 2️⃣ **Patients Management**

**Description:**
CRUD interface for patient records — view, search, add, edit, and delete patients.

**Features Covered:**

* Basic CRUD → `INSERT`, `UPDATE`, `DELETE`, `SELECT`.
* `WHERE LIKE` → search by patient name.
* `JOIN` with Area to show patient’s area info and infection risk.
* `SET` → “Patients who got infected but never vaccinated.”
* `SET` → “Patients living in high risk zones but not contacted anyone.”
* `UPDATE` triggers when area infection rates change.

**SQL Topics:** insert, update, delete, where, join, set.

---

### 3️⃣ **Disease & Infection Tracking**

**Description:**
Manage diseases and infection history. View all diseases, infection variants, and track which patients got infected, recovered, or died.

**Features Covered:**

* `WHERE` cascaded filters: filter infections by disease, area, or status.
* `JOIN` → link patients with diseases.
* “Which disease is prominent in which area” → (view).
* “Average # of recovery days per vaccine ordered by disease” (misc).
* “Disease that doesn’t have vaccines” (misc).
* “Patient who have this disease also this disease” (set).
* `GROUP BY` → number of infections per disease / per area.
* `HAVING` → filter diseases with above-average cases.

**SQL Topics:** select, where, join, group by, having, aggregate.

---

### 4️⃣ **Vaccine & Manufacturer Management**

**Description:**
Manage vaccines, their targeted diseases, dose count, and effectiveness. Analyze manufacturer performance and vaccine coverage.

**Features Covered:**

* `WHERE LIKE` → vaccine name search.
* `JOIN` → vaccines + targeted diseases.
* `GROUP BY` → total vaccines per manufacturer.
* “Which manufacturer’s vaccine is working shittier (patients died)” (group by + join + where).
* “Disease that don’t have vaccines” (misc).
* `SET` → “Patients who got infected but never vaccinated.”

**SQL Topics:** join, where like, group by, set.

---

### 5️⃣ **Vaccine Batch & Stock Management**

**Description:**
Monitor vaccine stock by hospital. Track how many batches are assigned, and how much stock remains.

**Features Covered:**

* `JOIN` → hospitals + vaccine batches (show hospital name, vaccine name, and stock count).
* `GROUP BY` → total batches/vaccines per hospital.
* “Hospitals nearing capacity” (misc).
* `UPDATE` → when new batches are assigned, adjust hospital capacity or stock count.

**SQL Topics:** join, group by, update, aggregate functions.

---

### 6️⃣ **Vaccination Records**

**Description:**
Track which patients have received which vaccine doses, and schedule their next due date.

**Features Covered:**

* `JOIN` → patient + vaccination record + vaccine + hospital.
* “Which patients are fully/partially vaccinated” (view).
* “Average recovery days for each vaccine” (misc, join + avg).
* “Patients who got infected but never vaccinated” (set).
* `WHERE` → filter records by dose number, date, or hospital.

**SQL Topics:** join, where, aggregate, views, set.

---

### 7️⃣ **Hospital Management**

**Description:**
Manage hospitals — their details, area, capacity, and associated vaccine batches.

**Features Covered:**

* `WHERE LIKE` → search by hospital name.
* `JOIN` → hospitals + areas (to show risk zone).
* `GROUP BY` → batches/vaccines per hospital.
* “Hospitals nearing capacity” (misc).
* `UPDATE` → hospital capacity as patients admitted/discharged.

**SQL Topics:** where like, join, group by, update.

---

### 8️⃣ **Contact Tracing**

**Description:**
View and manage patient contact data — who met whom, when, and where.

**Features Covered:**

* `WHERE` → filter contacts by date, type, or area.
* “All contacts with a patient that died” (misc).
* “List contacts of a patient within last N days” (misc).
* “Identify patients who had contact with others in high-risk areas” (view).
* “Patients who live in high-risk zones but not contacted any” (set).
* `JOIN` → patient + contact + area.

**SQL Topics:** where, join, set, views.

---

### 9️⃣ **Area & Risk Management**

**Description:**
Maintain areas, infection rates, and risk levels. Update area risk dynamically based on infection data.

**Features Covered:**

* `WHERE` → search/filter by area name or risk level.
* `UPDATE` → change infection rate after new infection entries.
* `JOIN` → area + hospital + infection.
* “Areas with infection rate higher than global average” (misc).
* “Check which areas currently have ongoing infections” (view).

**SQL Topics:** update, where, join, aggregate, views.

---

### 🔟 **Analytics & Reports**

**Description:**
Generate analytical summaries and reports.

**Features Covered:**

* “Which disease is prominent in which area” (view).
* “Which patients are fully/partially vaccinated” (view).
* “Identify patients who had contact in high-risk areas” (view).
* “Find areas with infection rate higher than average” (misc).
* `SET`, `JOIN`, `GROUP BY`, and `AGGREGATE` operations combined.

**SQL Topics:** views, set operations, group by, aggregate.

---

## 🧩 Optional System Pages

| Page               | Purpose                                                      |
| ------------------ | ------------------------------------------------------------ |
| **Login / Logout** | Basic authentication (single user role).                     |
| **Settings**       | Optional config (e.g., default view limits, report filters). |

---

## ✅ Summary Table

| Page                         | SQL Concepts Covered                          | Key Project Features Covered             |
| ---------------------------- | --------------------------------------------- | ---------------------------------------- |
| Dashboard                    | SELECT, WHERE, GROUP BY, Aggregate            | Overview, alerts, risk levels            |
| Patients Management          | INSERT, UPDATE, DELETE, WHERE LIKE, JOIN, SET | Patient management, risk-based search    |
| Disease & Infection Tracking | WHERE, JOIN, GROUP BY, HAVING, AGGREGATE      | Infection analysis, disease prominence   |
| Vaccine & Manufacturer       | WHERE LIKE, JOIN, GROUP BY, SET               | Vaccine tracking, manufacturer analysis  |
| Vaccine Batch & Stock        | JOIN, GROUP BY, UPDATE                        | Batch and stock monitoring               |
| Vaccination Records          | JOIN, WHERE, SET, VIEWS                       | Dose tracking, scheduling                |
| Hospital Management          | WHERE LIKE, JOIN, GROUP BY, UPDATE            | Hospital capacity and vaccine allocation |
| Contact Tracing              | WHERE, JOIN, SET, VIEWS                       | Contact tracking, exposure analysis      |
| Area & Risk                  | WHERE, UPDATE, JOIN, VIEWS                    | Area risk update, infection rates        |
| Analytics & Reports          | VIEWS, SET, GROUP BY, AGGREGATE               | Comprehensive reports                    |

---