# Relations

- **Patient** (**PatientID** [PK], Name, **AreaID** [FK → Area], ContactNo)

- **Disease** (**DiseaseID** [PK], Variant, Name, TransmissionMode, Severity)

- **Infection** (**PatientID** [FK → Patient], **DiseaseID** [FK → Disease], DiagnosisDate, RecoveryDate, Status)

- **Vaccine** (**VaccineID** [PK], **TargetedDiseaseID** [FK → Disease], Name, Manufacturer, DoseCount, EffectiveDays)

- **VaccineBatch** (**BatchID** [PK], **VaccineID** [FK → Vaccine], NumberOfVaccines, **HospitalID** [FK → Hospital])

- **VaccinationRecord** (**PatientID** [FK → Patient], **BatchID** [FK → VaccineBatch], DoseNo, Date, NextDueDate)

- **Hospital** (**HospitalID** [PK], Name, **AreaID** [FK → Area], Capacity)

- **Contacts** (**PatientID** [FK → Patient], ContactPersonID, Date, **AreaID** [FK → Area], ContactType)

- **Area** (**AreaID** [PK], Name, InfectionRate, RiskLevel)

# Views Usages



### 🔹 1. Active Infections by Area

A view to check which areas currently have ongoing infections.

```sql
CREATE VIEW ActiveInfectionsByArea AS
SELECT a.AreaID, a.Name AS AreaName, COUNT(*) AS ActiveCases
FROM Infection i
JOIN Patient p ON i.PatientID = p.PatientID
JOIN Area a ON p.AreaID = a.AreaID
WHERE i.Status = 'Active'
GROUP BY a.AreaID, a.Name;
```

👉 Useful for **monitoring outbreaks** geographically.

---

### 🔹 2. Vaccination Status of Patients

A view to know which patients are fully/partially vaccinated based on required doses.

```sql
CREATE VIEW VaccinationStatus AS
SELECT p.PatientID, p.Name,
       v.Name AS VaccineName,
       COUNT(vr.DoseNo) AS DosesTaken,
       v.DoseCount AS TotalDoses,
       CASE WHEN COUNT(vr.DoseNo) = v.DoseCount THEN 'Fully Vaccinated'
            ELSE 'Partially Vaccinated' END AS Status
FROM Patient p
JOIN VaccinationRecord vr ON p.PatientID = vr.PatientID
JOIN VaccineBatch vb ON vr.BatchID = vb.BatchID
JOIN Vaccine v ON vb.VaccineID = v.VaccineID
GROUP BY p.PatientID, p.Name, v.Name, v.DoseCount;
```

👉 Can be used for **reports** or patient dashboards.



---

### 🔹 3. High-Risk Contacts

A view to identify patients who had contact with others in high-risk areas.

```sql
CREATE VIEW HighRiskContacts AS
SELECT c.PatientID, p.Name AS PatientName,
       c.ContactPersonID, c.Date, a.Name AS AreaName, a.RiskLevel
FROM Contacts c
JOIN Area a ON c.AreaID = a.AreaID
JOIN Patient p ON c.PatientID = p.PatientID
WHERE a.RiskLevel = 'High';
```

👉 Helps with **contact tracing**.





