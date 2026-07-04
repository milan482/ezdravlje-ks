from sqlalchemy.orm import Session
from datetime import datetime, date, timedelta
from database import (
    User, Profile, Appointment, Prescription, Therapy, 
    LabResult, MedicalRecord, Refund, HealthLog, 
    Reminder, EmergencyContact, HealthcareFacility, 
    SessionLocal, Base, engine
)

def seed_database():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Clear existing data
        db.query(Reminder).delete()
        db.query(HealthLog).delete()
        db.query(Refund).delete()
        db.query(MedicalRecord).delete()
        db.query(LabResult).delete()
        db.query(Therapy).delete()
        db.query(Prescription).delete()
        db.query(Appointment).delete()
        db.query(EmergencyContact).delete()
        db.query(Profile).delete()
        db.query(User).delete()
        db.query(HealthcareFacility).delete()
        
        # Create demo users
        user1 = User(
            email="demo@ezdravlje.ba",
            password="demo123",
            jmbg="1234567890123",
            insurance_card_number="KS123456"
        )
        
        user2 = User(
            email="pacijent@ezdravlje.ba",
            password="pacijent123",
            jmbg="9876543210987",
            insurance_card_number="KS654321"
        )
        
        db.add(user1)
        db.add(user2)
        db.commit()
        
        # Create profiles
        profile1 = Profile(
            user_id=user1.id,
            first_name="Amela",
            last_name="Kovačević",
            date_of_birth=date(1990, 5, 15),
            blood_type="A+",
            allergies="Penicilin",
            chronic_diseases="Hipertenzija",
            selected_doctor="Dr. Mirsad Hadžić",
            emergency_contact="Mehmed Kovačević",
            emergency_phone="+387 61 123 456"
        )
        
        profile2 = Profile(
            user_id=user2.id,
            first_name="Adnan",
            last_name="Begović",
            date_of_birth=date(1985, 8, 22),
            blood_type="O+",
            allergies="Nema",
            chronic_diseases="Dijabetes tip 2",
            selected_doctor="Dr. Selma Halilović",
            emergency_contact="Aida Begović",
            emergency_phone="+387 61 987 654"
        )
        
        db.add(profile1)
        db.add(profile2)
        db.commit()
        
        # Create appointments
        appointment1 = Appointment(
            patient_id=profile1.id,
            doctor_name="Dr. Mirsad Hadžić",
            doctor_type="opšta praksa",
            facility="Dom zdravlja Centar",
            date=datetime.now() + timedelta(days=2),
            status="zakazano",
            priority=False,
            notes="Redovni pregled"
        )
        
        appointment2 = Appointment(
            patient_id=profile1.id,
            doctor_name="Dr. Jasmin Brkić",
            doctor_type="kardiolog",
            facility="KCUS Sarajevo",
            date=datetime.now() + timedelta(days=7),
            status="zakazano",
            priority=True,
            notes="Kontrola srca"
        )
        
        appointment3 = Appointment(
            patient_id=profile1.id,
            doctor_name="Dr. Mirsad Hadžić",
            doctor_type="opšta praksa",
            facility="Dom zdravlja Centar",
            date=datetime.now() - timedelta(days=10),
            status="završeno",
            priority=False,
            notes="Redovni pregled"
        )
        
        db.add(appointment1)
        db.add(appointment2)
        db.add(appointment3)
        db.commit()
        
        # Create prescriptions
        prescription1 = Prescription(
            patient_id=profile1.id,
            doctor_name="Dr. Mirsad Hadžić",
            medication_name="Lisinopril",
            dosage="10mg",
            frequency="1x dnevno",
            duration="30 dana",
            issued_date=date.today(),
            expiry_date=date.today() + timedelta(days=30),
            status="aktivan"
        )
        
        prescription2 = Prescription(
            patient_id=profile1.id,
            doctor_name="Dr. Mirsad Hadžić",
            medication_name="Amlodipin",
            dosage="5mg",
            frequency="1x dnevno",
            duration="30 dana",
            issued_date=date.today() - timedelta(days=15),
            expiry_date=date.today() + timedelta(days=15),
            status="aktivan"
        )
        
        db.add(prescription1)
        db.add(prescription2)
        db.commit()
        
        # Create therapies
        therapy1 = Therapy(
            prescription_id=prescription1.id,
            medication_name="Lisinopril",
            dosage="10mg",
            time_of_day="08:00",
            duration="30 dana",
            start_date=date.today(),
            end_date=date.today() + timedelta(days=30),
            active=True
        )
        
        therapy2 = Therapy(
            prescription_id=prescription2.id,
            medication_name="Amlodipin",
            dosage="5mg",
            time_of_day="20:00",
            duration="30 dana",
            start_date=date.today() - timedelta(days=15),
            end_date=date.today() + timedelta(days=15),
            active=True
        )
        
        db.add(therapy1)
        db.add(therapy2)
        db.commit()
        
        # Create lab results
        lab1 = LabResult(
            patient_id=profile1.id,
            test_type="biohemija",
            test_name="Holesterol ukupno",
            result_value="5.8",
            unit="mmol/L",
            reference_range="3.0-5.2",
            is_abnormal=True,
            test_date=date.today() - timedelta(days=5),
            facility="Laboratorija KCUS",
            notes="Lagano povišeno"
        )
        
        lab2 = LabResult(
            patient_id=profile1.id,
            test_type="krvna slika",
            test_name="Hemoglobin",
            result_value="145",
            unit="g/L",
            reference_range="120-160",
            is_abnormal=False,
            test_date=date.today() - timedelta(days=5),
            facility="Laboratorija KCUS"
        )
        
        lab3 = LabResult(
            patient_id=profile1.id,
            test_type="šećer",
            test_name="Glukoza natašte",
            result_value="5.2",
            unit="mmol/L",
            reference_range="3.9-6.1",
            is_abnormal=False,
            test_date=date.today() - timedelta(days=5),
            facility="Laboratorija KCUS"
        )
        
        db.add(lab1)
        db.add(lab2)
        db.add(lab3)
        db.commit()
        
        # Create medical records
        record1 = MedicalRecord(
            patient_id=profile1.id,
            record_type="dijagnoza",
            name="Hipertenzija",
            date=date(2020, 3, 10),
            doctor="Dr. Mirsad Hadžić",
            facility="Dom zdravlja Centar",
            description="Dijagnosticirana arterijska hipertenzija"
        )
        
        record2 = MedicalRecord(
            patient_id=profile1.id,
            record_type="vakcinacija",
            name="COVID-19 vakcina",
            date=date(2021, 6, 15),
            doctor="Dr. Selma Halilović",
            facility="Dom zdravlja Centar",
            description="Prva doza Pfizer-BioNTech"
        )
        
        record3 = MedicalRecord(
            patient_id=profile1.id,
            record_type="vakcinacija",
            name="COVID-19 vakcina",
            date=date(2021, 7, 15),
            doctor="Dr. Selma Halilović",
            facility="Dom zdravlja Centar",
            description="Druga doza Pfizer-BioNTech"
        )
        
        db.add(record1)
        db.add(record2)
        db.add(record3)
        db.commit()
        
        # Create refunds
        refund1 = Refund(
            patient_id=profile1.id,
            amount=45.50,
            description="Lijekovi - Lisinopril",
            document_path="/uploads/refund1.pdf",
            submitted_date=date.today() - timedelta(days=10),
            status="u obradi"
        )
        
        db.add(refund1)
        db.commit()
        
        # Create health logs
        today = datetime.now()
        for i in range(7):
            log1 = HealthLog(
                patient_id=profile1.id,
                log_type="blood pressure",
                value=f"{130 + i*2}/{85 + i}",
                unit="mmHg",
                logged_date=today - timedelta(days=i),
                notes="Jutarnje mjerenje"
            )
            log2 = HealthLog(
                patient_id=profile1.id,
                log_type="pulse",
                value=f"{72 + i}",
                unit="bpm",
                logged_date=today - timedelta(days=i)
            )
            db.add(log1)
            db.add(log2)
        
        db.commit()
        
        # Create reminders
        reminder1 = Reminder(
            patient_id=profile1.id,
            reminder_type="terapija",
            title="Lisinopril - 10mg",
            description="Uzmite lijek ujutro",
            reminder_date=datetime.now().replace(hour=8, minute=0),
            status="danas"
        )
        
        reminder2 = Reminder(
            patient_id=profile1.id,
            reminder_type="termin",
            title="Pregled kod dr. Hadžića",
            description="Dom zdravlja Centar",
            reminder_date=datetime.now() + timedelta(days=2),
            status="nadolazi"
        )
        
        reminder3 = Reminder(
            patient_id=profile1.id,
            reminder_type="kontrola",
            title="Kontrola šećera",
            description="Laboratorijski nalaz",
            reminder_date=datetime.now() + timedelta(days=5),
            status="nadolazi"
        )
        
        db.add(reminder1)
        db.add(reminder2)
        db.add(reminder3)
        db.commit()
        
        # Create emergency contacts
        emergency1 = EmergencyContact(
            patient_id=profile1.id,
            name="Mehmed Kovačević",
            relationship="Muž",
            phone="+387 61 123 456"
        )
        
        emergency2 = EmergencyContact(
            patient_id=profile1.id,
            name="Selma Kovačević",
            relationship="Sestra",
            phone="+387 62 234 567"
        )
        
        db.add(emergency1)
        db.add(emergency2)
        db.commit()
        
        # Create healthcare facilities
        facilities = [
            HealthcareFacility(
                name="Dom zdravlja Centar",
                type="dom zdravlja",
                address="Mula Mustafa Bašeskije 12, Sarajevo",
                phone="+387 33 272 000",
                working_hours="07:00-20:00"
            ),
            HealthcareFacility(
                name="Dom zdravlja Novo Sarajevo",
                type="dom zdravlja",
                address="Omera Stupca 15, Sarajevo",
                phone="+387 33 654 000",
                working_hours="07:00-20:00"
            ),
            HealthcareFacility(
                name="KCUS Sarajevo",
                type="bolnica",
                address="Bolnička 25, Sarajevo",
                phone="+387 33 272 000",
                working_hours="00:00-24:00"
            ),
            HealthcareFacility(
                name="Apoteka Bota",
                type="apoteka",
                address="Ferhadija 12, Sarajevo",
                phone="+387 33 222 333",
                working_hours="08:00-21:00"
            ),
            HealthcareFacility(
                name="Apoteka Kaluna",
                type="apoteka",
                address="Maršala Tita 24, Sarajevo",
                phone="+387 33 444 555",
                working_hours="08:00-22:00"
            ),
            HealthcareFacility(
                name="Dežurna ambulanta KCUS",
                type="dežurna ambulanta",
                address="Bolnička 25, Sarajevo",
                phone="+387 33 272 111",
                working_hours="00:00-24:00"
            ),
            HealthcareFacility(
                name="Laboratorija Biohemija",
                type="laboratorija",
                address="Zmaja od Bosne 88, Sarajevo",
                phone="+387 33 666 777",
                working_hours="07:00-15:00"
            )
        ]
        
        for facility in facilities:
            db.add(facility)
        
        db.commit()
        
        print("Database seeded successfully!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
