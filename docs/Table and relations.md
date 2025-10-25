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


# Raw Features
1. Patient Management – Store patient details, contact info, area, and current 
health status. 
2. Disease Tracking – Record diseases, their variants, transmission modes, and 
severity. 
3. Infection History – Log patient infections, diagnosis and recovery dates, and 
outcomes. 
4. Vaccine Management – Maintain vaccine details, targeted diseases, 
manufacturers, and effectiveness. 
5. Vaccine Batch Tracking – Monitor vaccine stock, batches, and associated 
hospitals. 
6. Vaccination Records – Track patient doses, dates, and upcoming due doses. 
7. Hospital Management – Store hospital details, locations, and capacity for 
patients/vaccines. 
8. Contact Tracing – Record patient contacts, exposure areas, and type of contact. 
9. Area Risk Monitoring – Manage infection rates and risk levels for specific areas. 


