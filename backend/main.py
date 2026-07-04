from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date
from .database import get_db, init_db
from .database import (
    User, Profile, Appointment, Prescription, Therapy, 
    LabResult, MedicalRecord, Refund, HealthLog, 
    Reminder, EmergencyContact, HealthcareFacility, 
    SessionLocal, Base, engine
)
from fastapi.responses import FileResponse
from pathlib import Path
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from .database import get_db, init_db
from .seed_data import seed_if_empty

# Initialize database on import
init_db()
seed_if_empty()

# Initialize FastAPI app
app = FastAPI(title="eZdravlje KS API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for frontend

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"

app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")
# Pydantic models for request/response
class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    email: str
    password: str
    jmbg: str
    insurance_card_number: str
    first_name: str
    last_name: str
    date_of_birth: date

class ProfileCreate(BaseModel):
    user_id: int
    first_name: str
    last_name: str
    date_of_birth: date
    blood_type: Optional[str] = None
    allergies: Optional[str] = None
    chronic_diseases: Optional[str] = None
    selected_doctor: Optional[str] = None
    emergency_contact: Optional[str] = None
    emergency_phone: Optional[str] = None

class AppointmentCreate(BaseModel):
    patient_id: int
    doctor_name: str
    doctor_type: str
    facility: str
    date: datetime
    priority: bool = False
    notes: Optional[str] = None

class PrescriptionCreate(BaseModel):
    patient_id: int
    doctor_name: str
    medication_name: str
    dosage: str
    frequency: str
    duration: str
    expiry_date: date

class LabResultCreate(BaseModel):
    patient_id: int
    test_type: str
    test_name: str
    result_value: str
    unit: str
    reference_range: str
    is_abnormal: bool = False
    test_date: date
    facility: str
    notes: Optional[str] = None

class MedicalRecordCreate(BaseModel):
    patient_id: int
    record_type: str
    name: str
    date: date
    doctor: str
    facility: str
    description: str

class RefundCreate(BaseModel):
    patient_id: int
    amount: float
    description: str
    document_path: str

class HealthLogCreate(BaseModel):
    patient_id: int
    log_type: str
    value: str
    unit: str
    notes: Optional[str] = None

class ReminderCreate(BaseModel):
    patient_id: int
    reminder_type: str
    title: str
    description: str
    reminder_date: datetime

class EmergencyContactCreate(BaseModel):
    patient_id: int
    name: str
    relationship: str
    phone: str

# Root endpoint
@app.get("/")
def root():
    return FileResponse(FRONTEND_DIR / "index.html")
    # ==================== AUTH ENDPOINTS ====================

@app.post("/api/auth/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or db_user.password != user.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {
        "user_id": db_user.id,
        "email": db_user.email,
        "profile": db_user.profile
    }

@app.post("/api/auth/register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    new_user = User(
        email=user.email,
        password=user.password,
        jmbg=user.jmbg,
        insurance_card_number=user.insurance_card_number
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create profile
    new_profile = Profile(
        user_id=new_user.id,
        first_name=user.first_name,
        last_name=user.last_name,
        date_of_birth=user.date_of_birth
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    
    return {"user_id": new_user.id, "profile": new_profile}

# ==================== PROFILE ENDPOINTS ====================

@app.get("/api/profiles/{profile_id}")
def get_profile(profile_id: int, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@app.put("/api/profiles/{profile_id}")
def update_profile(profile_id: int, profile_data: ProfileCreate, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    for key, value in profile_data.dict(exclude_unset=True).items():
        setattr(profile, key, value)
    
    db.commit()
    db.refresh(profile)
    return profile

# ==================== APPOINTMENT ENDPOINTS ====================

@app.get("/api/appointments/patient/{patient_id}")
def get_appointments(patient_id: int, db: Session = Depends(get_db)):
    appointments = db.query(Appointment).filter(Appointment.patient_id == patient_id).order_by(Appointment.date.desc()).all()
    return appointments

@app.post("/api/appointments")
def create_appointment(appointment: AppointmentCreate, db: Session = Depends(get_db)):
    new_appointment = Appointment(**appointment.dict())
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    return new_appointment

@app.put("/api/appointments/{appointment_id}")
def update_appointment(appointment_id: int, status: str, db: Session = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    appointment.status = status
    db.commit()
    db.refresh(appointment)
    return appointment

@app.delete("/api/appointments/{appointment_id}")
def delete_appointment(appointment_id: int, db: Session = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    db.delete(appointment)
    db.commit()
    return {"message": "Appointment deleted"}

# ==================== PRESCRIPTION ENDPOINTS ====================

@app.get("/api/prescriptions/patient/{patient_id}")
def get_prescriptions(patient_id: int, db: Session = Depends(get_db)):
    prescriptions = db.query(Prescription).filter(Prescription.patient_id == patient_id).order_by(Prescription.issued_date.desc()).all()
    return prescriptions

@app.post("/api/prescriptions")
def create_prescription(prescription: PrescriptionCreate, db: Session = Depends(get_db)):
    new_prescription = Prescription(**prescription.dict())
    db.add(new_prescription)
    db.commit()
    db.refresh(new_prescription)
    return new_prescription

@app.get("/api/therapies/patient/{patient_id}")
def get_therapies(patient_id: int, db: Session = Depends(get_db)):
    therapies = db.query(Therapy).join(Prescription).filter(Prescription.patient_id == patient_id, Therapy.active == True).all()
    return therapies

# ==================== LAB RESULTS ENDPOINTS ====================

@app.get("/api/lab-results/patient/{patient_id}")
def get_lab_results(patient_id: int, db: Session = Depends(get_db)):
    results = db.query(LabResult).filter(LabResult.patient_id == patient_id).order_by(LabResult.test_date.desc()).all()
    return results

@app.post("/api/lab-results")
def create_lab_result(lab_result: LabResultCreate, db: Session = Depends(get_db)):
    new_result = LabResult(**lab_result.dict())
    db.add(new_result)
    db.commit()
    db.refresh(new_result)
    return new_result

# ==================== MEDICAL RECORDS ENDPOINTS ====================

@app.get("/api/medical-records/patient/{patient_id}")
def get_medical_records(patient_id: int, db: Session = Depends(get_db)):
    records = db.query(MedicalRecord).filter(MedicalRecord.patient_id == patient_id).order_by(MedicalRecord.date.desc()).all()
    return records

@app.post("/api/medical-records")
def create_medical_record(record: MedicalRecordCreate, db: Session = Depends(get_db)):
    new_record = MedicalRecord(**record.dict())
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record

# ==================== REFUND ENDPOINTS ====================

@app.get("/api/refunds/patient/{patient_id}")
def get_refunds(patient_id: int, db: Session = Depends(get_db)):
    refunds = db.query(Refund).filter(Refund.patient_id == patient_id).order_by(Refund.submitted_date.desc()).all()
    return refunds

@app.post("/api/refunds")
def create_refund(refund: RefundCreate, db: Session = Depends(get_db)):
    new_refund = Refund(**refund.dict())
    db.add(new_refund)
    db.commit()
    db.refresh(new_refund)
    return new_refund

# ==================== HEALTH LOGS ENDPOINTS ====================

@app.get("/api/health-logs/patient/{patient_id}")
def get_health_logs(patient_id: int, log_type: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(HealthLog).filter(HealthLog.patient_id == patient_id)
    if log_type:
        query = query.filter(HealthLog.log_type == log_type)
    logs = query.order_by(HealthLog.logged_date.desc()).all()
    return logs

@app.post("/api/health-logs")
def create_health_log(log: HealthLogCreate, db: Session = Depends(get_db)):
    new_log = HealthLog(**log.dict())
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log

# ==================== REMINDERS ENDPOINTS ====================

@app.get("/api/reminders/patient/{patient_id}")
def get_reminders(patient_id: int, db: Session = Depends(get_db)):
    reminders = db.query(Reminder).filter(Reminder.patient_id == patient_id).order_by(Reminder.reminder_date).all()
    return reminders

@app.post("/api/reminders")
def create_reminder(reminder: ReminderCreate, db: Session = Depends(get_db)):
    new_reminder = Reminder(**reminder.dict())
    db.add(new_reminder)
    db.commit()
    db.refresh(new_reminder)
    return new_reminder

@app.put("/api/reminders/{reminder_id}")
def update_reminder(reminder_id: int, completed: bool, db: Session = Depends(get_db)):
    reminder = db.query(Reminder).filter(Reminder.id == reminder_id).first()
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    
    reminder.completed = completed
    reminder.status = "završeno" if completed else reminder.status
    db.commit()
    db.refresh(reminder)
    return reminder

# ==================== EMERGENCY CONTACTS ENDPOINTS ====================

@app.get("/api/emergency-contacts/patient/{patient_id}")
def get_emergency_contacts(patient_id: int, db: Session = Depends(get_db)):
    contacts = db.query(EmergencyContact).filter(EmergencyContact.patient_id == patient_id).all()
    return contacts

@app.post("/api/emergency-contacts")
def create_emergency_contact(contact: EmergencyContactCreate, db: Session = Depends(get_db)):
    new_contact = EmergencyContact(**contact.dict())
    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)
    return new_contact

# ==================== HEALTHCARE FACILITIES ENDPOINTS ====================

@app.get("/api/healthcare-facilities")
def get_healthcare_facilities(facility_type: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(HealthcareFacility)
    if facility_type:
        query = query.filter(HealthcareFacility.type == facility_type)
    facilities = query.all()
    return facilities

# ==================== DASHBOARD ENDPOINTS ====================

@app.get("/api/dashboard/{patient_id}")
def get_dashboard(patient_id: int, db: Session = Depends(get_db)):
    # Get next appointment
    next_appointment = db.query(Appointment).filter(
        Appointment.patient_id == patient_id,
        Appointment.status == "zakazano",
        Appointment.date > datetime.now()
    ).order_by(Appointment.date).first()
    
    # Get active prescriptions
    active_prescriptions = db.query(Prescription).filter(
        Prescription.patient_id == patient_id,
        Prescription.status == "aktivan"
    ).count()
    
    # Get recent lab results
    recent_results = db.query(LabResult).filter(
        LabResult.patient_id == patient_id
    ).order_by(LabResult.test_date.desc()).limit(5).all()
    
    # Get active reminders
    active_reminders = db.query(Reminder).filter(
        Reminder.patient_id == patient_id,
        Reminder.completed == False
    ).count()
    
    return {
        "next_appointment": next_appointment,
        "active_prescriptions": active_prescriptions,
        "recent_results": recent_results,
        "active_reminders": active_reminders
    }
