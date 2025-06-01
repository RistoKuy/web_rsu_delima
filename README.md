# 🏥 RSU Delima - Sistem Reservasi Rumah Sakit

Selamat datang di **RSU Delima Hospital Appointment System**, sebuah aplikasi web modern untuk memudahkan pasien dalam membuat janji temu dengan dokter di RSU Delima.

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
- **Login Dokter**: Akses khusus dokter (dalam pengembangan)
- **Registrasi**: Pendaftaran akun baru dengan informasi lengkap
- **Logout**: Keluar dari sistem dengan aman
- **Navigation Hiding**: Navigation bars tersembunyi pada halaman login/signup

### ⚙️ Admin Console (NEW!)
- **Dashboard Statistics**: Statistik real-time pasien, jadwal dokter, dan slot tersedia
- **Patient Data Verification**: Verifikasi, edit, dan hapus data pasien
- **Doctor Schedule Management**: Kelola jadwal dokter dengan operasi CRUD lengkap
- **Enhanced UI**: Kartu statistik dengan animasi dan styling modern
- **Responsive Design**: Optimal untuk desktop dan mobile devices
- **Modular Architecture**: File terpisah untuk maintainability (admin_index.html, admin_script.js, admin_style.css)

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

### 👤 Profil Pengguna
- **Informasi Pribadi**: Kelola data pribadi
- **Kontak**: Update nomor telepon dan alamat
- **BPJS**: Informasi nomor BPJS
- **Keamanan**: Ubah password

## 🛠️ Teknologi yang Digunakan

### Frontend
- **HTML5**: Struktur halaman web dengan semantic markup
- **CSS3**: Advanced styling dengan Flexbox, Grid, dan animasi
- **Tailwind CSS**: Utility-first CSS framework untuk rapid development
- **JavaScript (ES6+)**: Logika aplikasi dan interaktivitas modern
- **Responsive Design**: Mobile-first approach dengan media queries

### Fitur Teknis
- **Single Page Application (SPA)**: Navigasi halaman tanpa reload
- **Local Storage & Session Storage**: Penyimpanan data klien dan sesi
- **Mock Data**: Simulasi database dengan data realistis untuk demo
- **Progressive Enhancement**: Dukungan untuk berbagai browser
- **Modular Architecture**: Pemisahan concern untuk maintainability
- **CRUD Operations**: Create, Read, Update, Delete untuk admin console
- **Dynamic Navigation**: Context-aware navigation hiding/showing

## 📁 Struktur File

```
web_rsu_delima/
├── index.html                  # Halaman utama dengan semua patient views
├── script.js                   # Logika aplikasi JavaScript untuk patient
├── style.css                   # Custom CSS styling untuk patient interface
├── admin/
│   ├── admin_index.html        # Admin console interface
│   ├── admin_script.js         # Admin-specific JavaScript logic
│   └── admin_style.css         # Admin console styling
├── test_navigation.html        # Test page untuk navigation functionality
├── IMPLEMENTATION_SUMMARY.md   # Dokumentasi implementasi lengkap
└── README.md                   # Dokumentasi project
```

## 🚀 Cara Menjalankan

1. **Clone atau Download** project ini
2. **Buka file `index.html`** di browser web untuk patient interface
3. **Akses Admin Console** melalui `admin/admin_index.html` atau login sebagai admin
4. **Mulai menggunakan** aplikasi dengan:
   - **Patient Login**: Email dan password apa saja (prototype mode)
   - **Admin Login**: Email dan password apa saja, pilih "Admin" pada toggle
   - **Demo Account**: `john@example.com` / `password123`
   - **Registrasi**: Buat akun baru melalui fitur registrasi

### Login Options
- 👤 **Pasien**: Akses ke booking appointments dan profile management
- ⚙️ **Admin**: Akses ke admin console untuk data management
- 👨‍⚕️ **Dokter**: Coming soon (sementara redirect ke patient view)

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

### Admin Console Features
- **Real-time Statistics**: Dashboard dengan data pasien dan jadwal
- **Patient Management**: CRUD operations untuk data pasien
- **Doctor Schedule Management**: Kelola jadwal dokter secara lengkap
- **Enhanced UI**: Styling modern dengan Tailwind CSS integration
- **Responsive Admin Panel**: Optimal untuk semua ukuran layar

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
