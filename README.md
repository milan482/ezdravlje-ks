# eZdravlje KS - Digitalni Zdravstveni Sistem Kantona Sarajevo

Kompletna full-stack demonstrator aplikacija za zdravstvo Kantona Sarajevo, namijenjena kao demonstrator za master rad. Aplikacija simulira digitalni zdravstveni sistem za građane sa mobile-first PWA-like iskustvom.

## 📋 Sadržaj

- [Tehnički stack](#tehnički-stack)
- [Funkcionalnosti](#funkcionalnosti)
- [Instalacija](#instalacija)
- [Pokretanje aplikacije](#pokretanje-aplikacije)
- [Demo podaci](#demo-podaci)
- [Struktura projekta](#struktura-projekta)
- [API dokumentacija](#api-dokumentacija)

## 🛠 Tehnički Stack

### Backend
- **Python** - Programski jezik
- **FastAPI** - Web framework
- **SQLAlchemy** - ORM
- **SQLite** - Baza podataka

### Frontend
- **HTML5** - Struktura
- **CSS3** - Stilovi
- **Vanilla JavaScript** - Logika
- **Mobile-first PWA** - Dizajn

## ✨ Funkcionalnosti

### 1. Autentikacija
- Splash screen
- Login sistem
- Registracija novih korisnika
- Demo login podaci

### 2. Profil Pacijenta
- Prikaz ličnih podataka
- Zdravstveni podaci (krvna grupa, alergije, hronične bolesti)
- Izabrani doktor
- Kontakt za hitne slučajeve
- Uređivanje profila
- Preuzimanje sažetka kartona

### 3. Upravljanje Terminima
- Zakazivanje termina kod doktora opšte prakse
- Zakazivanje termina kod specijaliste
- Pregled svih termina
- Filter po statusu (zakazano, završeno, otkazano)
- Otkazivanje termina
- Pomjeranje termina
- Prioritetni termini (hitni)

###  ️4. Recepti i Terapije
- Lista aktivnih recepata
- Historija recepata
- Status recepta (aktivan, iskorišten, istekao)
- Lista trenutnih terapija
- Detalji terapije (lijek, doza, vrijeme uzimanja, trajanje)

### 5. Laboratorijski Nalazi
- Pregled svih nalaza
- Pregled detalja nalaza
- Oznaka abnormalnih vrijednosti
- Filter po tipu (krvna slika, biohemija, šećer, holesterol, urin)

### 6. Medicinski Karton
- Historija bolesti
- Dijagnoze
- Hronična oboljenja
- Operacije
- Vakcinacije
- Hospitalizacije
- Timeline prikaz

### 7. Refundacije i Administracija
- Podnošenje zahtjeva za refundaciju
- Status refundacije (poslano, u obradi, odobreno, odbijeno)
- Historija refundacija

### 8. Health Tracking
- Praćenje krvnog pritiska
- Praćenje pulsa
- Praćenje nivoa šećera
- Praćenje saturacije
- Praćenje temperature
- Praćenje težine
- Historija mjerenja
- Statistike

### 9. Smart Podsjetnici
- Podsjetnici za terapiju
- Podsjetnici za termine
- Podsjetnici za kontrole
- Podsjetnici za laboratorijske nalaze
- Status (danas, sutra, kašnjen, završeno)

### 10. Hitni Modul
- SOS dugme za poziv hitne pomoći
- Prikaz osnovnih medicinskih podataka
- Krvna grupa
- Alergije
- Hronične bolesti
- Trenutne terapije
- Hitni kontakti

### 11. Mreža Zdravstvenih Ustanova
- Domovi zdravlja
- Bolnice
- Apoteke
- Dežurne ambulante
- Laboratorije
- Pretraga i filter
- Informacije o radnom vremenu

### 12. Navigacija
- Bottom navigation
- Home dashboard
- Quick actions
- Pregled aktivnih podsjetnika

## 📦 Instalacija

### Preduslovi
- Python 3.8 ili noviji
- pip (Python package manager)

### Koraci

1. **Klonirajte repozitorijum**
   ```bash
   cd C:\Users\user\CascadeProjects\ezdravlje-ks
   ```

2. **Instalirajte Python zavisnosti**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Inicijalizujte bazu podataka sa demo podacima**
   ```bash
   python seed_data.py
   ```

## 🚀 Pokretanje Aplikacije

### Pokretanje Backend-a (FastAPI)
```bash
cd backend
uvicorn main:app --reload
```

Backend će biti dostupan na: `http://localhost:8000`

API dokumentacija (Swagger UI): `http://localhost:8000/docs`

### Pokretanje Frontend-a

Frontend se servira kroz FastAPI static files. Nakon pokretanja backend-a, otvorite u browseru:

```
http://localhost:8000/static/index.html
```

ILI možete koristiti bilo koji static server:

```bash
cd frontend
python -m http.server 8001
```

Zatim otvorite: `http://localhost:8001`

## 👤 Demo Podaci

### Demo Korisnik
- **Email:** demo@ezdravlje.ba
- **Lozinka:** demo123
- **JMBG:** 1234567890123
- **Broj kartice osiguranja:** KS123456

### Demo Profil
- **Ime i prezime:** Amela Kovačević
- **Datum rođenja:** 15.05.1990
- **Krvna grupa:** A+
- **Alergije:** Penicilin
- **Hronične bolesti:** Hipertenzija
- **Izabrani doktor:** Dr. Mirsad Hadžić

### Demo Podaci
Aplikacija dolazi sa pre-populisanom bazom podataka koja uključuje:
- 2 demo korisnika
- 3 termina (zakazani, hitni, završeni)
- 2 recepta sa terapijama
- 3 laboratorijska nalaza
- 3 zapisa u medicinskom kartonu
- 1 refundacija u obradi
- 7 dana health logova
- 3 podsjetnika
- 2 hitna kontakta
- 7 zdravstvenih ustanova

## 📁 Struktura Projekta

```
ezdravlje-ks/
├── backend/
│   ├── main.py              # FastAPI aplikacija i API endpointi
│   ├── database.py          # SQLAlchemy modeli i database setup
│   ├── seed_data.py         # Script za generisanje demo podataka
│   ├── requirements.txt     # Python zavisnosti
│   └── ezdravlje_ks.db      # SQLite baza podataka (kreira se automatski)
│
├── frontend/
│   ├── index.html           # Glavna HTML strana
│   ├── manifest.json        # PWA manifest
│   ├── css/
│   │   └── styles.css       # CSS stilovi
│   ├── js/
│   │   ├── api.js           # API service layer
│   │   └── app.js           # Frontend logika
│   ├── pages/               # (za buduće proširenje)
│   └── components/          # (za buduće proširenje)
│
└── README.md                # Ovaj fajl
```

## 🔌 API Dokumentacija

### Auth Endpointi

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "demo@ezdravlje.ba",
  "password": "demo123"
}
```

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "jmbg": "1234567890123",
  "insurance_card_number": "KS123456",
  "first_name": "Ime",
  "last_name": "Prezime",
  "date_of_birth": "1990-01-01"
}
```

### Profile Endpointi

#### Get Profile
```http
GET /api/profiles/{profile_id}
```

#### Update Profile
```http
PUT /api/profiles/{profile_id}
Content-Type: application/json

{
  "first_name": "Ime",
  "last_name": "Prezime",
  "blood_type": "A+",
  ...
}
```

### Appointment Endpointi

#### Get Appointments
```http
GET /api/appointments/patient/{patient_id}
```

#### Create Appointment
```http
POST /api/appointments
Content-Type: application/json

{
  "patient_id": 1,
  "doctor_name": "Dr. Ime",
  "doctor_type": "opšta praksa",
  "facility": "Dom zdravlja",
  "date": "2026-07-15T10:00:00",
  "priority": false
}
```

#### Update Appointment Status
```http
PUT /api/appointments/{appointment_id}?status=završeno
```

#### Delete Appointment
```http
DELETE /api/appointments/{appointment_id}
```

### Ostali Endpointi

Slični endpointi postoje za:
- `/api/prescriptions/*` - Recepti
- `/api/therapies/*` - Terapije
- `/api/lab-results/*` - Laboratorijski nalazi
- `/api/medical-records/*` - Medicinski karton
- `/api/refunds/*` - Refundacije
- `/api/health-logs/*` - Health tracking
- `/api/reminders/*` - Podsjetnici
- `/api/emergency-contacts/*` - Hitni kontakti
- `/api/healthcare-facilities/*` - Zdravstvene ustanove
- `/api/dashboard/{patient_id}` - Dashboard podaci

Kompletna API dokumentacija je dostupna na: `http://localhost:8000/docs`

## 🎨 UI/UX Karakteristike

- **Mobile-first design** - Optimizirano za mobilne uređaje
- **PWA-like iskustvo** - Izgleda i osjeća se kao native aplikacija
- **Bottom navigation** - Intuitivna navigacija
- **Sticky header** - Uvijek vidljiv header
- **Cards layout** - Moderan card-based dizajn
- **Native-like transitions** - Glatke animacije
- **Responsive design** - Radi na svim uređajima
- **Touch-friendly** - Veliki tap targeti
- **Max width 430px** - Emulacija telefona na desktopu
- **Centered container** - Centriran prikaz na desktopu

## 🔐 Sigurnost

- Lozinke se čuvaju kao plain text (bez hashiranja)
- Nema JWT tokena
- Nema OAuth
- Nema kompleksne sigurnosti
- Svi podaci su demo podaci

## 📱 PWA Support

Aplikacija podržava PWA (Progressive Web App) funkcionalnosti:
- Manifest file za instalaciju
- Mobile app meta tagovi
- Standalone display mode
- Theme color

## 🚧 Buduća Proširenja

Moguća proširenja za produkciju:
- Hashiranje lozinki (bcrypt)
- JWT autentikacija
- OAuth integracija
- Email verifikacija
- Push notifikacije
- Real-time chat sa doktorima
- Video konsultacije
- E-prescription integracija
- PDF export
- Charts za health tracking
- Map integracija za ustanove

## 📝 Licence

Ovaj projekat je kreiran isključivo za edukativne svrhe (master rad).

## 👨‍💻 Autor

Master rad demonstrator - eZdravlje KS
