document.addEventListener('DOMContentLoaded', () => {
    const patientList = document.getElementById('patientList');
    const doctorScheduleList = document.getElementById('doctorScheduleList');
    const adminModal = document.getElementById('adminModal');
    const adminModalTitle = document.getElementById('adminModalTitle');
    const adminModalBody = document.getElementById('adminModalBody');
    const adminModalFooter = document.getElementById('adminModalFooter');
    const logoutButton = document.getElementById('logoutButton');

    // Check for admin role
    if (sessionStorage.getItem('userRole') !== 'admin') {
        alert('Akses ditolak. Anda harus login sebagai Admin.');
        window.location.href = '../index.html';
        return;
    }

    if(logoutButton) {
        logoutButton.addEventListener('click', () => {
            sessionStorage.removeItem('userRole');
            sessionStorage.removeItem('userData');
            window.location.href = '../index.html';
        });
    }    // --- Sample Data (Replace with API calls in a real application) ---
    let patients = [
        { id: 1, name: 'Budi Santoso', nik: '3201011234560001', address: 'Jl. Merdeka No. 10, Jakarta', phone: '081234567890', birthDate: '1985-07-15', gender: 'Laki-laki' },
        { id: 2, name: 'Ani Lestari', nik: '3201022345670002', address: 'Jl. Sudirman No. 25, Bandung', phone: '087654321098', birthDate: '1990-03-22', gender: 'Perempuan' },
        { id: 3, name: 'Sari Dewi', nik: '3201033456780003', address: 'Jl. Ahmad Yani No. 15, Surabaya', phone: '081345678901', birthDate: '1988-11-08', gender: 'Perempuan' },
        { id: 4, name: 'Ahmad Fauzi', nik: '3201044567890004', address: 'Jl. Diponegoro No. 5, Yogyakarta', phone: '082345678901', birthDate: '1992-05-12', gender: 'Laki-laki' },
        { id: 5, name: 'Maya Sari', nik: '3201055678901005', address: 'Jl. Veteran No. 20, Medan', phone: '083456789012', birthDate: '1987-09-30', gender: 'Perempuan' },
    ];

    let doctorSchedules = [
        { id: 1, doctorName: 'Dr. Ahmad Subarjo', polyclinic: 'Umum', day: 'Senin', time: '09:00 - 12:00', quota: 20, registered: 15 },
        { id: 2, doctorName: 'Dr. Siti Aminah', polyclinic: 'Anak', day: 'Selasa', time: '14:00 - 17:00', quota: 15, registered: 10 },
        { id: 3, doctorName: 'Dr. Budi Prasetyo', polyclinic: 'Gigi', day: 'Rabu', time: '10:00 - 13:00', quota: 10, registered: 5 },
        { id: 4, doctorName: 'Dr. Sarah Johnson', polyclinic: 'Umum', day: 'Kamis', time: '08:00 - 11:00', quota: 25, registered: 20 },
        { id: 5, doctorName: 'Dr. Michael Chen', polyclinic: 'Kardiologi', day: 'Jumat', time: '13:00 - 16:00', quota: 12, registered: 8 },
        { id: 6, doctorName: 'Dr. Emily Rodriguez', polyclinic: 'Anak', day: 'Sabtu', time: '09:00 - 12:00', quota: 18, registered: 12 },
    ];

    // Sample visit data for reports
    let patientVisits = [
        // Data Juni 2025 - Minggu ini
        { id: 1, patientId: 1, patientName: 'Budi Santoso', doctorId: 1, doctorName: 'Dr. Ahmad Subarjo', polyclinic: 'Umum', visitDate: '2025-06-02', visitTime: '09:15', status: 'Selesai', queueNumber: 'A001', scheduleId: 1 },
        { id: 2, patientId: 2, patientName: 'Ani Lestari', doctorId: 2, doctorName: 'Dr. Siti Aminah', polyclinic: 'Anak', visitDate: '2025-06-02', visitTime: '14:30', status: 'Selesai', queueNumber: 'B001', scheduleId: 2 },
        { id: 3, patientId: 3, patientName: 'Sari Dewi', doctorId: 3, doctorName: 'Dr. Budi Prasetyo', polyclinic: 'Gigi', visitDate: '2025-06-02', visitTime: '10:45', status: 'Sedang Dilayani', queueNumber: 'C001', scheduleId: 3 },
        { id: 4, patientId: 4, patientName: 'Ahmad Fauzi', doctorId: 1, doctorName: 'Dr. Ahmad Subarjo', polyclinic: 'Umum', visitDate: '2025-06-02', visitTime: '10:00', status: 'Selesai', queueNumber: 'A002', scheduleId: 1 },
        { id: 5, patientId: 5, patientName: 'Maya Sari', doctorId: 4, doctorName: 'Dr. Sarah Johnson', polyclinic: 'Umum', visitDate: '2025-06-02', visitTime: '08:30', status: 'Selesai', queueNumber: 'A003', scheduleId: 4 },
        
        // Data hari kemarin (1 Juni 2025)
        { id: 6, patientId: 1, patientName: 'Budi Santoso', doctorId: 2, doctorName: 'Dr. Siti Aminah', polyclinic: 'Anak', visitDate: '2025-06-01', visitTime: '14:15', status: 'Selesai', queueNumber: 'B002', scheduleId: 2 },
        { id: 7, patientId: 2, patientName: 'Ani Lestari', doctorId: 5, doctorName: 'Dr. Michael Chen', polyclinic: 'Kardiologi', visitDate: '2025-06-01', visitTime: '13:20', status: 'Selesai', queueNumber: 'D001', scheduleId: 5 },
        { id: 8, patientId: 3, patientName: 'Sari Dewi', doctorId: 6, doctorName: 'Dr. Emily Rodriguez', polyclinic: 'Anak', visitDate: '2025-06-01', visitTime: '09:45', status: 'Selesai', queueNumber: 'B003', scheduleId: 6 },
        { id: 9, patientId: 4, patientName: 'Ahmad Fauzi', doctorId: 3, doctorName: 'Dr. Budi Prasetyo', polyclinic: 'Gigi', visitDate: '2025-06-01', visitTime: '11:30', status: 'Selesai', queueNumber: 'C002', scheduleId: 3 },
        { id: 10, patientId: 5, patientName: 'Maya Sari', doctorId: 1, doctorName: 'Dr. Ahmad Subarjo', polyclinic: 'Umum', visitDate: '2025-06-01', visitTime: '09:30', status: 'Selesai', queueNumber: 'A004', scheduleId: 1 },
        
        // Data minggu lalu (26-31 Mei 2025)
        { id: 11, patientId: 1, patientName: 'Budi Santoso', doctorId: 4, doctorName: 'Dr. Sarah Johnson', polyclinic: 'Umum', visitDate: '2025-05-31', visitTime: '08:15', status: 'Selesai', queueNumber: 'A005', scheduleId: 4 },
        { id: 12, patientId: 2, patientName: 'Ani Lestari', doctorId: 6, doctorName: 'Dr. Emily Rodriguez', polyclinic: 'Anak', visitDate: '2025-05-31', visitTime: '10:30', status: 'Selesai', queueNumber: 'B004', scheduleId: 6 },
        { id: 13, patientId: 3, patientName: 'Sari Dewi', doctorId: 5, doctorName: 'Dr. Michael Chen', polyclinic: 'Kardiologi', visitDate: '2025-05-30', visitTime: '14:45', status: 'Selesai', queueNumber: 'D002', scheduleId: 5 },
        { id: 14, patientId: 4, patientName: 'Ahmad Fauzi', doctorId: 2, doctorName: 'Dr. Siti Aminah', polyclinic: 'Anak', visitDate: '2025-05-30', visitTime: '16:00', status: 'Selesai', queueNumber: 'B005', scheduleId: 2 },
        { id: 15, patientId: 5, patientName: 'Maya Sari', doctorId: 3, doctorName: 'Dr. Budi Prasetyo', polyclinic: 'Gigi', visitDate: '2025-05-30', visitTime: '12:20', status: 'Selesai', queueNumber: 'C003', scheduleId: 3 },
        
        // Data bulan ini dengan berbagai status (Juni 2025)
        { id: 16, patientId: 1, patientName: 'Budi Santoso', doctorId: 1, doctorName: 'Dr. Ahmad Subarjo', polyclinic: 'Umum', visitDate: '2025-05-29', visitTime: '09:45', status: 'Selesai', queueNumber: 'A006', scheduleId: 1 },
        { id: 17, patientId: 2, patientName: 'Ani Lestari', doctorId: 4, doctorName: 'Dr. Sarah Johnson', polyclinic: 'Umum', visitDate: '2025-05-29', visitTime: '10:15', status: 'Selesai', queueNumber: 'A007', scheduleId: 4 },
        { id: 18, patientId: 3, patientName: 'Sari Dewi', doctorId: 6, doctorName: 'Dr. Emily Rodriguez', polyclinic: 'Anak', visitDate: '2025-05-28', visitTime: '11:00', status: 'Selesai', queueNumber: 'B006', scheduleId: 6 },
        { id: 19, patientId: 4, patientName: 'Ahmad Fauzi', doctorId: 5, doctorName: 'Dr. Michael Chen', polyclinic: 'Kardiologi', visitDate: '2025-05-28', visitTime: '15:30', status: 'Selesai', queueNumber: 'D003', scheduleId: 5 },
        { id: 20, patientId: 5, patientName: 'Maya Sari', doctorId: 2, doctorName: 'Dr. Siti Aminah', polyclinic: 'Anak', visitDate: '2025-05-27', visitTime: '14:45', status: 'Selesai', queueNumber: 'B007', scheduleId: 2 },
        
        // Data hari ini dengan status beragam (untuk testing real-time)
        { id: 21, patientId: 1, patientName: 'Budi Santoso', doctorId: 3, doctorName: 'Dr. Budi Prasetyo', polyclinic: 'Gigi', visitDate: '2025-06-02', visitTime: '11:15', status: 'Menunggu', queueNumber: 'C004', scheduleId: 3 },
        { id: 22, patientId: 2, patientName: 'Ani Lestari', doctorId: 5, doctorName: 'Dr. Michael Chen', polyclinic: 'Kardiologi', visitDate: '2025-06-02', visitTime: '13:45', status: 'Sedang Dilayani', queueNumber: 'D004', scheduleId: 5 },
        { id: 23, patientId: 3, patientName: 'Sari Dewi', doctorId: 1, doctorName: 'Dr. Ahmad Subarjo', polyclinic: 'Umum', visitDate: '2025-06-02', visitTime: '11:30', status: 'Selesai', queueNumber: 'A008', scheduleId: 1 },
        { id: 24, patientId: 4, patientName: 'Ahmad Fauzi', doctorId: 6, doctorName: 'Dr. Emily Rodriguez', polyclinic: 'Anak', visitDate: '2025-06-02', visitTime: '10:15', status: 'Menunggu', queueNumber: 'B008', scheduleId: 6 },
        { id: 25, patientId: 5, patientName: 'Maya Sari', doctorId: 4, doctorName: 'Dr. Sarah Johnson', polyclinic: 'Umum', visitDate: '2025-06-02', visitTime: '09:00', status: 'Selesai', queueNumber: 'A009', scheduleId: 4 }
    ];

    // Data jadwal dokter yang diperluas dengan informasi lebih detail
    let detailedSchedules = [
        { id: 1, doctorId: 1, doctorName: 'Dr. Ahmad Subarjo', polyclinic: 'Umum', day: 'Senin', time: '09:00 - 12:00', quota: 20, registered: 15, availableSlots: 5 },
        { id: 2, doctorId: 2, doctorName: 'Dr. Siti Aminah', polyclinic: 'Anak', day: 'Selasa', time: '14:00 - 17:00', quota: 15, registered: 10, availableSlots: 5 },
        { id: 3, doctorId: 3, doctorName: 'Dr. Budi Prasetyo', polyclinic: 'Gigi', day: 'Rabu', time: '10:00 - 13:00', quota: 10, registered: 8, availableSlots: 2 },
        { id: 4, doctorId: 4, doctorName: 'Dr. Sarah Johnson', polyclinic: 'Umum', day: 'Kamis', time: '08:00 - 11:00', quota: 25, registered: 20, availableSlots: 5 },
        { id: 5, doctorId: 5, doctorName: 'Dr. Michael Chen', polyclinic: 'Kardiologi', day: 'Jumat', time: '13:00 - 16:00', quota: 12, registered: 8, availableSlots: 4 },
        { id: 6, doctorId: 6, doctorName: 'Dr. Emily Rodriguez', polyclinic: 'Anak', day: 'Sabtu', time: '09:00 - 12:00', quota: 18, registered: 12, availableSlots: 6 },
        // Jadwal tambahan
        { id: 7, doctorId: 1, doctorName: 'Dr. Ahmad Subarjo', polyclinic: 'Umum', day: 'Rabu', time: '14:00 - 17:00', quota: 15, registered: 12, availableSlots: 3 },
        { id: 8, doctorId: 3, doctorName: 'Dr. Budi Prasetyo', polyclinic: 'Gigi', day: 'Jumat', time: '08:00 - 11:00', quota: 12, registered: 9, availableSlots: 3 },
        { id: 9, doctorId: 5, doctorName: 'Dr. Michael Chen', polyclinic: 'Kardiologi', day: 'Selasa', time: '09:00 - 12:00', quota: 10, registered: 7, availableSlots: 3 }
    ];

    // --- Statistics Functions ---
    function updateStatistics() {
        // Update total patients
        document.getElementById('totalPatients').textContent = patients.length;
        
        // Update total schedules
        document.getElementById('totalSchedules').textContent = doctorSchedules.length;
        
        // Calculate available slots
        const availableSlots = doctorSchedules.reduce((total, schedule) => {
            return total + (schedule.quota - schedule.registered);
        }, 0);
        document.getElementById('availableSlots').textContent = availableSlots;
        
        // Update additional statistics for the new features
        updateExtendedStatistics();
    }

    function updateExtendedStatistics() {
        // Calculate active polyclinics
        const activePolyclinics = new Set(patientVisits.map(visit => visit.polyclinic)).size;
        const totalActivePolyclinicsElement = document.getElementById('totalActivePolyclinics');
        if (totalActivePolyclinicsElement) {
            totalActivePolyclinicsElement.textContent = activePolyclinics;
        }
        
        // Calculate today's schedules
        const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format
        const todayVisits = patientVisits.filter(visit => visit.visitDate === today);
        const todaySchedulesCount = new Set(todayVisits.map(visit => visit.scheduleId)).size;
        const todaySchedulesElement = document.getElementById('todaySchedules');
        if (todaySchedulesElement) {
            todaySchedulesElement.textContent = todaySchedulesCount;
        }
        
        // Calculate average utilization
        const totalUtilization = detailedSchedules.reduce((total, schedule) => {
            const utilization = schedule.quota > 0 ? (schedule.registered / schedule.quota) * 100 : 0;
            return total + utilization;
        }, 0);
        const averageUtilization = detailedSchedules.length > 0 ? 
            (totalUtilization / detailedSchedules.length).toFixed(1) : 0;
        const averageUtilizationElement = document.getElementById('averageUtilization');
        if (averageUtilizationElement) {
            averageUtilizationElement.textContent = averageUtilization + '%';
        }
    }

    // --- Render Functions ---
    function renderPatientList() {
        if (!patientList) return;
        patientList.innerHTML = ''; // Clear existing list
        if (patients.length === 0) {
            patientList.innerHTML = '<p class="text-gray-500">Tidak ada data pasien.</p>';
            return;
        }
        patients.forEach(patient => {
            const patientCard = `
                <div class="data-card" id="patient-${patient.id}">
                    <div class="data-card-info">
                        <p class="name">${patient.name}</p>
                        <p>NIK: ${patient.nik}</p>
                    </div>
                    <div class="data-card-actions">
                        <button onclick="window.viewPatientDetails(${patient.id})" class="action-button view-button bg-blue-500 hover:bg-blue-600 text-white">Lihat</button>
                        <button onclick="window.editPatient(${patient.id})" class="action-button edit-button bg-yellow-500 hover:bg-yellow-600 text-white">Edit</button>
                        <button onclick="window.confirmDeletePatient(${patient.id})" class="action-button delete-button bg-red-500 hover:bg-red-600 text-white">Hapus</button>
                    </div>
                </div>
            `;
            patientList.insertAdjacentHTML('beforeend', patientCard);
        });
    }

    function renderDoctorScheduleList() {
        if (!doctorScheduleList) return;
        doctorScheduleList.innerHTML = ''; // Clear existing list
         if (doctorSchedules.length === 0) {
            doctorScheduleList.innerHTML = '<p class="text-gray-500">Tidak ada jadwal dokter.</p>';
            return;
        }
        doctorSchedules.forEach(schedule => {
            const scheduleCard = `
                <div class="data-card" id="schedule-${schedule.id}">
                    <div class="data-card-info">
                        <p class="name">${schedule.doctorName} - ${schedule.polyclinic}</p>
                        <p>Hari: ${schedule.day}, Jam: ${schedule.time}</p>
                        <p>Kuota: ${schedule.registered}/${schedule.quota}</p>
                    </div>
                    <div class="data-card-actions">
                        <button onclick="window.viewDoctorScheduleDetails(${schedule.id})" class="action-button view-button bg-blue-500 hover:bg-blue-600 text-white">Lihat</button>
                        <button onclick="window.editDoctorSchedule(${schedule.id})" class="action-button edit-button bg-yellow-500 hover:bg-yellow-600 text-white">Edit</button>
                        <button onclick="window.confirmDeleteDoctorSchedule(${schedule.id})" class="action-button delete-button bg-red-500 hover:bg-red-600 text-white">Hapus</button>
                    </div>
                </div>
            `;
            doctorScheduleList.insertAdjacentHTML('beforeend', scheduleCard);
        });
    }

    // --- Modal Functions ---
    window.openAdminModal = (title, content, footerButtons = '') => {
        if (!adminModal || !adminModalTitle || !adminModalBody || !adminModalFooter) return;
        adminModalTitle.textContent = title;
        adminModalBody.innerHTML = content;
        adminModalFooter.innerHTML = '<button type="button" onclick="window.closeAdminModal()" class="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded mr-2">Tutup</button>' + footerButtons;
        adminModal.classList.remove('hidden');
    };

    window.closeAdminModal = () => {
        if (!adminModal || !adminModalBody || !adminModalFooter) return;
        adminModal.classList.add('hidden');
        adminModalBody.innerHTML = '';
        adminModalFooter.innerHTML = '';
    };

    // --- Patient Actions ---
    window.viewPatientDetails = (patientId) => {
        const patient = patients.find(p => p.id === patientId);
        if (!patient) return;
        const detailsHtml = `
            <div class="space-y-2">
                <p><strong>Nama:</strong> ${patient.name}</p>
                <p><strong>NIK:</strong> ${patient.nik}</p>
                <p><strong>Alamat:</strong> ${patient.address}</p>
                <p><strong>Telepon:</strong> ${patient.phone}</p>
                <p><strong>Tanggal Lahir:</strong> ${patient.birthDate}</p>
                <p><strong>Jenis Kelamin:</strong> ${patient.gender}</p>
            </div>
        `;
        window.openAdminModal('Detail Pasien: ' + patient.name, detailsHtml);
    };

    window.editPatient = (patientId) => {
        const patient = patients.find(p => p.id === patientId);
        if (!patient) return;
        const formHtml = `
            <form id="editPatientForm" class="space-y-4">
                <input type="hidden" id="editPatientId" value="${patient.id}">
                <div>
                    <label for="editPatientName" class="block text-sm font-medium text-gray-700">Nama:</label>
                    <input type="text" id="editPatientName" value="${patient.name}" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                </div>
                <div>
                    <label for="editPatientNik" class="block text-sm font-medium text-gray-700">NIK:</label>
                    <input type="text" id="editPatientNik" value="${patient.nik}" required pattern="\\d{16}" title="NIK harus 16 digit angka" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                </div>
                <div>
                    <label for="editPatientAddress" class="block text-sm font-medium text-gray-700">Alamat:</label>
                    <textarea id="editPatientAddress" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">${patient.address}</textarea>
                </div>
                <div>
                    <label for="editPatientPhone" class="block text-sm font-medium text-gray-700">Telepon:</label>
                    <input type="tel" id="editPatientPhone" value="${patient.phone}" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                </div>
                <div>
                    <label for="editPatientBirthDate" class="block text-sm font-medium text-gray-700">Tanggal Lahir:</label>
                    <input type="date" id="editPatientBirthDate" value="${patient.birthDate}" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                </div>
                <div>
                    <label for="editPatientGender" class="block text-sm font-medium text-gray-700">Jenis Kelamin:</label>
                    <select id="editPatientGender" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                        <option value="Laki-laki" ${patient.gender === 'Laki-laki' ? 'selected' : ''}>Laki-laki</option>
                        <option value="Perempuan" ${patient.gender === 'Perempuan' ? 'selected' : ''}>Perempuan</option>
                    </select>
                </div>
            </form>
        `;
        const footerButtons = '<button type="button" onclick="window.savePatientChanges()" class="save-button bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">Simpan Perubahan</button>';
        window.openAdminModal('Edit Pasien: ' + patient.name, formHtml, footerButtons);
    };

    window.savePatientChanges = () => {
        const form = document.getElementById('editPatientForm');
        if (!form || !form.checkValidity()) {
            form?.reportValidity();
            return;
        }

        const id = parseInt(document.getElementById('editPatientId').value);
        const updatedPatient = {
            id: id,
            name: document.getElementById('editPatientName').value,
            nik: document.getElementById('editPatientNik').value,
            address: document.getElementById('editPatientAddress').value,
            phone: document.getElementById('editPatientPhone').value,
            birthDate: document.getElementById('editPatientBirthDate').value,
            gender: document.getElementById('editPatientGender').value,
        };        patients = patients.map(p => p.id === id ? updatedPatient : p);
        renderPatientList();
        updateStatistics();
        window.closeAdminModal();
        alert('Data pasien berhasil diperbarui!');
    };

    window.confirmDeletePatient = (patientId) => {
        const patient = patients.find(p => p.id === patientId);
        if (!patient) return;
        const confirmationHtml = `<p>Anda yakin ingin menghapus data pasien <strong>${patient.name}</strong> (NIK: ${patient.nik})?</p>`;
        const footerButtons = `<button type="button" onclick="window.deletePatient(${patientId})" class="action-button delete-button bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">Hapus</button>`;
        window.openAdminModal('Konfirmasi Hapus Pasien', confirmationHtml, footerButtons);
    };    window.deletePatient = (patientId) => {
        patients = patients.filter(p => p.id !== patientId);
        renderPatientList();
        updateStatistics();
        window.closeAdminModal();
        alert('Data pasien berhasil dihapus.');
    };


    // --- Doctor Schedule Actions ---
    window.viewDoctorScheduleDetails = (scheduleId) => {
        const schedule = doctorSchedules.find(s => s.id === scheduleId);
        if (!schedule) return;
        const detailsHtml = `
            <div class="space-y-2">
                <p><strong>Nama Dokter:</strong> ${schedule.doctorName}</p>
                <p><strong>Poliklinik:</strong> ${schedule.polyclinic}</p>
                <p><strong>Hari:</strong> ${schedule.day}</p>
                <p><strong>Waktu:</strong> ${schedule.time}</p>
                <p><strong>Kuota:</strong> ${schedule.quota}</p>
                <p><strong>Terdaftar:</strong> ${schedule.registered}</p>
            </div>
        `;
        window.openAdminModal('Detail Jadwal Dokter: ' + schedule.doctorName, detailsHtml);
    };

    window.editDoctorSchedule = (scheduleId) => {
        const schedule = doctorSchedules.find(s => s.id === scheduleId);
        if (!schedule) return;
        const formHtml = `
            <form id="editScheduleForm" class="space-y-4">
                <input type="hidden" id="editScheduleId" value="${schedule.id}">
                <p><strong>Dokter:</strong> ${schedule.doctorName}</p>
                <p><strong>Poliklinik:</strong> ${schedule.polyclinic}</p>
                <p><strong>Hari:</strong> ${schedule.day}</p>
                <div>
                    <label for="editScheduleTime" class="block text-sm font-medium text-gray-700">Waktu (misal: 09:00 - 12:00):</label>
                    <input type="text" id="editScheduleTime" value="${schedule.time}" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                </div>
                <div>
                    <label for="editScheduleQuota" class="block text-sm font-medium text-gray-700">Kuota:</label>
                    <input type="number" id="editScheduleQuota" value="${schedule.quota}" required min="0" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                </div>
                 <div>
                    <label for="editScheduleRegistered" class="block text-sm font-medium text-gray-700">Terdaftar:</label>
                    <input type="number" id="editScheduleRegistered" value="${schedule.registered}" required min="0" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                </div>
            </form>
        `;
        const footerButtons = '<button type="button" onclick="window.saveDoctorScheduleChanges()" class="save-button bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">Simpan Perubahan</button>';
        window.openAdminModal('Edit Jadwal Dokter: ' + schedule.doctorName, formHtml, footerButtons);
    };

    window.saveDoctorScheduleChanges = () => {
        const form = document.getElementById('editScheduleForm');
        if (!form || !form.checkValidity()) {
            form?.reportValidity();
            return;
        }

        const id = parseInt(document.getElementById('editScheduleId').value);
        const updatedTime = document.getElementById('editScheduleTime').value;
        const updatedQuota = parseInt(document.getElementById('editScheduleQuota').value);
        const updatedRegistered = parseInt(document.getElementById('editScheduleRegistered').value);

        if (updatedRegistered > updatedQuota) {
            alert('Jumlah pasien terdaftar tidak boleh melebihi kuota.');
            return;
        }

        doctorSchedules = doctorSchedules.map(s => {
            if (s.id === id) {
                return { ...s, time: updatedTime, quota: updatedQuota, registered: updatedRegistered };
            }
            return s;        });
        renderDoctorScheduleList();
        updateStatistics();
        window.closeAdminModal();
        alert('Jadwal dokter berhasil diperbarui!');
    };

    window.confirmDeleteDoctorSchedule = (scheduleId) => {
        const schedule = doctorSchedules.find(s => s.id === scheduleId);
        if (!schedule) return;
        const confirmationHtml = `<p>Anda yakin ingin menghapus jadwal untuk <strong>${schedule.doctorName}</strong> pada hari ${schedule.day} (${schedule.time})?</p>`;
        const footerButtons = `<button type="button" onclick="window.deleteDoctorSchedule(${scheduleId})" class="action-button delete-button bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">Hapus</button>`;
        window.openAdminModal('Konfirmasi Hapus Jadwal', confirmationHtml, footerButtons);
    };    window.deleteDoctorSchedule = (scheduleId) => {
        doctorSchedules = doctorSchedules.filter(s => s.id !== scheduleId);
        renderDoctorScheduleList();
        updateStatistics();
        window.closeAdminModal();
        alert('Jadwal dokter berhasil dihapus.');
    };

    // --- Visit Report Functions ---
    window.generateVisitReport = () => {
        const reportType = document.getElementById('reportType').value;
        const reportDate = document.getElementById('reportDate').value;
        
        if (!reportDate) {
            alert('Silakan pilih tanggal untuk generate laporan');
            return;
        }
        
        const filteredVisits = filterVisitsByDateRange(reportDate, reportType);
        displayVisitReport(filteredVisits, reportType, reportDate);
    };

    // Fungsi baru untuk generate laporan per poli
    window.generatePolyclinicServiceReport = () => {
        const reportDate = document.getElementById('reportDate').value || new Date().toISOString().split('T')[0];
        const reportType = document.getElementById('reportType').value || 'daily';
        
        const filteredVisits = filterVisitsByDateRange(reportDate, reportType);
        generateDetailedPolyclinicReport(filteredVisits, reportType);
    };

    // Fungsi baru untuk generate laporan per jadwal
    window.generateScheduleServiceReport = () => {
        const reportDate = document.getElementById('reportDate').value || new Date().toISOString().split('T')[0];
        const reportType = document.getElementById('reportType').value || 'daily';
        
        const filteredVisits = filterVisitsByDateRange(reportDate, reportType);
        generateScheduleReport(filteredVisits, reportType);
    };

    // Export function for visit reports
    window.exportVisitReport = () => {
        const reportType = document.getElementById('reportType').value;
        const reportDate = document.getElementById('reportDate').value;
        
        if (!reportDate) {
            alert('Silakan pilih tanggal untuk export laporan');
            return;
        }
        
        const filteredVisits = filterVisitsByDateRange(reportDate, reportType);
        
        if (filteredVisits.length === 0) {
            alert('Tidak ada data untuk periode yang dipilih');
            return;
        }
        
        // Create CSV content
        const csvHeader = 'No,Tanggal Kunjungan,Jam Kunjungan,Nama Pasien,Dokter,Poliklinik,Status,No Antrian,ID Jadwal\n';
        const csvContent = filteredVisits.map((visit, index) => {
            return `${index + 1},"${visit.visitDate}","${visit.visitTime}","${visit.patientName}","${visit.doctorName}","${visit.polyclinic}","${visit.status}","${visit.queueNumber}","${visit.scheduleId}"`;
        }).join('\n');
        
        const fullCsv = csvHeader + csvContent;
        
        // Create and download file
        const blob = new Blob([fullCsv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        
        const dateStr = new Date().toISOString().split('T')[0];
        const filename = `laporan_kunjungan_${reportType}_${dateStr}.csv`;
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message
        alert(`Laporan berhasil diexport ke file: ${filename}`);
    };

    function generateDetailedPolyclinicReport(visits, reportType) {
        const polyclinicData = {};
        
        // Group visits by polyclinic
        visits.forEach(visit => {
            if (!polyclinicData[visit.polyclinic]) {
                polyclinicData[visit.polyclinic] = {
                    total: 0,
                    completed: 0,
                    inProgress: 0,
                    waiting: 0,
                    doctors: new Set(),
                    schedules: {},
                    patients: new Set(),
                    avgWaitTime: 0,
                    peakHours: {}
                };
            }
            
            const data = polyclinicData[visit.polyclinic];
            data.total++;
            data.doctors.add(visit.doctorName);
            data.patients.add(visit.patientId);
            
            // Track schedules
            const scheduleKey = `${visit.doctorName} - ${visit.visitDate}`;
            if (!data.schedules[scheduleKey]) {
                data.schedules[scheduleKey] = {
                    doctor: visit.doctorName,
                    date: visit.visitDate,
                    patients: 0,
                    completed: 0,
                    inProgress: 0,
                    waiting: 0
                };
            }
            data.schedules[scheduleKey].patients++;
            
            // Track peak hours
            const hour = visit.visitTime.split(':')[0];
            data.peakHours[hour] = (data.peakHours[hour] || 0) + 1;
            
            switch (visit.status) {
                case 'Selesai':
                    data.completed++;
                    data.schedules[scheduleKey].completed++;
                    break;
                case 'Sedang Dilayani':
                    data.inProgress++;
                    data.schedules[scheduleKey].inProgress++;
                    break;
                case 'Menunggu':
                    data.waiting++;
                    data.schedules[scheduleKey].waiting++;
                    break;
            }
        });

        // Display detailed polyclinic report
        const reportContainer = document.getElementById('detailedPolyclinicReport') || createDetailedReportContainer();
        reportContainer.innerHTML = '<h3 class="text-lg font-semibold mb-4 text-gray-800">📊 Rekap Layanan Per Poliklinik</h3>';

        if (Object.keys(polyclinicData).length === 0) {
            reportContainer.innerHTML += '<p class="text-gray-500 text-center">Tidak ada data kunjungan untuk periode ini</p>';
            return;
        }

        Object.entries(polyclinicData).forEach(([polyclinic, data]) => {
            const peakHour = Object.entries(data.peakHours).reduce((a, b) => 
                data.peakHours[a[0]] > data.peakHours[b[0]] ? a : b, ['00', 0]
            );
            
            const completionRate = ((data.completed / data.total) * 100).toFixed(1);
            
            const polyclinicCard = document.createElement('div');
            polyclinicCard.className = 'bg-white border rounded-lg p-4 mb-4 shadow-sm';
            polyclinicCard.innerHTML = `
                <div class="border-b pb-3 mb-3">
                    <div class="flex justify-between items-center">
                        <h4 class="text-lg font-semibold text-gray-800">${polyclinic}</h4>
                        <span class="text-sm text-gray-500">${data.total} total kunjungan</span>
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-green-600">${data.completed}</div>
                            <div class="text-xs text-gray-600">Selesai</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-blue-600">${data.inProgress}</div>
                            <div class="text-xs text-gray-600">Sedang Dilayani</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-yellow-600">${data.waiting}</div>
                            <div class="text-xs text-gray-600">Menunggu</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-purple-600">${completionRate}%</div>
                            <div class="text-xs text-gray-600">Tingkat Selesai</div>
                        </div>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                        <div class="text-sm font-medium text-gray-700">👨‍⚕️ Dokter Aktif</div>
                        <div class="text-lg font-semibold">${data.doctors.size} dokter</div>
                    </div>
                    <div>
                        <div class="text-sm font-medium text-gray-700">👥 Pasien Unik</div>
                        <div class="text-lg font-semibold">${data.patients.size} pasien</div>
                    </div>
                    <div>
                        <div class="text-sm font-medium text-gray-700">⏰ Jam Sibuk</div>
                        <div class="text-lg font-semibold">${peakHour[0]}:00 (${peakHour[1]} kunjungan)</div>
                    </div>
                </div>
                
                <div>
                    <div class="text-sm font-medium text-gray-700 mb-2">📋 Detail Jadwal</div>
                    <div class="max-h-32 overflow-y-auto">
                        ${Object.values(data.schedules).map(schedule => `
                            <div class="flex justify-between items-center py-1 px-2 bg-gray-50 rounded mb-1 text-sm">
                                <span>${schedule.doctor}</span>
                                <span class="text-gray-600">${new Date(schedule.date).toLocaleDateString('id-ID')}</span>
                                <span class="font-semibold">${schedule.patients} pasien</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
            reportContainer.appendChild(polyclinicCard);
        });
    }

    function generateScheduleReport(visits, reportType) {
        const scheduleData = {};
        
        // Group visits by schedule
        visits.forEach(visit => {
            const scheduleKey = `${visit.scheduleId}-${visit.doctorName}-${visit.visitDate}`;
            
            if (!scheduleData[scheduleKey]) {
                const matchingSchedule = detailedSchedules.find(s => 
                    s.doctorName === visit.doctorName && s.polyclinic === visit.polyclinic
                );
                
                scheduleData[scheduleKey] = {
                    scheduleId: visit.scheduleId,
                    doctorName: visit.doctorName,
                    polyclinic: visit.polyclinic,
                    date: visit.visitDate,
                    day: matchingSchedule ? matchingSchedule.day : 'N/A',
                    time: matchingSchedule ? matchingSchedule.time : 'N/A',
                    quota: matchingSchedule ? matchingSchedule.quota : 0,
                    total: 0,
                    completed: 0,
                    inProgress: 0,
                    waiting: 0,
                    utilizationRate: 0,
                    patients: []
                };
            }
            
            const data = scheduleData[scheduleKey];
            data.total++;
            data.patients.push({
                name: visit.patientName,
                time: visit.visitTime,
                status: visit.status,
                queueNumber: visit.queueNumber
            });
            
            switch (visit.status) {
                case 'Selesai':
                    data.completed++;
                    break;
                case 'Sedang Dilayani':
                    data.inProgress++;
                    break;
                case 'Menunggu':
                    data.waiting++;
                    break;
            }
        });

        // Calculate utilization rates
        Object.values(scheduleData).forEach(schedule => {
            schedule.utilizationRate = schedule.quota > 0 ? 
                ((schedule.total / schedule.quota) * 100).toFixed(1) : 0;
        });

        // Display schedule report
        const reportContainer = document.getElementById('scheduleReport') || createScheduleReportContainer();
        reportContainer.innerHTML = '<h3 class="text-lg font-semibold mb-4 text-gray-800">🗓️ Rekap Layanan Per Jadwal</h3>';

        if (Object.keys(scheduleData).length === 0) {
            reportContainer.innerHTML += '<p class="text-gray-500 text-center">Tidak ada data jadwal untuk periode ini</p>';
            return;
        }

        // Sort by utilization rate (highest first)
        const sortedSchedules = Object.values(scheduleData).sort((a, b) => b.utilizationRate - a.utilizationRate);

        sortedSchedules.forEach(schedule => {
            const utilizationColor = schedule.utilizationRate >= 80 ? 'text-red-600' : 
                                   schedule.utilizationRate >= 60 ? 'text-yellow-600' : 'text-green-600';
            
            const scheduleCard = document.createElement('div');
            scheduleCard.className = 'bg-white border rounded-lg p-4 mb-4 shadow-sm';
            scheduleCard.innerHTML = `
                <div class="border-b pb-3 mb-3">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="text-lg font-semibold text-gray-800">${schedule.doctorName}</h4>
                            <p class="text-sm text-gray-600">${schedule.polyclinic} • ${schedule.day} • ${schedule.time}</p>
                            <p class="text-xs text-gray-500">${new Date(schedule.date).toLocaleDateString('id-ID')}</p>
                        </div>
                        <div class="text-right">
                            <div class="text-2xl font-bold ${utilizationColor}">${schedule.utilizationRate}%</div>
                            <div class="text-xs text-gray-600">Tingkat Utilisasi</div>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mt-3">
                        <div class="text-center">
                            <div class="text-xl font-bold text-gray-800">${schedule.total}/${schedule.quota}</div>
                            <div class="text-xs text-gray-600">Pasien Terdaftar</div>
                        </div>
                        <div class="text-center">
                            <div class="text-xl font-bold text-green-600">${schedule.completed}</div>
                            <div class="text-xs text-gray-600">Selesai</div>
                        </div>
                        <div class="text-center">
                            <div class="text-xl font-bold text-blue-600">${schedule.inProgress}</div>
                            <div class="text-xs text-gray-600">Sedang Dilayani</div>
                        </div>
                        <div class="text-center">
                            <div class="text-xl font-bold text-yellow-600">${schedule.waiting}</div>
                            <div class="text-xs text-gray-600">Menunggu</div>
                        </div>
                        <div class="text-center">
                            <div class="text-xl font-bold text-purple-600">${schedule.quota - schedule.total}</div>
                            <div class="text-xs text-gray-600">Slot Tersisa</div>
                        </div>
                    </div>
                </div>
                
                <div>
                    <div class="text-sm font-medium text-gray-700 mb-2">👥 Daftar Pasien (${schedule.patients.length})</div>
                    <div class="max-h-40 overflow-y-auto">
                        ${schedule.patients.length > 0 ? schedule.patients.map(patient => {
                            const statusColor = patient.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                                              patient.status === 'Sedang Dilayani' ? 'bg-blue-100 text-blue-800' :
                                              'bg-yellow-100 text-yellow-800';
                            return `
                                <div class="flex justify-between items-center py-2 px-3 bg-gray-50 rounded mb-1 text-sm">
                                    <div class="flex items-center space-x-3">
                                        <span class="font-mono text-xs bg-gray-200 px-2 py-1 rounded">${patient.queueNumber}</span>
                                        <span class="font-medium">${patient.name}</span>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <span class="text-gray-600">${patient.time}</span>
                                        <span class="px-2 py-1 rounded-full text-xs ${statusColor}">${patient.status}</span>
                                    </div>
                                </div>
                            `;
                        }).join('') : '<p class="text-gray-500 text-center py-2">Belum ada pasien terdaftar</p>'}
                    </div>
                </div>
            `;
            
            reportContainer.appendChild(scheduleCard);
        });
    }

    function createDetailedReportContainer() {
        const container = document.createElement('div');
        container.id = 'detailedPolyclinicReport';
        container.className = 'mt-6';
        
        const reportsSection = document.querySelector('.bg-white.p-4.md\\:p-6.rounded-lg.shadow.mb-6');
        if (reportsSection) {
            reportsSection.appendChild(container);
        }
        
        return container;
    }

    function createScheduleReportContainer() {
        const container = document.createElement('div');
        container.id = 'scheduleReport';
        container.className = 'mt-6';
        
        const reportsSection = document.querySelector('.bg-white.p-4.md\\:p-6.rounded-lg.shadow.mb-6');
        if (reportsSection) {
            reportsSection.appendChild(container);
        }
        
        return container;
    }

    // Helper functions for visit reports
    function filterVisitsByDateRange(selectedDate, reportType) {
        const selectedDateObj = new Date(selectedDate);
        const today = new Date();
        
        return patientVisits.filter(visit => {
            const visitDate = new Date(visit.visitDate);
            
            switch (reportType) {
                case 'daily':
                    return visitDate.toDateString() === selectedDateObj.toDateString();
                    
                case 'weekly':
                    // Calculate start of week (Monday)
                    const startOfWeek = new Date(selectedDateObj);
                    const dayOfWeek = startOfWeek.getDay() === 0 ? 7 : startOfWeek.getDay(); // Convert Sunday to 7
                    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek + 1);
                    
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(endOfWeek.getDate() + 6);
                    
                    return visitDate >= startOfWeek && visitDate <= endOfWeek;
                    
                case 'monthly':
                    return visitDate.getMonth() === selectedDateObj.getMonth() && 
                           visitDate.getFullYear() === selectedDateObj.getFullYear();
                          
                default:
                    return false;
            }
        });
    }

    function displayVisitReport(visits, reportType, reportDate) {
        // Clear existing reports
        const reportContent = document.getElementById('reportContent');
        if (!reportContent) return;
        
        // Update summary statistics
        updateReportSummary(visits);
        
        // Display polyclinic breakdown
        displayPolyclinicBreakdown(visits);
        
        // Display doctor breakdown
        displayDoctorBreakdown(visits);
        
        // Display detailed visit list
        displayDetailedVisitList(visits);
    }

    function updateReportSummary(visits) {
        // Total visits
        const totalVisitsEl = document.getElementById('totalVisits');
        if (totalVisitsEl) totalVisitsEl.textContent = visits.length;
        
        // Unique patients
        const uniquePatients = new Set(visits.map(v => v.patientId)).size;
        const uniquePatientsEl = document.getElementById('uniquePatients');
        if (uniquePatientsEl) uniquePatientsEl.textContent = uniquePatients;
        
        // Average visits per day
        const visitDates = new Set(visits.map(v => v.visitDate));
        const avgPerDay = visitDates.size > 0 ? (visits.length / visitDates.size).toFixed(1) : 0;
        const avgVisitsPerDayEl = document.getElementById('avgVisitsPerDay');
        if (avgVisitsPerDayEl) avgVisitsPerDayEl.textContent = avgPerDay;
        
        // Busiest polyclinic
        const polyclinicCounts = {};
        visits.forEach(visit => {
            polyclinicCounts[visit.polyclinic] = (polyclinicCounts[visit.polyclinic] || 0) + 1;
        });
        
        const busiestPolyclinic = Object.keys(polyclinicCounts).reduce((a, b) => 
            polyclinicCounts[a] > polyclinicCounts[b] ? a : b, '-'
        );
        
        const busiestPolyclinicEl = document.getElementById('busiestPolyclinic');
        if (busiestPolyclinicEl) busiestPolyclinicEl.textContent = busiestPolyclinic;
    }

    function displayPolyclinicBreakdown(visits) {
        const polyclinicReport = document.getElementById('polyclinicReport');
        if (!polyclinicReport) return;
        
        const polyclinicData = {};
        visits.forEach(visit => {
            if (!polyclinicData[visit.polyclinic]) {
                polyclinicData[visit.polyclinic] = 0;
            }
            polyclinicData[visit.polyclinic]++;
        });
        
        polyclinicReport.innerHTML = '';
        Object.entries(polyclinicData)
            .sort(([,a], [,b]) => b - a)
            .forEach(([polyclinic, count]) => {
                const item = document.createElement('div');
                item.className = 'flex justify-between items-center';
                item.innerHTML = `
                    <span class="text-sm text-gray-600">${polyclinic}</span>
                    <span class="font-semibold text-gray-800">${count}</span>
                `;
                polyclinicReport.appendChild(item);
            });
    }

    function displayDoctorBreakdown(visits) {
        const doctorReport = document.getElementById('doctorReport');
        if (!doctorReport) return;
        
        const doctorData = {};
        visits.forEach(visit => {
            if (!doctorData[visit.doctorName]) {
                doctorData[visit.doctorName] = 0;
            }
            doctorData[visit.doctorName]++;
        });
        
        doctorReport.innerHTML = '';
        Object.entries(doctorData)
            .sort(([,a], [,b]) => b - a)
            .forEach(([doctor, count]) => {
                const item = document.createElement('div');
                item.className = 'flex justify-between items-center';
                item.innerHTML = `
                    <span class="text-sm text-gray-600">${doctor}</span>
                    <span class="font-semibold text-gray-800">${count}</span>
                `;
                doctorReport.appendChild(item);
            });
    }

    function displayDetailedVisitList(visits) {
        const visitList = document.getElementById('visitList');
        if (!visitList) return;
        
        visitList.innerHTML = '';
        
        if (visits.length === 0) {
            visitList.innerHTML = '<p class="text-gray-500 text-center py-4">Tidak ada kunjungan untuk periode yang dipilih</p>';
            return;
        }
        
        // Sort visits by date and time
        const sortedVisits = visits.sort((a, b) => {
            const dateCompare = new Date(b.visitDate) - new Date(a.visitDate);
            if (dateCompare === 0) {
                return b.visitTime.localeCompare(a.visitTime);
            }
            return dateCompare;
        });
        
        sortedVisits.forEach(visit => {
            const statusClass = visit.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                              visit.status === 'Sedang Dilayani' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800';
            
            const visitCard = document.createElement('div');
            visitCard.className = 'bg-white border rounded-lg p-3 mb-2';
            visitCard.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h4 class="font-medium text-gray-900">${visit.patientName}</h4>
                        <p class="text-sm text-gray-600">${visit.doctorName} - ${visit.polyclinic}</p>
                    </div>
                    <span class="px-2 py-1 rounded-full text-xs font-medium ${statusClass}">
                        ${visit.status}
                    </span>
                </div>
                <div class="flex justify-between items-center text-sm text-gray-500">
                    <span>${new Date(visit.visitDate).toLocaleDateString('id-ID')} • ${visit.visitTime}</span>
                    <span>No. Antrian: ${visit.queueNumber}</span>
                </div>
            `;
            visitList.appendChild(visitCard);
        });
    }

    // Initialize the admin panel when DOM is loaded
    renderPatientList();
    renderDoctorScheduleList();
    updateStatistics();

    // Set default date to today for reports
    const reportDateInput = document.getElementById('reportDate');
    if (reportDateInput) {
        reportDateInput.value = new Date().toISOString().split('T')[0];
    }
});