# 🏥 RSU Delima - Sistem Reservasi Rumah Sakit

Selamat datang di **RSU Delima Hospital Appointment System**, sebuah aplikasi web modern untuk memudahkan pasien dalam membuat janji temu dengan dokter di RSU Delima.

> **📅 Last Updated: June 2025** - Continuously updated dengan fitur-fitur terbaru dan improvements

## 🌐 Live Demo

**🚀 [Akses Aplikasi Live Demo](https://ristokuy.github.io/web_rsu_delima/)**

Coba langsung aplikasi RSU Delima Hospital Appointment System di GitHub Pages! Demo ini mencakup:
- ✅ **Patient Interface**: Booking appointments dan profile management
- ✅ **Enhanced Admin Console**: Data management, advanced patient visit reports, dan mock data testing
- ✅ **Doctor Dashboard**: Appointment verification dan schedule management  
- ✅ **Advanced Reporting**: Multiple report types dengan analytics dan export capabilities
- ✅ **Mock Data System**: Generate realistic test data untuk comprehensive testing
- ✅ **Fully Responsive**: Mobile dan desktop support dengan optimal layouts
- ✅ **Real-time Features**: Live data updates dengan interaktivitas penuh

## 🆕 Recent Updates & Improvements

### ✨ Latest Features (June 2025)
- **📄 Dedicated Appointment Page**: New `appoint.html` untuk enhanced booking experience
- **🎨 Professional Visual Assets**: Added hospital logos dan background images
- **📊 Enhanced Mock Data**: Comprehensive `mockData.json` dengan 100+ realistic user accounts
- **🏥 Improved Hospital Branding**: Consistent RSU Delima branding throughout aplikasi
- **🖼️ Visual Enhancement**: Professional medical imagery untuk authentic hospital atmosphere

### 🔧 Technical Improvements
- **File Organization**: Better asset management dengan dedicated `assets/` folder
- **Image Optimization**: Optimized images untuk better performance
- **Brand Consistency**: Unified visual identity dengan professional hospital logos
- **Data Structure**: Well-organized JSON data structure untuk easier development

### 🚀 Performance Enhancements
- **Asset Management**: Organized asset structure untuk faster loading
- **Visual Optimization**: Compressed images tanpa quality loss
- **Code Organization**: Improved file structure untuk better maintainability

## 📋 Deskripsi

RSU Delima adalah sistem reservasi online yang memungkinkan pasien untuk:
- Mendaftar dan login ke sistem
- Mencari dokter berdasarkan poliklinik
- Melihat jadwal dokter yang tersedia
- Membuat janji temu dengan dokter
- Mengelola riwayat janji temu
- Mengelola profil pengguna

## ✨ Fitur Utama

### 🔐 Autentikasi Multi-Role (Pass-through for Prototype)
- **Login Pasien**: Masuk sebagai pasien dengan email dan password
- **Login Admin**: Akses ke admin console untuk manajemen data
- **Login Dokter**: Akses khusus dokter untuk appointment management
- **Registrasi**: Pendaftaran akun baru dengan informasi lengkap
- **Logout**: Keluar dari sistem dengan aman
- **Navigation Hiding**: Navigation bars tersembunyi pada halaman login/signup

### ⚙️ Admin Console (ENHANCED!)
- **Dashboard Statistics**: Statistik real-time pasien, jadwal dokter, slot tersedia, dan tingkat utilisasi
- **Patient Data Verification**: Verifikasi, edit, dan hapus data pasien dengan interface CRUD lengkap
- **Doctor Schedule Management**: Kelola jadwal dokter dengan operasi CRUD lengkap dan tracking kuota
- **Advanced Patient Visit Reports (Rekap Kunjungan Pasien)**: Sistem pelaporan komprehensif dengan:
  - **Multiple Report Types**: Laporan harian, mingguan, dan bulanan
  - **Advanced Analytics**: Total kunjungan, pasien unik, rata-rata per hari, poliklinik tersibuk
  - **Polyclinic Service Reports**: Breakdown detil per poliklinik dengan utilisasi dan statistik
  - **Schedule Service Reports**: Analisis per jadwal dokter dengan tracking kapasitas
  - **Doctor Performance Reports**: Daftar kunjungan per dokter dengan jadwal dan utilization rate
  - **Enhanced Detail Visit Lists**: Tabel responsif lengkap dengan status, waktu, dan queue numbers
  - **CSV Export**: Export laporan ke format CSV untuk analisis spreadsheet
  - **Mobile Optimized**: Layout responsif untuk monitoring di semua perangkat
- **Mock Data Management (NEW!)**: Sistem testing data yang powerful:
  - **Random Data Generator**: Generate 60+ kunjungan realistis untuk testing
  - **Data Reset Functionality**: Reset ke data original untuk clean testing
  - **Realistic Indonesian Data**: Nama pasien, dokter, dan jadwal yang sesuai konteks lokal
  - **Date Range Testing**: Data tersebar 30 hari terakhir untuk testing berbagai periode
- **Enhanced UI**: Kartu statistik interaktif dengan visual indicators dan color coding
- **Quick Stats Dashboard**: Overview cepat poliklinik aktif, jadwal hari ini, dan rata-rata utilisasi
- **Responsive Design**: Optimal untuk desktop dan mobile devices dengan adaptive layouts
- **Modular Architecture**: File terpisah untuk maintainability (admin_index.html, admin_script.js, admin_style.css)

### 👨‍⚕️ Doctor Dashboard (ENHANCED!)
- **Advanced Real-time Statistics Dashboard**: 
  - Dashboard komprehensif dengan data janji temu hari ini, jadwal mingguan, dan slot tersedia
  - Visual indicators dengan progress bars dan color-coded status
  - Live metrics tracking untuk appointment load dan availability
  - Quick stats cards dengan trend analysis dan performance metrics
- **Comprehensive Appointment Management**: Validasi dan verifikasi janji temu pasien dengan fitur lengkap:
  - **Today's Appointments View**: Filter appointments "Hari Ini" dan "Semua" dengan smart filtering
  - **Detailed Patient Information**: Detail lengkap pasien termasuk keluhan, nomor telepon, medical history, dan status terkini
  - **Advanced Status Management**: Konfirmasi, batalkan, atau reschedule janji temu dengan alasan pembatalan dan notifications
  - **Real-time Updates**: Pembaruan status langsung dengan live notifications dan patient communication
  - **Queue Management**: Tracking nomor antrian, estimasi waktu tunggu, dan patient flow optimization
- **Enhanced Schedule Management**: Kelola jadwal praktek dokter dengan operasi lengkap dan intelligent features:
  - **Add New Schedule**: Tambah jadwal praktek baru dengan hari, waktu, kuota, dan automated conflict detection
  - **Smart Edit Schedule**: Ubah waktu praktek, kuota pasien, jumlah terdaftar dengan validation dan impact analysis
  - **Toggle Status Management**: Aktifkan/non-aktifkan jadwal praktek dengan patient notification system
  - **Advanced Progress Tracking**: Visual progress bars untuk kuota pasien terdaftar vs tersedia dengan utilization analytics
  - **Schedule Templates**: Pre-defined schedule patterns untuk recurring appointments
- **Patient Communication System**:
  - **Appointment Confirmations**: Automated confirmation messages dengan appointment details
  - **Status Updates**: Real-time patient notifications untuk schedule changes
  - **Cancellation Management**: Professional cancellation handling dengan rescheduling options
- **Performance Analytics**:
  - **Daily/Weekly/Monthly Reports**: Comprehensive analytics untuk appointment trends
  - **Patient Load Analysis**: Tracking patient volume dan peak hours
  - **Utilization Metrics**: Schedule efficiency dan capacity optimization insights
- **Role-based Security**: Advanced access control terbatas untuk dokter yang login dengan multi-layer authentication
- **Mobile-First Responsive Interface**: Dashboard optimal untuk semua ukuran layar dengan touch-optimized controls
- **Modular Architecture**: Clean separation dengan file terpisah (dokter_index.html, dokter_script.js, dokter_style.css) untuk maintainability

### 🏥 Poliklinik Tersedia
1.  **Poli Umum (General Medicine)** 🩺
    -   Pelayanan kesehatan primer untuk kondisi medis umum
2.  **Kardiologi (Cardiology)** ❤️
    -   Spesialis jantung dan sistem kardiovaskular
3.  **Anak (Pediatrics)** 👶
    -   Perawatan medis untuk bayi, anak-anak, dan remaja
4.  **Ortopedi (Orthopedics)** 🦴
    -   Perawatan tulang, sendi, dan sistem muskuloskeletal
5.  **Kulit dan Kelamin (Dermatology & Venereology)** 🧴
    -   Perawatan kondisi kulit, rambut, kuku, dan penyakit menular seksual
6.  **Mata (Ophthalmology)** 👁️
    -   Spesialis perawatan mata dan penglihatan

### 👨‍⚕️ Dokter Tersedia (Mock Data)

#### Poli Umum
-   **Dr. Sarah Johnson** - Dokter Umum
    -   Pengalaman 10+ tahun dalam kedokteran keluarga.
    -   Jadwal: Senin-Jumat (09:00-11:00, 14:00-15:00), Rabu (09:00-11:00)

#### Kardiologi
-   **Dr. Michael Chen** - Dokter Spesialis Jantung
    -   Spesialis pencegahan dan pengobatan penyakit jantung.
    -   Jadwal: Senin, Rabu, Jumat (10:00-11:00, 14:00-16:00), Rabu (10:00-11:00, 14:00-15:00)

#### Anak
-   **Dr. Emily Rodriguez** - Dokter Spesialis Anak
    -   Ahli dalam perkembangan anak dan perawatan pediatrik.
    -   Jadwal: Selasa, Kamis (09:00-11:00, 14:00), Sabtu (09:00-11:00)

#### Ortopedi
-   **Dr. Robert Wilson** - Dokter Bedah Ortopedi
    -   Spesialis penggantian sendi dan kedokteran olahraga.
    -   Jadwal: Senin, Rabu (08:00-10:00, 14:00), Jumat (08:00-10:00)

#### Kulit dan Kelamin
-   **Dr. Lisa Thompson** - Dokter Spesialis Kulit dan Kelamin
    -   Ahli deteksi kanker kulit dan prosedur kosmetik.
    -   Jadwal: Selasa, Kamis (10:00-11:00, 14:00-15:00), Sabtu (10:00-11:00)

#### Mata
-   **Dr. David Kim** - Dokter Spesialis Mata
    -   Spesialis penyakit retina dan operasi katarak.
    -   Jadwal: Senin, Rabu (09:00-11:00, 15:00), Jumat (09:00-11:00)

### 📅 Fitur Reservasi
-   **Pilih Poliklinik**: Browse poliklinik berdasarkan kategori
-   **Pilih Dokter**: Lihat profil dan spesialisasi dokter
-   **Pilih Jadwal**: Pilih tanggal dan waktu yang tersedia
-   **Konfirmasi Booking**: Konfirmasi detail janji temu
-   **(Opsional) Isi Keterangan/Keluhan**: Tambahkan catatan untuk dokter
-   **Nomor Antrian**: Dapatkan nomor antrian otomatis
-   **Estimasi Waktu Tunggu**: Lihat perkiraan waktu tunggu antrian ⏳
-   **Status Tracking**: Pantau status janji temu (confirmed, cancelled, completed, rescheduled)

### 📱 Manajemen Janji Temu
-   **Janji Mendatang**: Lihat janji temu yang akan datang
-   **Riwayat**: Lihat janji temu yang sudah selesai atau dibatalkan
-   **Pembatalan**: Batalkan janji temu jika diperlukan
-   **Jadwal Ulang**: Ubah jadwal janji temu yang sudah ada
-   **Detail Lengkap**: Informasi dokter, waktu, nomor antrian, keluhan, dan estimasi waktu tunggu

### 📊 Advanced Patient Visit Reports (Rekap Kunjungan Pasien)
- **Multiple Report Generation Types**:
  - **📊 Standard Reports**: Laporan berdasarkan periode waktu (daily/weekly/monthly)
  - **🏥 Polyclinic Service Reports**: Rekap detail layanan per poliklinic dengan analytics
  - **🗓️ Schedule Service Reports**: Analisis utilisasi per jadwal dokter
- **Comprehensive Analytics Dashboard**:
  - Total kunjungan dalam periode dengan trend analysis
  - Jumlah pasien unik dan returning patients
  - Rata-rata kunjungan per hari dengan projections
  - Poliklinic tersibuk dengan ranking system
  - Tingkat utilisasi jadwal dan kapasitas
- **Advanced Breakdown Reports**:
  - **By Polyclinic**: Distribusi kunjungan dengan persentase, utilisasi rate, dan trend
  - **By Doctor**: Performance metrics per dokter dengan jadwal dan patient load
  - **By Schedule**: Analisis slot usage, waiting times, dan capacity optimization
- **Enhanced Detail Visit Management**:
  - Tabel responsif dengan sorting dan filtering capabilities
  - Real-time status tracking (Selesai, Sedang Dilayani, Menunggu)
  - Queue management dengan nomor antrian dan estimasi waktu
  - Patient journey tracking dari registrasi hingga selesai
- **Mock Data Testing System (NEW!)**:
  - **🎲 Generate Mock Data**: Creates 60+ realistic patient visits over last 30 days
  - **🔄 Reset Data**: Reset to original 25 visits for clean testing
  - **Realistic Data**: Indonesian names, proper medical specialties, time slots
  - **Date Distribution**: Spread across different periods for comprehensive testing
- **Export & Analytics**:
  - CSV export dengan customizable fields
  - Print-friendly report layouts
  - Real-time data refresh dengan auto-update
- **Mobile-First Design**: Layout optimal untuk monitoring di semua perangkat dengan touch-friendly controls

### 👤 Profil Pengguna
- **Informasi Pribadi**: Kelola data pribadi
- **Kontak**: Update nomor telepon dan alamat
- **BPJS**: Informasi nomor BPJS
- **Keamanan**: Ubah password

## 🛠️ Teknologi yang Digunakan

### Frontend
- **HTML5**: Struktur halaman web dengan semantic markup dan accessibility features
- **CSS3**: Advanced styling dengan Flexbox, Grid, animations, dan responsive design
- **Tailwind CSS**: Utility-first CSS framework untuk rapid development dan consistent styling
- **JavaScript (ES6+)**: Modern JavaScript dengan modules, async/await, dan advanced DOM manipulation
- **Responsive Design**: Mobile-first approach dengan adaptive layouts dan touch optimization

### Advanced Features
- **Single Page Application (SPA)**: Navigasi halaman tanpa reload dengan smooth transitions
- **Dedicated Appointment Page**: Specialized booking interface dengan enhanced user experience
- **Rich Visual Assets**: Professional logos dan background images untuk branding consistency
- **Comprehensive Mock Data**: Realistic Indonesian data dengan 100+ user accounts dan medical records
- **Local Storage & Session Storage**: Persistent data storage untuk user preferences dan session data
- **Advanced Mock Data System**: Intelligent data generation dengan realistic Indonesian context
- **Progressive Enhancement**: Graceful degradation untuk berbagai browser capabilities
- **Modular Architecture**: Component-based structure untuk maintainability dan scalability
- **CRUD Operations**: Full Create, Read, Update, Delete operations dengan validation
- **Dynamic Navigation**: Context-aware navigation dengan role-based access control
- **Real-time Analytics**: Live data processing dan reporting dengan interactive dashboards
- **Export Functionality**: Multi-format export (CSV, PDF) dengan customizable templates
- **Performance Optimization**: Lazy loading, caching, dan optimized asset delivery

## 📁 Struktur File

```
web_rsu_delima/
├── index.html                  # Halaman utama dengan semua patient views
├── appoint.html               # Dedicated appointment booking page
├── script.js                  # Logika aplikasi JavaScript untuk patient
├── style.css                  # Custom CSS styling untuk patient interface
├── admin/
│   ├── admin_index.html       # Admin console interface
│   ├── admin_script.js        # Admin-specific JavaScript logic
│   └── admin_style.css        # Admin console styling
├── dokter/
│   ├── dokter_index.html      # Doctor dashboard interface
│   ├── dokter_script.js       # Doctor-specific JavaScript logic
│   └── dokter_style.css       # Doctor dashboard styling
├── assets/
│   ├── mockData.json          # Comprehensive mock data untuk testing
│   ├── hero_bg.png           # Background image untuk hero section
│   ├── room_bg.png           # Background image untuk room section
│   └── icons/
│       ├── logo_rsu_delima.png       # Logo RSU Delima dengan background
│       └── logo_rsu_delima-no_bg.png # Logo RSU Delima transparan
├── .gitignore                 # Git ignore file
└── README.md                  # Dokumentasi project
```

## 🚀 Cara Menjalankan

### 🌐 Opsi 1: Live Demo (Tercepat)
**[🔗 Akses langsung di GitHub Pages](https://ristokuy.github.io/web_rsu_delima/)**
- Tidak perlu instalasi atau download
- Akses langsung ke semua fitur
- Mobile dan desktop ready

### 💻 Opsi 2: Lokal Development
1. **Clone atau Download** project ini
2. **Buka file `index.html`** di browser web untuk patient interface
3. **Akses Appointment Page** melalui `appoint.html` untuk dedicated booking experience
4. **Akses Admin Console** melalui `admin/admin_index.html` atau login sebagai admin
5. **Akses Doctor Dashboard** melalui `dokter/dokter_index.html` atau login sebagai dokter
6. **Mulai menggunakan** aplikasi dengan:
   - **Patient Login**: Email dan password apa saja (prototype mode)
   - **Admin Login**: Email dan password apa saja, pilih "Admin" pada toggle
   - **Doctor Login**: Email dan password apa saja, pilih "Dokter" pada toggle
   - **Demo Account**: `john@example.com` / `password123`
   - **Registrasi**: Buat akun baru melalui fitur registrasi

### Login Options
- 👤 **Pasien**: Akses ke booking appointments dan profile management
- ⚙️ **Admin**: Akses ke admin console untuk data management dan patient visit reports
- 👨‍⚕️ **Dokter**: Akses ke doctor dashboard untuk appointment verification dan schedule management

## 🛠️ Development & Deployment

### Version Control
- **Git Integration**: Project menggunakan Git untuk version control
- **VS Code Support**: Optimized untuk development dengan VS Code
- **Modular Development**: Separate files untuk different roles dan functionality

### Development Workflow
1. **Frontend Development**: HTML5, CSS3, JavaScript ES6+ 
2. **Testing**: Comprehensive mock data system untuk feature testing
3. **Responsive Testing**: Cross-device compatibility testing
4. **Performance Optimization**: Asset optimization dan loading strategies

### Project Architecture
- **Separation of Concerns**: Clear separation antara patient, admin, dan doctor interfaces
- **Scalable Structure**: Modular architecture untuk easy feature additions
- **Maintainable Code**: Clean code practices dengan consistent naming conventions

## 💻 Kompabilitas Browser

Aplikasi ini compatible dengan:
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Fitur Mobile

### Responsive Design
- Layout yang optimal untuk layar kecil
- Touch-friendly button dan interface
- Mobile bottom navigation
- Swipe gestures support

### Mobile Navigation
- **Home**: Dashboard utama dengan ringkasan
- **Find Doctor**: Pencarian dokter dan poliklinik
- **Appointments**: Manajemen janji temu
- **Profile**: Pengaturan profil pengguna
- **Smart Hiding**: Navigation tersembunyi pada login/signup screens

## 🔧 Fitur Khusus

### Admin Console Features (ENHANCED)
- **Real-time Statistics Dashboard**: 
  - Multi-metric tracking (pasien, jadwal, utilisasi)
  - Visual indicators dengan color-coded status
  - Quick stats cards dengan trend indicators
  - Live data updates dan auto-refresh
- **Advanced Patient Management**: 
  - CRUD operations dengan batch processing
  - Search dan filtering capabilities
  - Data validation dan error handling
  - Bulk import/export functionality
- **Enhanced Doctor Schedule Management**: 
  - Visual schedule calendar dengan drag-drop
  - Capacity management dan overbooking protection
  - Automated conflict detection
  - Schedule template system untuk recurring appointments
- **Comprehensive Patient Visit Reporting System**: 
  - **Multi-dimensional Analytics**: Laporan harian, mingguan, bulanan dengan drill-down
  - **Advanced Report Types**: Standard, Polyclinic Service, Schedule Service reports
  - **Performance Metrics**: Utilisasi rate, waiting times, patient flow analytics
  - **Visual Data Representation**: Charts, graphs, dan trending indicators
  - **Export Capabilities**: CSV, PDF export dengan customizable templates
  - **Mobile Analytics Dashboard**: Touch-optimized reporting interface
- **Mock Data Management System (NEW!)**:
  - **Intelligent Data Generation**: 60+ realistic patient visits dengan proper distribution
  - **Testing Scenarios**: Various time periods, status combinations, queue patterns
  - **Data Quality**: Indonesian context dengan realistic medical specialties
  - **Reset Functionality**: Clean slate testing dengan original dataset
  - **Performance Testing**: Load testing dengan large datasets
- **Enhanced UI/UX**:
  - Modern styling dengan Tailwind CSS integration
  - Responsive grid layouts untuk semua screen sizes
  - Interactive elements dengan hover states dan animations
  - Accessibility compliance dengan ARIA labels dan keyboard navigation
- **Security & Performance**:
  - Role-based access control dengan permission levels
  - Data sanitization dan input validation
  - Optimized loading dengan lazy loading dan caching
  - Error handling dengan user-friendly messaging

### Doctor Dashboard Features (ENHANCED)
- **Advanced Appointment Management System**:
  - **Smart Filtering**: Filter appointments by date, status, dan patient criteria
  - **Bulk Operations**: Mass confirmation, cancellation, atau rescheduling
  - **Patient History Integration**: Access complete patient medical history dan previous visits
  - **Automated Reminders**: Sistem pengingat otomatis untuk dokter dan pasien
- **Intelligent Schedule Management**:
  - **Calendar Integration**: Visual calendar interface dengan drag-drop functionality
  - **Conflict Detection**: Automated detection untuk schedule conflicts dan overlaps
  - **Template System**: Pre-configured schedule templates untuk recurring patterns
  - **Capacity Optimization**: AI-powered suggestions untuk optimal appointment scheduling
- **Real-time Communication Hub**:
  - **Patient Notifications**: Instant messaging system untuk patient communication
  - **Status Broadcasting**: Real-time status updates untuk waiting room management
  - **Emergency Protocols**: Quick communication channels untuk urgent situations
- **Performance Analytics Dashboard**:
  - **Appointment Metrics**: Detailed analytics untuk appointment completion rates
  - **Patient Satisfaction**: Tracking patient feedback dan satisfaction scores
  - **Time Management**: Analysis waktu konsultasi rata-rata dan efficiency metrics
  - **Revenue Tracking**: Financial metrics dan appointment value analysis
- **Mobile-First Design**:
  - **Touch-Optimized Interface**: Gesture-based navigation untuk mobile devices
  - **Offline Capabilities**: Basic functionality available tanpa internet connection
  - **Responsive Charts**: Interactive data visualization yang adaptive
- **Integration & Workflow**:
  - **EMR Integration**: Seamless integration dengan Electronic Medical Records
  - **Prescription Management**: Digital prescription creation dan tracking
  - **Lab Results Integration**: Direct access ke lab results dan medical imaging
  - **Billing Integration**: Automated billing generation dan payment tracking

### Enhanced Navigation System
- **Context-Aware Navigation**: Otomatis hide/show berdasarkan halaman
- **Responsive Navigation**: Desktop top bar, mobile bottom navigation
- **Smooth Transitions**: Animasi halus untuk user experience yang baik
- **Multi-Role Support**: Navigation disesuaikan dengan role pengguna

### Accessibility
- Keyboard navigation support
- Screen reader compatible
- High contrast mode
- Focus indicators
- ARIA labels

### Performance
- Lazy loading untuk konten
- Optimized images dan assets
- Smooth animations
- Fast page transitions

### User Experience
- Loading screens
- Success/error notifications
- Confirmation dialogs
- Form validation
- Real-time feedback

## 🎨 Visual Assets & Branding

### Logo & Brand Identity
- **Professional Hospital Logo**: RSU Delima brand identity dengan dua varian:
  - `logo_rsu_delima.png`: Logo dengan background untuk kontras optimal
  - `logo_rsu_delima-no_bg.png`: Logo transparan untuk fleksibilitas desain
- **Consistent Branding**: Logo terintegrasi di seluruh aplikasi untuk brand recognition

### Background Images
- **Hero Section Background**: Professional medical imagery untuk first impression
- **Room Background**: Hospital room atmosphere untuk authentic medical experience
- **Optimized Images**: Compressed untuk fast loading tanpa mengurangi kualitas visual

### Design System
- **Medical Color Palette**: Warna-warna yang mencerminkan profesionalisme medis
- **Typography**: Font yang mudah dibaca untuk accessibility dan profesionalisme
- **Iconography**: Consistent medical icons untuk intuitive user interface

## 📊 Data Management

### Mock Data System
- **Comprehensive User Database**: 100+ realistic user accounts dalam `mockData.json`
- **Indonesian Context**: Data pengguna dengan nama, alamat, dan konteks Indonesia
- **Medical Records**: Realistic medical specialties dan appointment history
- **Testing Scenarios**: Berbagai kombinasi data untuk comprehensive testing
- **Data Structure**: Well-organized JSON structure untuk easy data manipulation

### Data Features
- **User Profiles**: Complete patient information dengan BPJS integration
- **Doctor Profiles**: Detailed specialist information dengan jadwal praktek
- **Appointment History**: Historical data untuk testing reporting features
- **Medical Specialties**: 6 poliklinik dengan realistic Indonesian medical context
