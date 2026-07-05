// Application State
let currentUser = null;
let currentProfile = null;
let currentPatientId = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Setup form handlers
    setupFormHandlers();

    // Render bottom navigation
    renderBottomNav();

    // Splash screen now waits for a tap — see startApp()
});

// Fired when the user taps the splash screen
function startApp() {
    const splash = document.getElementById('splash-screen');
    if (!splash || splash.dataset.dismissed === 'true') return; // prevent double-fire
    splash.dataset.dismissed = 'true';

    // small fade/scale-out for a smoother feel
    splash.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    splash.style.opacity = '0';
    splash.style.transform = 'scale(0.97)';

    setTimeout(() => {
        const savedUser = localStorage.getItem('current_user');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            currentProfile = currentUser.profile;
            currentPatientId = currentProfile.id;
            showPage('home-screen');
            loadDashboard();
        } else {
            showPage('login-screen');
        }

        // Remove splash entirely from the DOM so nothing can ever
        // show it again — no way to "scroll back" to it
        splash.remove();
    }, 300);
}

// Page Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    
    // Load data when showing specific pages
    if (pageId === 'home-screen' && currentPatientId) {
        loadDashboard();
    } else if (pageId === 'appointments-screen' && currentPatientId) {
        loadAppointments();
    } else if (pageId === 'prescriptions-screen' && currentPatientId) {
        loadPrescriptions();
    } else if (pageId === 'lab-results-screen' && currentPatientId) {
        loadLabResults();
    } else if (pageId === 'records-screen' && currentPatientId) {
        loadMedicalRecords();
    } else if (pageId === 'profile-screen' && currentPatientId) {
        loadProfile();
    } else if (pageId === 'health-tracking-screen' && currentPatientId) {
        loadHealthLogs();
    } else if (pageId === 'reminders-screen' && currentPatientId) {
        loadReminders();
    } else if (pageId === 'refunds-screen' && currentPatientId) {
        loadRefunds();
    } else if (pageId === 'facilities-screen') {
        loadFacilities();
    } else if (pageId === 'emergency-screen' && currentPatientId) {
        loadEmergencyData();
    }
}

// Form Handlers
function setupFormHandlers() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        try {
            const response = await api.login(email, password);
            currentUser = response;
            currentProfile = response.profile;
            currentPatientId = currentProfile.id;
            
            localStorage.setItem('current_user', JSON.stringify(currentUser));
            showPage('home-screen');
            loadDashboard();
            showNotification('Dobrodošli nazad!');
        } catch (error) {
            showNotification('Pogrešni podaci za prijavu');
        }
    });
    
    // Register form
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const userData = {
            email: document.getElementById('reg-email').value,
            password: document.getElementById('reg-password').value,
            jmbg: document.getElementById('reg-jmbg').value,
            insurance_card_number: document.getElementById('reg-insurance').value,
            first_name: document.getElementById('reg-first-name').value,
            last_name: document.getElementById('reg-last-name').value,
            date_of_birth: document.getElementById('reg-dob').value
        };
        
        try {
            const response = await api.register(userData);
            showNotification('Registracija uspješna! Molimo prijavite se.');
            showPage('login-screen');
        } catch (error) {
            showNotification('Greška prilikom registracije');
        }
    });
}

// Bottom Navigation
const navIcons = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"></path><path d="M9 22V12h6v10"></path></svg>',
    appointments: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h18"></path></svg>',
    prescriptions: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path><path d="m8.5 8.5 7 7"></path></svg>',
    'lab-results': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2v6.5L4.5 18a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L15 8.5V2"></path><path d="M9 2h6"></path><path d="M9 15h6"></path></svg>',
    profile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21a8 8 0 0 0-16 0"></path><circle cx="12" cy="7" r="4"></circle></svg>'
};

function renderBottomNav() {
    const navItems = [
        { id: 'home', label: 'Početna', screen: 'home-screen' },
        { id: 'appointments', label: 'Termini', screen: 'appointments-screen' },
        { id: 'prescriptions', label: 'Terapije', screen: 'prescriptions-screen' },
        { id: 'lab-results', label: 'Nalazi', screen: 'lab-results-screen' },
        { id: 'profile', label: 'Profil', screen: 'profile-screen' }
    ];
    
    const navHtml = navItems.map(item => `
        <button class="nav-item" onclick="showPage('${item.screen}')" data-nav="${item.id}">
            ${navIcons[item.id]}
            <span>${item.label}</span>
        </button>
    `).join('');
    
    document.querySelectorAll('#bottom-nav').forEach(nav => {
        nav.innerHTML = navHtml;
    });
}

// Dashboard
async function loadDashboard() {
    if (!currentPatientId) return;
    
    try {
        const dashboard = await api.getDashboard(currentPatientId);
        
        // Update profile header
        document.getElementById('dashboard-name').textContent = 
            `${currentProfile.first_name} ${currentProfile.last_name}`;
        document.getElementById('dashboard-doctor').textContent = currentProfile.selected_doctor || 'Nije odabran';
        document.getElementById('dashboard-avatar').textContent = 
            currentProfile.first_name.charAt(0).toUpperCase();
        
        // Next appointment
        if (dashboard.next_appointment) {
            const appointment = dashboard.next_appointment;
            document.getElementById('next-appointment-doctor').textContent = appointment.doctor_name;
            document.getElementById('next-appointment-date').textContent = formatDate(appointment.date);
            document.getElementById('next-appointment-facility').textContent = appointment.facility;
            document.getElementById('next-appointment-status').textContent = appointment.status;
        } else {
            document.getElementById('next-appointment-card').innerHTML = 
                '<p class="text-center" style="color: var(--text-secondary);">Nema zakazanih termina</p>';
        }
        
        // Active therapies
        const therapies = await api.getTherapies(currentPatientId);
        renderTherapiesList(therapies.slice(0, 3), 'active-therapies-list');
        
        // Recent results
        renderLabResultsList(dashboard.recent_results.slice(0, 3), 'recent-results-list');
        
        // Reminders
        const reminders = await api.getReminders(currentPatientId);
        renderRemindersList(reminders.filter(r => !r.completed).slice(0, 3), 'reminders-list');
        
        // Update nav active state
        updateNavActive('home');
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Appointments
async function loadAppointments() {
    if (!currentPatientId) return;
    
    try {
        const appointments = await api.getAppointments(currentPatientId);
        renderAppointmentsList(appointments);
        updateNavActive('appointments');
    } catch (error) {
        console.error('Error loading appointments:', error);
    }
}

function renderAppointmentsList(appointments) {
    const container = document.getElementById('appointments-list');
    
    if (appointments.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📅</div><div class="empty-state-text">Nema termina</div></div>';
        return;
    }
    
    const html = appointments.map(apt => `
        <div class="card">
            <div class="flex flex-between">
                <div>
                    <div class="card-title">${apt.doctor_name}</div>
                    <div class="card-subtitle">${apt.doctor_type}</div>
                </div>
                <span class="badge ${getStatusBadgeClass(apt.status)}">${apt.status}</span>
            </div>
            <div class="card-content mt-4">
                <div>📅 ${formatDate(apt.date)}</div>
                <div>🏥 ${apt.facility}</div>
                ${apt.priority ? '<div style="color: var(--danger-color); font-weight: 600;">⚠️ Hitno</div>' : ''}
            </div>
            ${apt.status === 'zakazano' ? `
                <div class="flex gap-2 mt-4">
                    <button class="btn btn-sm btn-secondary" onclick="cancelAppointment(${apt.id})">Otkaži</button>
                    <button class="btn btn-sm btn-primary" onclick="rescheduleAppointment(${apt.id})">Pomjeri</button>
                </div>
            ` : ''}
        </div>
    `).join('');
    
    container.innerHTML = html;
}

function filterAppointments() {
    const filter = document.getElementById('appointment-filter').value;
    loadAppointments().then(() => {
        // Filter logic would be implemented here
    });
}

async function cancelAppointment(appointmentId) {
    try {
        await api.updateAppointment(appointmentId, 'otkazano');
        showNotification('Termin otkazan');
        loadAppointments();
    } catch (error) {
        showNotification('Greška prilikom otkazivanja');
    }
}

function rescheduleAppointment(appointmentId) {
    showNotification('Funkcionalnost pomjeranja termina');
}

// Prescriptions
async function loadPrescriptions() {
    if (!currentPatientId) return;
    
    try {
        const prescriptions = await api.getPrescriptions(currentPatientId);
        renderPrescriptionsList(prescriptions);
        
        const therapies = await api.getTherapies(currentPatientId);
        renderTherapiesList(therapies, 'therapies-list');
        
        updateNavActive('prescriptions');
    } catch (error) {
        console.error('Error loading prescriptions:', error);
    }
}

function renderPrescriptionsList(prescriptions) {
    const container = document.getElementById('prescriptions-list');
    
    if (prescriptions.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">💊</div><div class="empty-state-text">Nema recepata</div></div>';
        return;
    }
    
    const html = prescriptions.map(rx => `
        <div class="card">
            <div class="flex flex-between">
                <div>
                    <div class="card-title">${rx.medication_name}</div>
                    <div class="card-subtitle">${rx.dosage} - ${rx.frequency}</div>
                </div>
                <span class="badge ${getStatusBadgeClass(rx.status)}">${rx.status}</span>
            </div>
            <div class="card-content mt-4">
                <div>👨‍⚕️ ${rx.doctor_name}</div>
                <div>📅 Izdato: ${formatDate(rx.issued_date)}</div>
                <div>⏰ Ističe: ${formatDate(rx.expiry_date)}</div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

function renderTherapiesList(therapies, containerId) {
    const container = document.getElementById(containerId);
    
    if (!therapies || therapies.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary);">Nema aktivnih terapija</p>';
        return;
    }
    
    const html = therapies.map(therapy => `
        <div class="card" style="padding: 12px; margin-bottom: 12px;">
            <div class="flex flex-between">
                <div>
                    <div style="font-weight: 600;">${therapy.medication_name}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">${therapy.dosage} - ${therapy.time_of_day}</div>
                </div>
                <span class="badge badge-success">Aktivno</span>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

// Lab Results
async function loadLabResults() {
    if (!currentPatientId) return;
    
    try {
        const results = await api.getLabResults(currentPatientId);
        renderLabResultsList(results);
        updateNavActive('lab-results');
    } catch (error) {
        console.error('Error loading lab results:', error);
    }
}

function renderLabResultsList(results, containerId = 'lab-results-list') {
    const container = document.getElementById(containerId);
    
    if (!results || results.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🔬</div><div class="empty-state-text">Nema nalaza</div></div>';
        return;
    }
    
    const html = results.map(result => `
        <div class="card">
            <div class="flex flex-between">
                <div>
                    <div class="card-title">${result.test_name}</div>
                    <div class="card-subtitle">${result.test_type}</div>
                </div>
                ${result.is_abnormal ? '<span class="badge badge-danger">Abnormalno</span>' : '<span class="badge badge-success">Normalno</span>'}
            </div>
            <div class="card-content mt-4">
                <div style="font-size: 18px; font-weight: 700; color: ${result.is_abnormal ? 'var(--danger-color)' : 'var(--success-color)'};">
                    ${result.result_value} ${result.unit}
                </div>
                <div style="font-size: 12px; color: var(--text-secondary);">Referentna vrijednost: ${result.reference_range}</div>
                <div>📅 ${formatDate(result.test_date)}</div>
                <div>🏥 ${result.facility}</div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

// Medical Records
async function loadMedicalRecords() {
    if (!currentPatientId) return;
    
    try {
        const records = await api.getMedicalRecords(currentPatientId);
        renderMedicalRecordsList(records);
        updateNavActive(null);
    } catch (error) {
        console.error('Error loading medical records:', error);
    }
}

function renderMedicalRecordsList(records) {
    const container = document.getElementById('records-list');
    
    if (!records || records.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><div class="empty-state-text">Nema zapisa u kartonu</div></div>';
        return;
    }
    
    const html = records.map(record => `
        <div class="card">
            <div class="flex flex-between">
                <div>
                    <div class="card-title">${record.name}</div>
                    <div class="card-subtitle">${record.record_type}</div>
                </div>
                <span class="badge badge-info">${formatDate(record.date)}</span>
            </div>
            <div class="card-content mt-4">
                <div>👨‍⚕️ ${record.doctor}</div>
                <div>🏥 ${record.facility}</div>
                <div style="margin-top: 8px; font-size: 13px;">${record.description}</div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

// Profile
async function loadProfile() {
    if (!currentPatientId) return;
    
    try {
        const profile = await api.getProfile(currentPatientId);
        currentProfile = profile;
        
        document.getElementById('profile-avatar-display').textContent = profile.first_name.charAt(0);
        document.getElementById('profile-name-display').textContent = `${profile.first_name} ${profile.last_name}`;
        document.getElementById('profile-jmbg-display').textContent = currentUser.jmbg;
        document.getElementById('profile-dob').textContent = formatDate(profile.date_of_birth);
        document.getElementById('profile-blood').textContent = profile.blood_type || 'Nije navedeno';
        document.getElementById('profile-insurance').textContent = currentUser.insurance_card_number;
        document.getElementById('profile-allergies').textContent = profile.allergies || 'Nema';
        document.getElementById('profile-chronic').textContent = profile.chronic_diseases || 'Nema';
        document.getElementById('profile-doctor').textContent = profile.selected_doctor || 'Nije odabran';
        
        // Emergency contacts
        const contacts = await api.getEmergencyContacts(currentPatientId);
        if (contacts.length > 0) {
            document.getElementById('emergency-contact-name').textContent = contacts[0].name;
            document.getElementById('emergency-contact-phone').textContent = contacts[0].phone;
        }
        
        updateNavActive('profile');
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Health Tracking
async function loadHealthLogs() {
    if (!currentPatientId) return;
    
    try {
        const logs = await api.getHealthLogs(currentPatientId);
        renderHealthLogsList(logs);
        updateNavActive(null);
        
        // Calculate averages
        if (logs.length > 0) {
            const bpLogs = logs.filter(l => l.log_type === 'blood pressure');
            const pulseLogs = logs.filter(l => l.log_type === 'pulse');
            const sugarLogs = logs.filter(l => l.log_type === 'sugar');
            
            if (bpLogs.length > 0) {
                document.getElementById('bp-pressure').textContent = bpLogs[0].value;
            }
            if (pulseLogs.length > 0) {
                document.getElementById('pulse-rate').textContent = pulseLogs[0].value;
            }
            if (sugarLogs.length > 0) {
                document.getElementById('sugar-level').textContent = sugarLogs[0].value;
            }
        }
    } catch (error) {
        console.error('Error loading health logs:', error);
    }
}

function renderHealthLogsList(logs) {
    const container = document.getElementById('health-logs-list');
    
    if (!logs || logs.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">❤️</div><div class="empty-state-text">Nema mjerenja</div></div>';
        return;
    }
    
    const html = logs.map(log => `
        <div class="card" style="padding: 12px; margin-bottom: 12px;">
            <div class="flex flex-between">
                <div>
                    <div style="font-weight: 600;">${getLogTypeLabel(log.log_type)}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">${formatDate(log.logged_date)}</div>
                </div>
                <div style="font-weight: 700; color: var(--primary-color);">${log.value} ${log.unit}</div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

// Reminders
async function loadReminders() {
    if (!currentPatientId) return;
    
    try {
        const reminders = await api.getReminders(currentPatientId);
        renderRemindersList(reminders, 'reminders-full-list');
        updateNavActive(null);
    } catch (error) {
        console.error('Error loading reminders:', error);
    }
}

function renderRemindersList(reminders, containerId) {
    const container = document.getElementById(containerId);
    
    if (!reminders || reminders.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary);">Nema podsjetnika</p>';
        return;
    }
    
    const html = reminders.map(reminder => `
        <div class="card" style="padding: 12px; margin-bottom: 12px;">
            <div class="flex flex-between">
                <div>
                    <div style="font-weight: 600;">${reminder.title}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">${reminder.description}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">📅 ${formatDate(reminder.reminder_date)}</div>
                </div>
                <div class="flex gap-2">
                    <span class="badge ${getReminderStatusClass(reminder.status)}">${reminder.status}</span>
                    ${!reminder.completed ? `<button class="btn btn-sm btn-success" onclick="completeReminder(${reminder.id})">✓</button>` : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

async function completeReminder(reminderId) {
    try {
        await api.updateReminder(reminderId, true);
        showNotification('Podsjetnik završen');
        loadReminders();
    } catch (error) {
        showNotification('Greška');
    }
}

// Refunds
async function loadRefunds() {
    if (!currentPatientId) return;
    
    try {
        const refunds = await api.getRefunds(currentPatientId);
        renderRefundsList(refunds);
        updateNavActive(null);
    } catch (error) {
        console.error('Error loading refunds:', error);
    }
}

function renderRefundsList(refunds) {
    const container = document.getElementById('refunds-list');
    
    if (!refunds || refunds.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">💰</div><div class="empty-state-text">Nema refundacija</div></div>';
        return;
    }
    
    const html = refunds.map(refund => `
        <div class="card">
            <div class="flex flex-between">
                <div>
                    <div class="card-title">${refund.description}</div>
                    <div class="card-subtitle">${formatDate(refund.submitted_date)}</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: 700; color: var(--primary-color);">${refund.amount} KM</div>
                    <span class="badge ${getRefundStatusClass(refund.status)}">${refund.status}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

// Healthcare Facilities
async function loadFacilities() {
    try {
        const facilities = await api.getHealthcareFacilities();
        renderFacilitiesList(facilities);
        updateNavActive(null);
    } catch (error) {
        console.error('Error loading facilities:', error);
    }
}

function renderFacilitiesList(facilities) {
    const container = document.getElementById('facilities-list');
    
    if (!facilities || facilities.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🏥</div><div class="empty-state-text">Nema ustanova</div></div>';
        return;
    }
    
    const html = facilities.map(facility => `
        <div class="card">
            <div class="card-title">${facility.name}</div>
            <div class="card-subtitle">${facility.type}</div>
            <div class="card-content mt-4">
                <div>📍 ${facility.address}</div>
                <div>📞 ${facility.phone}</div>
                <div>🕐 ${facility.working_hours}</div>
            </div>
            <button class="btn btn-sm btn-primary mt-4" onclick="callFacility('${facility.phone}')">Pozovi</button>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

function searchFacilities() {
    const searchTerm = document.getElementById('facility-search').value.toLowerCase();
    loadFacilities().then(() => {
        const cards = document.querySelectorAll('#facilities-list .card');
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });
    });
}

function filterFacilities() {
    const filterType = document.getElementById('facility-type-filter').value;
    loadFacilities().then(() => {
        if (filterType !== 'all') {
            const cards = document.querySelectorAll('#facilities-list .card');
            cards.forEach(card => {
                const subtitle = card.querySelector('.card-subtitle').textContent.toLowerCase();
                card.style.display = subtitle.includes(filterType) ? 'block' : 'none';
            });
        }
    });
}

// Emergency
async function loadEmergencyData() {
    if (!currentPatientId) return;
    
    try {
        document.getElementById('emergency-blood').textContent = currentProfile.blood_type || 'Nije navedeno';
        document.getElementById('emergency-allergies').textContent = currentProfile.allergies || 'Nema';
        document.getElementById('emergency-chronic').textContent = currentProfile.chronic_diseases || 'Nema';
        
        const therapies = await api.getTherapies(currentPatientId);
        const therapiesHtml = therapies.map(t => `
            <div class="list-item">
                <div class="list-item-content">
                    <div class="list-item-title">${t.medication_name}</div>
                    <div class="list-item-subtitle">${t.dosage}</div>
                </div>
            </div>
        `).join('');
        document.getElementById('emergency-therapies').innerHTML = therapiesHtml || '<p style="color: var(--text-secondary);">Nema aktivnih terapija</p>';
        
        const contacts = await api.getEmergencyContacts(currentPatientId);
        const contactsHtml = contacts.map(c => `
            <div class="list-item">
                <div class="list-item-content">
                    <div class="list-item-title">${c.name} (${c.relationship})</div>
                    <div class="list-item-subtitle">${c.phone}</div>
                </div>
            </div>
        `).join('');
        document.getElementById('emergency-contacts-list').innerHTML = contactsHtml || '<p style="color: var(--text-secondary);">Nema kontakata</p>';
    } catch (error) {
        console.error('Error loading emergency data:', error);
    }
}

function callEmergency() {
    if (confirm('Da li želite pozvati hitnu pomoć (124)?')) {
        window.location.href = 'tel:124';
    }
}

function callAmbulance() {
    window.location.href = 'tel:124';
}

function callEmergencyContact() {
    const contacts = document.querySelectorAll('#emergency-contacts-list .list-item-title');
    if (contacts.length > 0) {
        const phone = contacts[0].nextElementSibling.textContent;
        window.location.href = `tel:${phone}`;
    }
}

function callFacility(phone) {
    window.location.href = `tel:${phone}`;
}

// Modal Functions
function showNewAppointmentModal() {
    const modalContent = `
        <div class="modal-header">
            <h3 class="modal-title">Novi termin</h3>
            <button class="modal-close" onclick="closeModal()">×</button>
        </div>
        <form id="new-appointment-form">
            <div class="form-group">
                <label class="form-label">Tip doktora</label>
                <select class="form-select" id="apt-doctor-type" required>
                    <option value="opšta praksa">Opšta praksa</option>
                    <option value="kardiolog">Kardiolog</option>
                    <option value="dermatolog">Dermatolog</option>
                    <option value="pedijatar">Pedijatar</option>
                    <option value="ginekolog">Ginekolog</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Datum i vrijeme</label>
                <input type="datetime-local" class="form-input" id="apt-date" required>
            </div>
            <div class="form-group">
                <label class="form-label">Ustanova</label>
                <input type="text" class="form-input" id="apt-facility" placeholder="Dom zdravlja Centar" required>
            </div>
            <div class="form-group">
                <label class="form-label">Napomene</label>
                <textarea class="form-input" id="apt-notes" rows="3"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Zakaži termin</button>
        </form>
    `;
    showModal(modalContent);
    
    document.getElementById('new-appointment-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const appointmentData = {
            patient_id: currentPatientId,
            doctor_name: 'Doktor',
            doctor_type: document.getElementById('apt-doctor-type').value,
            facility: document.getElementById('apt-facility').value,
            date: document.getElementById('apt-date').value,
            notes: document.getElementById('apt-notes').value,
            priority: false
        };
        
        try {
            await api.createAppointment(appointmentData);
            showNotification('Termin zakazan');
            closeModal();
            loadAppointments();
        } catch (error) {
            showNotification('Greška prilikom zakazivanja');
        }
    });
}

function showAddHealthLogModal() {
    const modalContent = `
        <div class="modal-header">
            <h3 class="modal-title">Novo mjerenje</h3>
            <button class="modal-close" onclick="closeModal()">×</button>
        </div>
        <form id="new-health-log-form">
            <div class="form-group">
                <label class="form-label">Tip mjerenja</label>
                <select class="form-select" id="log-type" required>
                    <option value="blood pressure">Krvni pritisak</option>
                    <option value="pulse">Puls</option>
                    <option value="sugar">Šećer</option>
                    <option value="saturation">Saturacija</option>
                    <option value="temperature">Temperatura</option>
                    <option value="weight">Težina</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Vrijednost</label>
                <input type="text" class="form-input" id="log-value" placeholder="120/80" required>
            </div>
            <div class="form-group">
                <label class="form-label">Jedinica</label>
                <input type="text" class="form-input" id="log-unit" placeholder="mmHg" required>
            </div>
            <button type="submit" class="btn btn-primary">Sačuvaj</button>
        </form>
    `;
    showModal(modalContent);
    
    document.getElementById('new-health-log-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const logData = {
            patient_id: currentPatientId,
            log_type: document.getElementById('log-type').value,
            value: document.getElementById('log-value').value,
            unit: document.getElementById('log-unit').value,
            notes: ''
        };
        
        try {
            await api.createHealthLog(logData);
            showNotification('Mjerenje sačuvano');
            closeModal();
            loadHealthLogs();
        } catch (error) {
            showNotification('Greška');
        }
    });
}

function showAddReminderModal() {
    const modalContent = `
        <div class="modal-header">
            <h3 class="modal-title">Novi podsjetnik</h3>
            <button class="modal-close" onclick="closeModal()">×</button>
        </div>
        <form id="new-reminder-form">
            <div class="form-group">
                <label class="form-label">Tip</label>
                <select class="form-select" id="reminder-type" required>
                    <option value="terapija">Terapija</option>
                    <option value="termin">Termin</option>
                    <option value="kontrola">Kontrola</option>
                    <option value="laboratorijski nalaz">Laboratorijski nalaz</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Naslov</label>
                <input type="text" class="form-input" id="reminder-title" required>
            </div>
            <div class="form-group">
                <label class="form-label">Opis</label>
                <textarea class="form-input" id="reminder-description" rows="2"></textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Datum i vrijeme</label>
                <input type="datetime-local" class="form-input" id="reminder-date" required>
            </div>
            <button type="submit" class="btn btn-primary">Sačuvaj</button>
        </form>
    `;
    showModal(modalContent);
    
    document.getElementById('new-reminder-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const reminderData = {
            patient_id: currentPatientId,
            reminder_type: document.getElementById('reminder-type').value,
            title: document.getElementById('reminder-title').value,
            description: document.getElementById('reminder-description').value,
            reminder_date: document.getElementById('reminder-date').value
        };
        
        try {
            await api.createReminder(reminderData);
            showNotification('Podsjetnik kreiran');
            closeModal();
            loadReminders();
        } catch (error) {
            showNotification('Greška');
        }
    });
}

function showModal(content) {
    document.getElementById('modal-content').innerHTML = content;
    document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

function showUploadModal() {
    showNotification('Funkcionalnost upload-a nalaza');
}

function showRefundModal() {
    showNotification('Funkcionalnost refundacije');
}

function showEditProfileModal() {
    showNotification('Funkcionalnost uređivanja profila');
}

function downloadKartonSummary() {
    showNotification('Preuzimanje sažetka kartona...');
}

// Utility Functions
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('bs-BA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getStatusBadgeClass(status) {
    switch (status) {
        case 'zakazano':
        case 'aktivan':
            return 'badge-primary';
        case 'završeno':
        case 'iskorišten':
        case 'odobreno':
            return 'badge-success';
        case 'otkazano':
        case 'istekao':
        case 'odbijeno':
            return 'badge-danger';
        case 'u obradi':
            return 'badge-warning';
        default:
            return 'badge-info';
    }
}

function getReminderStatusClass(status) {
    switch (status) {
        case 'danas':
            return 'badge-danger';
        case 'sutra':
            return 'badge-warning';
        case 'kašnjen':
            return 'badge-danger';
        case 'završeno':
            return 'badge-success';
        default:
            return 'badge-info';
    }
}

function getRefundStatusClass(status) {
    switch (status) {
        case 'odobreno':
            return 'badge-success';
        case 'odbijeno':
            return 'badge-danger';
        case 'u obradi':
            return 'badge-warning';
        default:
            return 'badge-info';
    }
}

function getLogTypeLabel(type) {
    const labels = {
        'blood pressure': 'Krvni pritisak',
        'pulse': 'Puls',
        'sugar': 'Šećer',
        'saturation': 'Saturacija',
        'temperature': 'Temperatura',
        'weight': 'Težina'
    };
    return labels[type] || type;
}

function updateNavActive(activeId) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.nav === activeId) {
            item.classList.add('active');
        }
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function logout() {
    localStorage.removeItem('current_user');
    currentUser = null;
    currentProfile = null;
    currentPatientId = null;
    showPage('login-screen');
    showNotification('Odjavljeni ste');
}

// Close modal on overlay click
document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') {
        closeModal();
    }
});
