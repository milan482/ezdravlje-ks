// API Service Layer for eZdravlje KS
const API_BASE_URL = '/api';

class ApiService {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = localStorage.getItem('auth_token');
        
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
    
    // Auth endpoints
    async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }
    
    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }
    
    // Profile endpoints
    async getProfile(profileId) {
        return this.request(`/profiles/${profileId}`);
    }
    
    async updateProfile(profileId, profileData) {
        return this.request(`/profiles/${profileId}`, {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    }
    
    // Appointment endpoints
    async getAppointments(patientId) {
        return this.request(`/appointments/patient/${patientId}`);
    }
    
    async createAppointment(appointmentData) {
        return this.request('/appointments', {
            method: 'POST',
            body: JSON.stringify(appointmentData),
        });
    }
    
    async updateAppointment(appointmentId, status) {
        return this.request(`/appointments/${appointmentId}?status=${status}`, {
            method: 'PUT',
        });
    }
    
    async deleteAppointment(appointmentId) {
        return this.request(`/appointments/${appointmentId}`, {
            method: 'DELETE',
        });
    }
    
    // Prescription endpoints
    async getPrescriptions(patientId) {
        return this.request(`/prescriptions/patient/${patientId}`);
    }
    
    async createPrescription(prescriptionData) {
        return this.request('/prescriptions', {
            method: 'POST',
            body: JSON.stringify(prescriptionData),
        });
    }
    
    async getTherapies(patientId) {
        return this.request(`/therapies/patient/${patientId}`);
    }
    
    // Lab results endpoints
    async getLabResults(patientId) {
        return this.request(`/lab-results/patient/${patientId}`);
    }
    
    async createLabResult(labResultData) {
        return this.request('/lab-results', {
            method: 'POST',
            body: JSON.stringify(labResultData),
        });
    }
    
    // Medical records endpoints
    async getMedicalRecords(patientId) {
        return this.request(`/medical-records/patient/${patientId}`);
    }
    
    async createMedicalRecord(recordData) {
        return this.request('/medical-records', {
            method: 'POST',
            body: JSON.stringify(recordData),
        });
    }
    
    // Refund endpoints
    async getRefunds(patientId) {
        return this.request(`/refunds/patient/${patientId}`);
    }
    
    async createRefund(refundData) {
        return this.request('/refunds', {
            method: 'POST',
            body: JSON.stringify(refundData),
        });
    }
    
    // Health logs endpoints
    async getHealthLogs(patientId, logType = null) {
        const endpoint = logType 
            ? `/health-logs/patient/${patientId}?log_type=${logType}`
            : `/health-logs/patient/${patientId}`;
        return this.request(endpoint);
    }
    
    async createHealthLog(logData) {
        return this.request('/health-logs', {
            method: 'POST',
            body: JSON.stringify(logData),
        });
    }
    
    // Reminders endpoints
    async getReminders(patientId) {
        return this.request(`/reminders/patient/${patientId}`);
    }
    
    async createReminder(reminderData) {
        return this.request('/reminders', {
            method: 'POST',
            body: JSON.stringify(reminderData),
        });
    }
    
    async updateReminder(reminderId, completed) {
        return this.request(`/reminders/${reminderId}?completed=${completed}`, {
            method: 'PUT',
        });
    }
    
    // Emergency contacts endpoints
    async getEmergencyContacts(patientId) {
        return this.request(`/emergency-contacts/patient/${patientId}`);
    }
    
    async createEmergencyContact(contactData) {
        return this.request('/emergency-contacts', {
            method: 'POST',
            body: JSON.stringify(contactData),
        });
    }
    
    // Healthcare facilities endpoints
    async getHealthcareFacilities(facilityType = null) {
        const endpoint = facilityType
            ? `/healthcare-facilities?facility_type=${facilityType}`
            : '/healthcare-facilities';
        return this.request(endpoint);
    }
    
    // Dashboard endpoint
    async getDashboard(patientId) {
        return this.request(`/dashboard/${patientId}`);
    }
}

// Create global API instance
const api = new ApiService();
