from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

# SQLite database
SQLALCHEMY_DATABASE_URL = "sqlite:///./ezdravlje_ks.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Database Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)  # Plain text for demo
    jmbg = Column(String, unique=True, index=True)
    insurance_card_number = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship with profile
    profile = relationship("Profile", back_populates="user", uselist=False)

class Profile(Base):
    __tablename__ = "profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    first_name = Column(String)
    last_name = Column(String)
    date_of_birth = Column(Date)
    blood_type = Column(String)
    allergies = Column(Text)
    chronic_diseases = Column(Text)
    selected_doctor = Column(String)
    emergency_contact = Column(String)
    emergency_phone = Column(String)
    profile_picture = Column(String, default=None)
    
    # Relationships
    user = relationship("User", back_populates="profile")
    appointments = relationship("Appointment", back_populates="patient")
    prescriptions = relationship("Prescription", back_populates="patient")
    lab_results = relationship("LabResult", back_populates="patient")
    medical_records = relationship("MedicalRecord", back_populates="patient")
    refunds = relationship("Refund", back_populates="patient")
    health_logs = relationship("HealthLog", back_populates="patient")
    reminders = relationship("Reminder", back_populates="patient")

class Appointment(Base):
    __tablename__ = "appointments"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("profiles.id"))
    doctor_name = Column(String)
    doctor_type = Column(String)  # general practitioner or specialist
    facility = Column(String)
    date = Column(DateTime)
    status = Column(String, default="zakazano")  # zakazano, završeno, otkazano
    priority = Column(Boolean, default=False)  # urgent appointment
    notes = Column(Text)
    
    # Relationship
    patient = relationship("Profile", back_populates="appointments")

class Prescription(Base):
    __tablename__ = "prescriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("profiles.id"))
    doctor_name = Column(String)
    medication_name = Column(String)
    dosage = Column(String)
    frequency = Column(String)
    duration = Column(String)
    issued_date = Column(Date)
    expiry_date = Column(Date)
    status = Column(String, default="aktivan")  # aktivan, iskorišten, istekao
    
    # Relationship
    patient = relationship("Profile", back_populates="prescriptions")
    therapies = relationship("Therapy", back_populates="prescription")

class Therapy(Base):
    __tablename__ = "therapies"
    
    id = Column(Integer, primary_key=True, index=True)
    prescription_id = Column(Integer, ForeignKey("prescriptions.id"))
    medication_name = Column(String)
    dosage = Column(String)
    time_of_day = Column(String)
    duration = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)
    active = Column(Boolean, default=True)
    
    # Relationship
    prescription = relationship("Prescription", back_populates="therapies")

class LabResult(Base):
    __tablename__ = "lab_results"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("profiles.id"))
    test_type = Column(String)  # krvna slika, biohemija, šećer, holesterol, urin
    test_name = Column(String)
    result_value = Column(String)
    unit = Column(String)
    reference_range = Column(String)
    is_abnormal = Column(Boolean, default=False)
    test_date = Column(Date)
    facility = Column(String)
    notes = Column(Text)
    
    # Relationship
    patient = relationship("Profile", back_populates="lab_results")

class MedicalRecord(Base):
    __tablename__ = "medical_records"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("profiles.id"))
    record_type = Column(String)  # dijagnoza, hronična bolest, operacija, vakcinacija, hospitalizacija
    name = Column(String)
    date = Column(Date)
    doctor = Column(String)
    facility = Column(String)
    description = Column(Text)
    
    # Relationship
    patient = relationship("Profile", back_populates="medical_records")

class Refund(Base):
    __tablename__ = "refunds"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("profiles.id"))
    amount = Column(Float)
    description = Column(String)
    document_path = Column(String)
    submitted_date = Column(Date)
    status = Column(String, default="poslano")  # poslano, u obradi, odobreno, odbijeno
    processed_date = Column(Date, default=None)
    
    # Relationship
    patient = relationship("Profile", back_populates="refunds")

class HealthLog(Base):
    __tablename__ = "health_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("profiles.id"))
    log_type = Column(String)  # blood pressure, pulse, sugar, saturation, temperature, weight
    value = Column(String)
    unit = Column(String)
    logged_date = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text)
    
    # Relationship
    patient = relationship("Profile", back_populates="health_logs")

class Reminder(Base):
    __tablename__ = "reminders"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("profiles.id"))
    reminder_type = Column(String)  # terapija, termin, kontrola, laboratorijski nalaz
    title = Column(String)
    description = Column(String)
    reminder_date = Column(DateTime)
    status = Column(String, default="nadolazi")  # danas, sutra, kašnjen, završeno
    completed = Column(Boolean, default=False)
    
    # Relationship
    patient = relationship("Profile", back_populates="reminders")

class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("profiles.id"))
    name = Column(String)
    relationship = Column(String)
    phone = Column(String)
    
class HealthcareFacility(Base):
    __tablename__ = "healthcare_facilities"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    type = Column(String)  # dom zdravlja, bolnica, apoteka, dežurna ambulanta, laboratorija
    address = Column(String)
    phone = Column(String)
    working_hours = Column(String)
    latitude = Column(Float, default=None)
    longitude = Column(Float, default=None)

# Create tables
def init_db():
    Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
