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
    };    // --- Initial Render ---
    renderPatientList();
    renderDoctorScheduleList();
    updateStatistics();
    
    // Add welcome message
    console.log('Admin Console initialized successfully');
    
    // Optional: Show welcome notification
    setTimeout(() => {
        const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
        console.log(`Welcome, ${userData.name || 'Admin'}!`);
    }, 1000);
});

// Functions called from inline HTML event attributes need to be on the window scope.
// This is already handled by declaring them as window.functionName inside the DOMContentLoaded listener,
// or by not declaring them with const/let within a block if they are top-level in the script.
// For clarity, explicitly assigning them to window if they are defined within a scope.
// However, the current structure where functions like viewPatientDetails are defined as window.viewPatientDetails = ...