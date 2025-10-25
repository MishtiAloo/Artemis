## where:
- cascading where condition on search (Disease, vaccine, patient, infection, contacts, area, hospital)

## where like:
- hospital name, patient name, vaccine name

## join:
- patient who lives in area where infection rate/risk level
- Join hospitals and vaccine batches → show hospital name, vaccine name and stock count.
- For each patient, show their infection history + vaccination recor (who got sick, who got vaccinated).

## group by:
- which hospital got how many batches/how many vaccines/vacs left
- which manufacturer vaccine is working shittier (the patient is dead)

## misc:
- avg #recovery days for each vax ordered by disease
- disease that dont have vaccines
- Find areas with infection rate higher than the global average infection rate.
- all contacts with a patient that died
- List contacts of a patient within last N days
- Hospitals nearing capacity

## set:
- patients who lives in high risk zone but not contacted any
- patient who have this disease also this disease
- Patients who got infected but never vaccinated.

## update column:
- change area infection rate after some entry

## views:
- which disease is prominent in which area
- check which areas currently have ongoing infections.
- which patients are fully/partially vaccinated based on required doses.
- identify patients who had contact with others in high-risk areas.
