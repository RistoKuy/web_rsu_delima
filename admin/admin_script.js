document.addEventListener('DOMContentLoaded', async () => {
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
        });    }    
    
    // Global variables for mock data
    let patients = [];
    let doctorSchedules = [];
    let patientVisits = [];
    let detailedSchedules = [];

    // Load mock data from JSON file
    async function loadMockData() {
        try {
            const response = await fetch('../assets/mockData.json');
            const data = await response.json();
            
            patients = data.patients || [];
            doctorSchedules = data.doctorSchedules || [];
            patientVisits = data.patientVisits || [];
            detailedSchedules = data.detailedSchedules || [];
            
            console.log('Mock data loaded successfully for admin');
        } catch (error) {
            console.error('Error loading mock data:', error);
        }
    }

    // Load data before initializing the application
    await loadMockData();

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
                `;            doctorReport.appendChild(item);
            });
    }

    function displayDetailedVisitList(visits) {
        // Try both visitList and visitTableBody elements
        const visitList = document.getElementById('visitList');
        const visitTableBody = document.getElementById('visitTableBody');
        
        if (!visitList && !visitTableBody) return;
        
        if (visitTableBody) {
            // Clear table body
            visitTableBody.innerHTML = '';
            
            if (visits.length === 0) {
                visitTableBody.innerHTML = '<tr><td colspan="7" class="px-4 py-8 text-center text-gray-500">Tidak ada kunjungan untuk periode yang dipilih</td></tr>';
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
                
                const row = document.createElement('tr');
                row.className = 'hover:bg-gray-50';
                row.innerHTML = `
                    <td class="px-2 md:px-4 py-3 text-sm text-gray-900">${new Date(visit.visitDate).toLocaleDateString('id-ID')}</td>
                    <td class="px-2 md:px-4 py-3 text-sm text-gray-900">${visit.visitTime}</td>
                    <td class="px-2 md:px-4 py-3 text-sm text-gray-900">${visit.patientName}</td>
                    <td class="px-2 md:px-4 py-3 text-sm text-gray-900">${visit.doctorName}</td>
                    <td class="px-2 md:px-4 py-3 text-sm text-gray-900">${visit.polyclinic}</td>
                    <td class="px-2 md:px-4 py-3">
                        <span class="px-2 py-1 rounded-full text-xs font-medium ${statusClass}">
                            ${visit.status}
                        </span>
                    </td>
                    <td class="px-2 md:px-4 py-3 text-sm text-gray-900">${visit.queueNumber}</td>
                `;
                visitTableBody.appendChild(row);
            });
        } else if (visitList) {
            // Handle card layout (fallback)
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
    }

    // Mock Data Randomizer for Testing - Dynamic version using existing mockData.json
    function generateRandomMockData() {
        // Extract dynamic data from existing mock data
        const doctorNames = [...new Set(doctorSchedules.map(schedule => schedule.doctorName))];
        const polyclinics = [...new Set(doctorSchedules.map(schedule => schedule.polyclinic))];
        const patientNames = patients.map(patient => patient.name);
        
        // If no data available, use fallback arrays
        const fallbackDoctors = [
            'Dr. Ahmad Subarjo', 'Dr. Siti Aminah', 'Dr. Budi Prasetyo', 
            'Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Emily Rodriguez'
        ];
        const fallbackPolyclinics = ['Umum', 'Anak', 'Gigi', 'Kardiologi', 'Mata', 'THT'];
        const fallbackPatients = [
            'Budi Santoso', 'Ani Lestari', 'Sari Dewi', 'Ahmad Fauzi', 'Maya Sari',
            'Rina Putri', 'Dedi Kurniawan', 'Lina Wati', 'Joko Widodo', 'Sri Mulyani'
        ];
        
        const finalDoctorNames = doctorNames.length > 0 ? doctorNames : fallbackDoctors;
        const finalPolyclinics = polyclinics.length > 0 ? polyclinics : fallbackPolyclinics;
        const finalPatientNames = patientNames.length > 0 ? patientNames : fallbackPatients;
        
        const statuses = ['Selesai', 'Sedang Dilayani', 'Menunggu'];
        
        // Generate time slots dynamically based on existing schedules
        const existingTimes = [...new Set(doctorSchedules.map(schedule => {
            // Extract times from schedule.time (e.g., "08:00 - 12:00")
            const timeRange = schedule.time.split(' - ');
            if (timeRange.length === 2) {
                const startTime = timeRange[0];
                const endTime = timeRange[1];
                const slots = [];
                
                // Generate 15-minute intervals within the time range
                const start = parseInt(startTime.split(':')[0]);
                const end = parseInt(endTime.split(':')[0]);
                
                for (let hour = start; hour < end; hour++) {
                    slots.push(`${hour.toString().padStart(2, '0')}:00`);
                    slots.push(`${hour.toString().padStart(2, '0')}:15`);
                    slots.push(`${hour.toString().padStart(2, '0')}:30`);
                    slots.push(`${hour.toString().padStart(2, '0')}:45`);
                }
                return slots;
            }
            return [];
        }).flat())];
        
        // Fallback time slots if no existing schedules
        const fallbackTimeSlots = [
            '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45',
            '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45',
            '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45',
            '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45'
        ];
        
        const timeSlots = existingTimes.length > 0 ? existingTimes : fallbackTimeSlots;
        
        // Generate random visits for the last 30 days
        const newVisits = [];
        const today = new Date();
        
        for (let i = 0; i < 60; i++) { // Generate 60 random visits
            const visitDate = new Date(today);
            visitDate.setDate(today.getDate() - Math.floor(Math.random() * 30)); // Last 30 days
            
            const doctorName = doctorNames[Math.floor(Math.random() * doctorNames.length)];
            const polyclinic = polyclinics[Math.floor(Math.random() * polyclinics.length)];
            const patientName = patientNames[Math.floor(Math.random() * patientNames.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const visitTime = timeSlots[Math.floor(Math.random() * timeSlots.length)];
            
            // Generate queue number based on polyclinic
            const queuePrefix = polyclinic === 'Umum' ? 'A' : 
                               polyclinic === 'Anak' ? 'B' : 
                               polyclinic === 'Gigi' ? 'C' : 
                               polyclinic === 'Kardiologi' ? 'D' : 
                               polyclinic === 'Mata' ? 'E' : 
                               polyclinic === 'THT' ? 'F' : 'G';
            
            const queueNumber = queuePrefix + String(Math.floor(Math.random() * 50) + 1).padStart(3, '0');
            
            newVisits.push({
                id: patientVisits.length + i + 1,
                patientId: Math.floor(Math.random() * 20) + 1,
                patientName: patientName,
                doctorId: Math.floor(Math.random() * 12) + 1,
                doctorName: doctorName,
                polyclinic: polyclinic,
                visitDate: visitDate.toISOString().split('T')[0],
                visitTime: visitTime,
                status: status,
                queueNumber: queueNumber,
                scheduleId: Math.floor(Math.random() * 9) + 1
            });
        }
        
        // Add new visits to existing data
        patientVisits.push(...newVisits);
        
        // Sort by date (newest first)
        patientVisits.sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
        
        console.log(`Generated ${newVisits.length} additional mock visits. Total: ${patientVisits.length}`);
        
        // Update statistics after generating new data
        updateStatistics();
        
        return newVisits.length;
    }

    // Function to reset mock data
    function resetMockData() {
        // Reset to original 25 visits
        patientVisits.splice(25); // Keep only first 25 items
        updateStatistics();
        console.log('Mock data reset to original 25 visits');
    }

    // Add buttons for mock data management
    window.generateRandomData = () => {
        const generated = generateRandomMockData();
        alert(`Generated ${generated} additional mock visits for testing!`);
    };

    window.resetMockData = () => {
        resetMockData();
        alert('Mock data has been reset to original state!');
    };

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