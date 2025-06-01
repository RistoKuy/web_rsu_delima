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
        { id: 1, patientId: 1, patientName: 'Budi Santoso', doctorId: 1, doctorName: 'Dr. Ahmad Subarjo', polyclinic: 'Umum', visitDate: '2025-05-30', visitTime: '09:15', status: 'Selesai', queueNumber: 'A001' },
        { id: 2, patientId: 2, patientName: 'Ani Lestari', doctorId: 2, doctorName: 'Dr. Siti Aminah', polyclinic: 'Anak', visitDate: '2025-05-30', visitTime: '14:30', status: 'Selesai', queueNumber: 'B001' },
        { id: 3, patientId: 3, patientName: 'Sari Dewi', doctorId: 3, doctorName: 'Dr. Budi Prasetyo', polyclinic: 'Gigi', visitDate: '2025-05-30', visitTime: '10:45', status: 'Selesai', queueNumber: 'C001' },
        { id: 4, patientId: 1, patientName: 'Budi Santoso', doctorId: 4, doctorName: 'Dr. Sarah Johnson', polyclinic: 'Umum', visitDate: '2025-05-31', visitTime: '08:30', status: 'Sedang Dilayani', queueNumber: 'A002' },
        { id: 5, patientId: 4, patientName: 'Ahmad Fauzi', doctorId: 5, doctorName: 'Dr. Michael Chen', polyclinic: 'Kardiologi', visitDate: '2025-05-31', visitTime: '13:20', status: 'Menunggu', queueNumber: 'D001' },
        { id: 6, patientId: 5, patientName: 'Maya Sari', doctorId: 6, doctorName: 'Dr. Emily Rodriguez', polyclinic: 'Anak', visitDate: '2025-06-01', visitTime: '09:45', status: 'Selesai', queueNumber: 'B002' },
        { id: 7, patientId: 2, patientName: 'Ani Lestari', doctorId: 1, doctorName: 'Dr. Ahmad Subarjo', polyclinic: 'Umum', visitDate: '2025-06-01', visitTime: '10:15', status: 'Sedang Dilayani', queueNumber: 'A003' },
        { id: 8, patientId: 3, patientName: 'Sari Dewi', doctorId: 2, doctorName: 'Dr. Siti Aminah', polyclinic: 'Anak', visitDate: '2025-06-01', visitTime: '15:00', status: 'Menunggu', queueNumber: 'B003' },
        { id: 9, patientId: 4, patientName: 'Ahmad Fauzi', doctorId: 3, doctorName: 'Dr. Budi Prasetyo', polyclinic: 'Gigi', visitDate: '2025-05-29', visitTime: '11:30', status: 'Selesai', queueNumber: 'C002' },
        { id: 10, patientId: 5, patientName: 'Maya Sari', doctorId: 4, doctorName: 'Dr. Sarah Johnson', polyclinic: 'Umum', visitDate: '2025-05-29', visitTime: '09:00', status: 'Selesai', queueNumber: 'A004' },
        { id: 11, patientId: 1, patientName: 'Budi Santoso', doctorId: 5, doctorName: 'Dr. Michael Chen', polyclinic: 'Kardiologi', visitDate: '2025-05-28', visitTime: '14:45', status: 'Selesai', queueNumber: 'D002' },
        { id: 12, patientId: 2, patientName: 'Ani Lestari', doctorId: 6, doctorName: 'Dr. Emily Rodriguez', polyclinic: 'Anak', visitDate: '2025-05-28', visitTime: '10:30', status: 'Selesai', queueNumber: 'B004' },
        { id: 13, patientId: 3, patientName: 'Sari Dewi', doctorId: 1, doctorName: 'Dr. Ahmad Subarjo', polyclinic: 'Umum', visitDate: '2025-05-27', visitTime: '11:15', status: 'Selesai', queueNumber: 'A005' },
        { id: 14, patientId: 4, patientName: 'Ahmad Fauzi', doctorId: 2, doctorName: 'Dr. Siti Aminah', polyclinic: 'Anak', visitDate: '2025-05-27', visitTime: '16:00', status: 'Selesai', queueNumber: 'B005' },
        { id: 15, patientId: 5, patientName: 'Maya Sari', doctorId: 3, doctorName: 'Dr. Budi Prasetyo', polyclinic: 'Gigi', visitDate: '2025-05-26', visitTime: '12:20', status: 'Selesai', queueNumber: 'C003' }
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

    function filterVisitsByDateRange(selectedDate, reportType) {
        const selected = new Date(selectedDate);
        
        return patientVisits.filter(visit => {
            const visitDate = new Date(visit.visitDate);
            
            switch (reportType) {
                case 'daily':
                    return visitDate.toDateString() === selected.toDateString();
                    
                case 'weekly':
                    const weekStart = new Date(selected);
                    weekStart.setDate(selected.getDate() - selected.getDay());
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekStart.getDate() + 6);
                    return visitDate >= weekStart && visitDate <= weekEnd;
                    
                case 'monthly':
                    return visitDate.getFullYear() === selected.getFullYear() && 
                           visitDate.getMonth() === selected.getMonth();
                           
                default:
                    return false;
            }
        });
    }

    function displayVisitReport(visits, reportType, reportDate) {
        // Update summary statistics
        updateVisitSummary(visits, reportType);
        
        // Generate polyclinic report
        generatePolyclinicReport(visits);
        
        // Generate doctor report
        generateDoctorReport(visits);
        
        // Generate detailed visit table
        generateVisitTable(visits);
    }

    function updateVisitSummary(visits, reportType) {
        document.getElementById('totalVisits').textContent = visits.length;
        
        const uniquePatients = new Set(visits.map(v => v.patientId)).size;
        document.getElementById('uniquePatients').textContent = uniquePatients;
        
        let avgPerDay = 0;
        if (reportType === 'daily') {
            avgPerDay = visits.length;
        } else if (reportType === 'weekly') {
            avgPerDay = Math.round(visits.length / 7);
        } else if (reportType === 'monthly') {
            const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
            avgPerDay = Math.round(visits.length / daysInMonth);
        }
        document.getElementById('avgVisitsPerDay').textContent = avgPerDay;
        
        // Find busiest polyclinic
        const polyclinicCounts = {};
        visits.forEach(visit => {
            polyclinicCounts[visit.polyclinic] = (polyclinicCounts[visit.polyclinic] || 0) + 1;
        });
        
        const busiestPolyclinic = Object.keys(polyclinicCounts).reduce((a, b) => 
            polyclinicCounts[a] > polyclinicCounts[b] ? a : b, '-'
        );
        document.getElementById('busiestPolyclinic').textContent = busiestPolyclinic;
    }

    function generatePolyclinicReport(visits) {
        const polyclinicData = {};
        
        visits.forEach(visit => {
            if (!polyclinicData[visit.polyclinic]) {
                polyclinicData[visit.polyclinic] = {
                    total: 0,
                    completed: 0,
                    inProgress: 0,
                    waiting: 0
                };
            }
            
            polyclinicData[visit.polyclinic].total++;
            
            switch (visit.status) {
                case 'Selesai':
                    polyclinicData[visit.polyclinic].completed++;
                    break;
                case 'Sedang Dilayani':
                    polyclinicData[visit.polyclinic].inProgress++;
                    break;
                case 'Menunggu':
                    polyclinicData[visit.polyclinic].waiting++;
                    break;
            }
        });
        
        const polyclinicReportElement = document.getElementById('polyclinicReport');
        polyclinicReportElement.innerHTML = '';
        
        if (Object.keys(polyclinicData).length === 0) {
            polyclinicReportElement.innerHTML = '<p class="text-gray-500 text-center">Tidak ada data kunjungan untuk periode ini</p>';
            return;
        }
        
        Object.entries(polyclinicData).forEach(([polyclinic, data]) => {
            const reportItem = document.createElement('div');
            reportItem.className = 'bg-white p-3 rounded border flex justify-between items-center';
            reportItem.innerHTML = `
                <div>
                    <h4 class="font-semibold text-gray-800">${polyclinic}</h4>
                    <p class="text-sm text-gray-600">Total: ${data.total} kunjungan</p>
                </div>
                <div class="text-right text-sm">
                    <div class="text-green-600">Selesai: ${data.completed}</div>
                    <div class="text-blue-600">Sedang Dilayani: ${data.inProgress}</div>
                    <div class="text-yellow-600">Menunggu: ${data.waiting}</div>
                </div>
            `;
            polyclinicReportElement.appendChild(reportItem);
        });
    }

    function generateDoctorReport(visits) {
        const doctorData = {};
        
        visits.forEach(visit => {
            if (!doctorData[visit.doctorName]) {
                doctorData[visit.doctorName] = {
                    polyclinic: visit.polyclinic,
                    total: 0,
                    completed: 0,
                    inProgress: 0,
                    waiting: 0
                };
            }
            
            doctorData[visit.doctorName].total++;
            
            switch (visit.status) {
                case 'Selesai':
                    doctorData[visit.doctorName].completed++;
                    break;
                case 'Sedang Dilayani':
                    doctorData[visit.doctorName].inProgress++;
                    break;
                case 'Menunggu':
                    doctorData[visit.doctorName].waiting++;
                    break;
            }
        });
        
        const doctorReportElement = document.getElementById('doctorReport');
        doctorReportElement.innerHTML = '';
        
        if (Object.keys(doctorData).length === 0) {
            doctorReportElement.innerHTML = '<p class="text-gray-500 text-center">Tidak ada data kunjungan untuk periode ini</p>';
            return;
        }
        
        Object.entries(doctorData).forEach(([doctorName, data]) => {
            const reportItem = document.createElement('div');
            reportItem.className = 'bg-white p-3 rounded border flex justify-between items-center';
            reportItem.innerHTML = `
                <div>
                    <h4 class="font-semibold text-gray-800">${doctorName}</h4>
                    <p class="text-sm text-gray-600">${data.polyclinic} - Total: ${data.total} pasien</p>
                </div>
                <div class="text-right text-sm">
                    <div class="text-green-600">Selesai: ${data.completed}</div>
                    <div class="text-blue-600">Sedang Dilayani: ${data.inProgress}</div>
                    <div class="text-yellow-600">Menunggu: ${data.waiting}</div>
                </div>
            `;
            doctorReportElement.appendChild(reportItem);
        });
    }

    function generateVisitTable(visits) {
        const tableBody = document.getElementById('visitTableBody');
        tableBody.innerHTML = '';
        
        if (visits.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="7" class="px-4 py-4 text-center text-gray-500">Tidak ada data kunjungan untuk periode ini</td>';
            tableBody.appendChild(row);
            return;
        }
        
        // Sort visits by date and time
        visits.sort((a, b) => {
            const dateCompare = new Date(a.visitDate) - new Date(b.visitDate);
            if (dateCompare !== 0) return dateCompare;
            return a.visitTime.localeCompare(b.visitTime);
        });
        
        visits.forEach(visit => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            
            const statusClass = visit.status === 'Selesai' ? 'text-green-600 bg-green-100' :
                               visit.status === 'Sedang Dilayani' ? 'text-blue-600 bg-blue-100' :
                               'text-yellow-600 bg-yellow-100';
            
            row.innerHTML = `
                <td class="px-4 py-2 text-sm">${new Date(visit.visitDate).toLocaleDateString('id-ID')}</td>
                <td class="px-4 py-2 text-sm">${visit.visitTime}</td>
                <td class="px-4 py-2 text-sm font-medium">${visit.patientName}</td>
                <td class="px-4 py-2 text-sm">${visit.doctorName}</td>
                <td class="px-4 py-2 text-sm">${visit.polyclinic}</td>
                <td class="px-4 py-2 text-sm">
                    <span class="px-2 py-1 rounded-full text-xs ${statusClass}">${visit.status}</span>
                </td>
                <td class="px-4 py-2 text-sm font-mono">${visit.queueNumber}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    window.exportVisitReport = () => {
        const reportType = document.getElementById('reportType').value;
        const reportDate = document.getElementById('reportDate').value;
        
        if (!reportDate) {
            alert('Silakan pilih tanggal untuk export laporan');
            return;
        }
        
        const filteredVisits = filterVisitsByDateRange(reportDate, reportType);
        
        if (filteredVisits.length === 0) {
            alert('Tidak ada data untuk di-export');
            return;
        }
        
        // Create CSV content
        const headers = ['Tanggal', 'Waktu', 'Pasien', 'Dokter', 'Poliklinik', 'Status', 'Nomor Antrian'];
        let csvContent = headers.join(',') + '\n';
        
        filteredVisits.forEach(visit => {
            const row = [
                new Date(visit.visitDate).toLocaleDateString('id-ID'),
                visit.visitTime,
                `"${visit.patientName}"`,
                `"${visit.doctorName}"`,
                visit.polyclinic,
                visit.status,
                visit.queueNumber
            ];
            csvContent += row.join(',') + '\n';
        });
        
        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `laporan_kunjungan_${reportType}_${reportDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
        notification.textContent = 'Laporan berhasil di-export!';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    };    // --- Initial Render ---
    renderPatientList();
    renderDoctorScheduleList();
    updateStatistics();
    
    // Initialize report date to today and check if elements exist
    const reportDateElement = document.getElementById('reportDate');
    if (reportDateElement) {
        const today = new Date().toISOString().split('T')[0];
        reportDateElement.value = today;
        
        // Generate initial report for today
        setTimeout(() => {
            generateVisitReport();
        }, 500);
    }
    
    // Add welcome message
    console.log('Admin Console initialized successfully');
    
    // Optional: Show welcome notification
    setTimeout(() => {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
        notification.textContent = 'Admin Console berhasil dimuat!';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }, 1000);

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

    function filterVisitsByDateRange(selectedDate, reportType) {
        const selected = new Date(selectedDate);
        
        return patientVisits.filter(visit => {
            const visitDate = new Date(visit.visitDate);
            
            switch (reportType) {
                case 'daily':
                    return visitDate.toDateString() === selected.toDateString();
                    
                case 'weekly':
                    const weekStart = new Date(selected);
                    weekStart.setDate(selected.getDate() - selected.getDay());
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekStart.getDate() + 6);
                    return visitDate >= weekStart && visitDate <= weekEnd;
                    
                case 'monthly':
                    return visitDate.getFullYear() === selected.getFullYear() && 
                           visitDate.getMonth() === selected.getMonth();
                          
                default:
                    return false;
            }
        });
    }

    function displayVisitReport(visits, reportType, reportDate) {
        // Update summary statistics
        updateVisitSummary(visits, reportType);
        
        // Generate polyclinic report
        generatePolyclinicReport(visits);
        
        // Generate doctor report
        generateDoctorReport(visits);
        
        // Generate detailed visit table
        generateVisitTable(visits);
    }

    function updateVisitSummary(visits, reportType) {
        document.getElementById('totalVisits').textContent = visits.length;
        
        const uniquePatients = new Set(visits.map(v => v.patientId)).size;
        document.getElementById('uniquePatients').textContent = uniquePatients;
        
        let avgPerDay = 0;
        if (reportType === 'daily') {
            avgPerDay = visits.length;
        } else if (reportType === 'weekly') {
            avgPerDay = Math.round(visits.length / 7);
        } else if (reportType === 'monthly') {
            const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
            avgPerDay = Math.round(visits.length / daysInMonth);
        }
        document.getElementById('avgVisitsPerDay').textContent = avgPerDay;
        
        // Find busiest polyclinic
        const polyclinicCounts = {};
        visits.forEach(visit => {
            polyclinicCounts[visit.polyclinic] = (polyclinicCounts[visit.polyclinic] || 0) + 1;
        });
        
        const busiestPolyclinic = Object.keys(polyclinicCounts).reduce((a, b) => 
            polyclinicCounts[a] > polyclinicCounts[b] ? a : b, '-'
        );
        document.getElementById('busiestPolyclinic').textContent = busiestPolyclinic;
    }

    function generatePolyclinicReport(visits) {
        const polyclinicData = {};
        
        visits.forEach(visit => {
            if (!polyclinicData[visit.polyclinic]) {
                polyclinicData[visit.polyclinic] = {
                    total: 0,
                    completed: 0,
                    inProgress: 0,
                    waiting: 0
                };
            }
            
            polyclinicData[visit.polyclinic].total++;
            
            switch (visit.status) {
                case 'Selesai':
                    polyclinicData[visit.polyclinic].completed++;
                    break;
                case 'Sedang Dilayani':
                    polyclinicData[visit.polyclinic].inProgress++;
                    break;
                case 'Menunggu':
                    polyclinicData[visit.polyclinic].waiting++;
                    break;
            }
        });
        
        const polyclinicReportElement = document.getElementById('polyclinicReport');
        polyclinicReportElement.innerHTML = '';
        
        if (Object.keys(polyclinicData).length === 0) {
            polyclinicReportElement.innerHTML = '<p class="text-gray-500 text-center">Tidak ada data kunjungan untuk periode ini</p>';
            return;
        }
        
        Object.entries(polyclinicData).forEach(([polyclinic, data]) => {
            const reportItem = document.createElement('div');
            reportItem.className = 'bg-white p-3 rounded border flex justify-between items-center';
            reportItem.innerHTML = `
                <div>
                    <h4 class="font-semibold text-gray-800">${polyclinic}</h4>
                    <p class="text-sm text-gray-600">Total: ${data.total} kunjungan</p>
                </div>
                <div class="text-right text-sm">
                    <div class="text-green-600">Selesai: ${data.completed}</div>
                    <div class="text-blue-600">Sedang Dilayani: ${data.inProgress}</div>
                    <div class="text-yellow-600">Menunggu: ${data.waiting}</div>
                </div>
            `;
            polyclinicReportElement.appendChild(reportItem);
        });
    }

    function generateDoctorReport(visits) {
        const doctorData = {};
        
        visits.forEach(visit => {
            if (!doctorData[visit.doctorName]) {
                doctorData[visit.doctorName] = {
                    polyclinic: visit.polyclinic,
                    total: 0,
                    completed: 0,
                    inProgress: 0,
                    waiting: 0
                };
            }
            
            doctorData[visit.doctorName].total++;
            
            switch (visit.status) {
                case 'Selesai':
                    doctorData[visit.doctorName].completed++;
                    break;
                case 'Sedang Dilayani':
                    doctorData[visit.doctorName].inProgress++;
                    break;
                case 'Menunggu':
                    doctorData[visit.doctorName].waiting++;
                    break;
            }
        });
        
        const doctorReportElement = document.getElementById('doctorReport');
        doctorReportElement.innerHTML = '';
        
        if (Object.keys(doctorData).length === 0) {
            doctorReportElement.innerHTML = '<p class="text-gray-500 text-center">Tidak ada data kunjungan untuk periode ini</p>';
            return;
        }
        
        Object.entries(doctorData).forEach(([doctorName, data]) => {
            const reportItem = document.createElement('div');
            reportItem.className = 'bg-white p-3 rounded border flex justify-between items-center';
            reportItem.innerHTML = `
                <div>
                    <h4 class="font-semibold text-gray-800">${doctorName}</h4>
                    <p class="text-sm text-gray-600">${data.polyclinic} - Total: ${data.total} pasien</p>
                </div>
                <div class="text-right text-sm">
                    <div class="text-green-600">Selesai: ${data.completed}</div>
                    <div class="text-blue-600">Sedang Dilayani: ${data.inProgress}</div>
                    <div class="text-yellow-600">Menunggu: ${data.waiting}</div>
                </div>
            `;
            doctorReportElement.appendChild(reportItem);
        });
    }

    function generateVisitTable(visits) {
        const tableBody = document.getElementById('visitTableBody');
        tableBody.innerHTML = '';
        
        if (visits.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="7" class="px-4 py-4 text-center text-gray-500">Tidak ada data kunjungan untuk periode ini</td>';
            tableBody.appendChild(row);
            return;
        }
        
        // Sort visits by date and time
        visits.sort((a, b) => {
            const dateCompare = new Date(a.visitDate) - new Date(b.visitDate);
            if (dateCompare !== 0) return dateCompare;
            return a.visitTime.localeCompare(b.visitTime);
        });
        
        visits.forEach(visit => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            
            const statusClass = visit.status === 'Selesai' ? 'text-green-600 bg-green-100' :
                               visit.status === 'Sedang Dilayani' ? 'text-blue-600 bg-blue-100' :
                               'text-yellow-600 bg-yellow-100';
            
            row.innerHTML = `
                <td class="px-4 py-2 text-sm">${new Date(visit.visitDate).toLocaleDateString('id-ID')}</td>
                <td class="px-4 py-2 text-sm">${visit.visitTime}</td>
                <td class="px-4 py-2 text-sm font-medium">${visit.patientName}</td>
                <td class="px-4 py-2 text-sm">${visit.doctorName}</td>
                <td class="px-4 py-2 text-sm">${visit.polyclinic}</td>
                <td class="px-4 py-2 text-sm">
                    <span class="px-2 py-1 rounded-full text-xs ${statusClass}">${visit.status}</span>
                </td>
                <td class="px-4 py-2 text-sm font-mono">${visit.queueNumber}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    window.exportVisitReport = () => {
        const reportType = document.getElementById('reportType').value;
        const reportDate = document.getElementById('reportDate').value;
        
        if (!reportDate) {
            alert('Silakan pilih tanggal untuk export laporan');
            return;
        }
        
        const filteredVisits = filterVisitsByDateRange(reportDate, reportType);
        
        if (filteredVisits.length === 0) {
            alert('Tidak ada data untuk di-export');
            return;
        }
        
        // Create CSV content
        const headers = ['Tanggal', 'Waktu', 'Pasien', 'Dokter', 'Poliklinik', 'Status', 'Nomor Antrian'];
        let csvContent = headers.join(',') + '\n';
        
        filteredVisits.forEach(visit => {
            const row = [
                new Date(visit.visitDate).toLocaleDateString('id-ID'),
                visit.visitTime,
                `"${visit.patientName}"`,
                `"${visit.doctorName}"`,
                visit.polyclinic,
                visit.status,
                visit.queueNumber
            ];
            csvContent += row.join(',') + '\n';
        });
        
        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `laporan_kunjungan_${reportType}_${reportDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
          // Show success message
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
        notification.textContent = 'Laporan berhasil di-export!';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    };
});