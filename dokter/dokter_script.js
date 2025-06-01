// Doctor Dashboard Script
document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const appointmentsList = document.getElementById('appointmentsList');
    const schedulesList = document.getElementById('schedulesList');
    const doctorModal = document.getElementById('doctorModal');
    const doctorModalTitle = document.getElementById('doctorModalTitle');
    const doctorModalBody = document.getElementById('doctorModalBody');
    const doctorModalFooter = document.getElementById('doctorModalFooter');
    const logoutButton = document.getElementById('logoutButton');
    const doctorInfo = document.getElementById('doctorInfo');
    const filterTodayBtn = document.getElementById('filterTodayBtn');
    const filterAllBtn = document.getElementById('filterAllBtn');
    const addScheduleBtn = document.getElementById('addScheduleBtn');

    // Check for doctor role
    if (sessionStorage.getItem('userRole') !== 'dokter') {
        alert('Akses ditolak. Anda harus login sebagai Dokter.');
        window.location.href = '../index.html';
        return;
    }

    // Current doctor info (should come from login session)
    const currentDoctor = JSON.parse(sessionStorage.getItem('userData')) || {
        id: 1,
        name: 'Dr. Ahmad Subarjo',
        specialization: 'Dokter Umum',
        polyclinic: 'Umum'
    };

    // Update doctor info display
    if (doctorInfo) {
        doctorInfo.textContent = `Selamat datang, ${currentDoctor.name} - ${currentDoctor.specialization}`;
    }

    // Logout functionality
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            if (confirm('Apakah Anda yakin ingin keluar?')) {
                sessionStorage.removeItem('userRole');
                sessionStorage.removeItem('userData');
                window.location.href = '../index.html';
            }
        });
    }    // --- Sample Data for Doctor Dashboard ---
    let appointments = [
        { 
            id: 1, 
            patientName: 'Budi Santoso', 
            patientPhone: '081234567890',
            date: '2025-06-01', 
            time: '09:00', 
            polyclinic: 'Umum',
            complaint: 'Demam dan batuk',
            status: 'Menunggu',
            doctorId: 1
        },
        { 
            id: 2, 
            patientName: 'Ani Lestari', 
            patientPhone: '087654321098',
            date: '2025-06-01', 
            time: '10:00', 
            polyclinic: 'Umum',
            complaint: 'Sakit kepala',
            status: 'Dikonfirmasi',
            doctorId: 1
        },
        { 
            id: 3, 
            patientName: 'Sari Dewi', 
            patientPhone: '081345678901',
            date: '2025-06-02', 
            time: '14:00', 
            polyclinic: 'Umum',
            complaint: 'Kontrol rutin',
            status: 'Menunggu',
            doctorId: 1
        },
        { 
            id: 4, 
            patientName: 'Ahmad Fauzi', 
            patientPhone: '082345678901',
            date: '2025-06-03', 
            time: '09:30', 
            polyclinic: 'Umum',
            complaint: 'Nyeri punggung',
            status: 'Menunggu',
            doctorId: 1
        },
        { 
            id: 5, 
            patientName: 'Maya Sari', 
            patientPhone: '083456789012',
            date: '2025-06-01', 
            time: '11:00', 
            polyclinic: 'Umum',
            complaint: 'Pusing dan mual',
            status: 'Dibatalkan',
            doctorId: 1
        }
    ];    let doctorSchedules = [
        { 
            id: 1, 
            doctorId: 1,
            doctorName: 'Dr. Ahmad Subarjo', 
            polyclinic: 'Umum', 
            day: 'Senin', 
            time: '09:00 - 12:00', 
            quota: 20, 
            registered: 15,
            isActive: true
        },
        { 
            id: 2, 
            doctorId: 1,
            doctorName: 'Dr. Ahmad Subarjo', 
            polyclinic: 'Umum', 
            day: 'Rabu', 
            time: '14:00 - 17:00', 
            quota: 15, 
            registered: 10,
            isActive: true
        },
        { 
            id: 3, 
            doctorId: 1,
            doctorName: 'Dr. Ahmad Subarjo', 
            polyclinic: 'Umum', 
            day: 'Jumat', 
            time: '10:00 - 13:00', 
            quota: 18, 
            registered: 5,
            isActive: false
        },
        { 
            id: 4, 
            doctorId: 1,
            doctorName: 'Dr. Ahmad Subarjo', 
            polyclinic: 'Umum', 
            day: 'Sabtu', 
            time: '08:00 - 11:00', 
            quota: 12, 
            registered: 8,
            isActive: true
        }
    ];    // --- Utility Functions ---
    function formatDate(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    }

    function isToday(dateString) {
        const today = new Date().toISOString().split('T')[0];
        return dateString === today;
    }

    function getStatusBadgeClass(status) {
        switch(status) {
            case 'Menunggu': return 'bg-yellow-100 text-yellow-800';
            case 'Dikonfirmasi': return 'bg-green-100 text-green-800';
            case 'Selesai': return 'bg-blue-100 text-blue-800';
            case 'Dibatalkan': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    // --- Statistics Functions ---
    function updateStatistics() {
        // Filter appointments for current doctor and today
        const todayAppointments = appointments.filter(app => 
            app.doctorId === currentDoctor.id && 
            isToday(app.date) && 
            app.status !== 'Dibatalkan'
        ).length;
        
        // Filter schedules for current doctor and this week
        const weeklySchedules = doctorSchedules.filter(schedule => 
            schedule.doctorId === currentDoctor.id && schedule.isActive
        ).length;
        
        // Calculate available slots for current doctor
        const availableSlots = doctorSchedules
            .filter(schedule => schedule.doctorId === currentDoctor.id && schedule.isActive)
            .reduce((total, schedule) => total + (schedule.quota - schedule.registered), 0);
        
        // Update DOM elements
        const todayElement = document.getElementById('todayAppointments');
        const weeklyElement = document.getElementById('weeklySchedules');
        const slotsElement = document.getElementById('availableSlots');
        
        if (todayElement) todayElement.textContent = todayAppointments;
        if (weeklyElement) weeklyElement.textContent = weeklySchedules;
        if (slotsElement) slotsElement.textContent = availableSlots;
    }    // --- Render Functions ---
    let currentFilter = 'today'; // 'today' or 'all'

    function renderAppointmentsList(filter = 'today') {
        if (!appointmentsList) return;
        
        // Filter appointments for current doctor
        let filteredAppointments = appointments.filter(app => app.doctorId === currentDoctor.id);
        
        if (filter === 'today') {
            filteredAppointments = filteredAppointments.filter(app => isToday(app.date));
        }
        
        appointmentsList.innerHTML = '';
        
        if (filteredAppointments.length === 0) {
            appointmentsList.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p>Tidak ada janji temu ${filter === 'today' ? 'hari ini' : ''}</p>
                </div>
            `;
            return;
        }
        
        filteredAppointments.forEach(appointment => {
            const appointmentCard = `
                <div class="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                    <div class="flex justify-between items-start mb-3">
                        <div class="flex-1">
                            <h4 class="font-semibold text-gray-900">${appointment.patientName}</h4>
                            <p class="text-sm text-gray-600">${formatDate(appointment.date)}</p>
                            <p class="text-sm text-gray-600">Jam: ${appointment.time}</p>
                        </div>
                        <span class="px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(appointment.status)}">
                            ${appointment.status}
                        </span>
                    </div>
                    <p class="text-sm text-gray-700 mb-3"><strong>Keluhan:</strong> ${appointment.complaint}</p>
                    <div class="flex space-x-2">
                        <button onclick="viewAppointmentDetails(${appointment.id})" class="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors">
                            Detail
                        </button>
                        ${appointment.status === 'Menunggu' ? `
                            <button onclick="confirmAppointment(${appointment.id})" class="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors">
                                Konfirmasi
                            </button>
                            <button onclick="cancelAppointment(${appointment.id})" class="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors">
                                Batalkan
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
            appointmentsList.insertAdjacentHTML('beforeend', appointmentCard);
        });
    }

    function renderSchedulesList() {
        if (!schedulesList) return;
        
        // Filter schedules for current doctor
        const doctorSched = doctorSchedules.filter(schedule => schedule.doctorId === currentDoctor.id);
        
        schedulesList.innerHTML = '';
        
        if (doctorSched.length === 0) {
            schedulesList.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p>Belum ada jadwal praktek</p>
                </div>
            `;
            return;
        }
        
        doctorSched.forEach(schedule => {
            const scheduleCard = `
                <div class="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white ${!schedule.isActive ? 'opacity-60' : ''}">
                    <div class="flex justify-between items-start mb-3">
                        <div class="flex-1">
                            <h4 class="font-semibold text-gray-900">${schedule.day}</h4>
                            <p class="text-sm text-gray-600">${schedule.time}</p>
                            <p class="text-sm text-gray-600">Poliklinik: ${schedule.polyclinic}</p>
                        </div>
                        <div class="text-right">
                            <span class="px-2 py-1 text-xs font-medium rounded-full ${schedule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                                ${schedule.isActive ? 'Aktif' : 'Non-aktif'}
                            </span>
                        </div>
                    </div>
                    <div class="mb-3">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">Pasien Terdaftar:</span>
                            <span class="font-medium">${schedule.registered}/${schedule.quota}</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div class="bg-blue-600 h-2 rounded-full" style="width: ${(schedule.registered / schedule.quota * 100)}%"></div>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="editSchedule(${schedule.id})" class="px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 transition-colors">
                            Edit
                        </button>
                        <button onclick="toggleScheduleStatus(${schedule.id})" class="px-3 py-1 ${schedule.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white text-xs rounded transition-colors">
                            ${schedule.isActive ? 'Non-aktifkan' : 'Aktifkan'}
                        </button>
                    </div>
                </div>
            `;
            schedulesList.insertAdjacentHTML('beforeend', scheduleCard);
        });
    }    // --- Modal Functions ---
    window.openDoctorModal = (title, content, footerButtons = '') => {
        if (!doctorModal || !doctorModalTitle || !doctorModalBody || !doctorModalFooter) return;
        doctorModalTitle.textContent = title;
        doctorModalBody.innerHTML = content;
        doctorModalFooter.innerHTML = '<button type="button" onclick="closeDoctorModal()" class="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded mr-2">Tutup</button>' + footerButtons;
        doctorModal.classList.remove('hidden');
    };

    window.closeDoctorModal = () => {
        if (!doctorModal || !doctorModalBody || !doctorModalFooter) return;
        doctorModal.classList.add('hidden');
        doctorModalBody.innerHTML = '';
        doctorModalFooter.innerHTML = '';
    };    // --- Appointment Actions ---
    window.viewAppointmentDetails = (appointmentId) => {
        const appointment = appointments.find(app => app.id === appointmentId);
        if (!appointment) return;
        
        const detailsHtml = `
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Nama Pasien:</label>
                        <p class="mt-1 text-sm text-gray-900">${appointment.patientName}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Telepon:</label>
                        <p class="mt-1 text-sm text-gray-900">${appointment.patientPhone}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Tanggal:</label>
                        <p class="mt-1 text-sm text-gray-900">${formatDate(appointment.date)}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Waktu:</label>
                        <p class="mt-1 text-sm text-gray-900">${appointment.time}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Poliklinik:</label>
                        <p class="mt-1 text-sm text-gray-900">${appointment.polyclinic}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Status:</label>
                        <span class="mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(appointment.status)}">
                            ${appointment.status}
                        </span>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Keluhan:</label>
                    <p class="mt-1 text-sm text-gray-900 p-3 bg-gray-50 rounded">${appointment.complaint}</p>
                </div>
            </div>
        `;
        
        let footerButtons = '';
        if (appointment.status === 'Menunggu') {
            footerButtons = `
                <button type="button" onclick="confirmAppointment(${appointmentId})" class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mr-2">Konfirmasi</button>
                <button type="button" onclick="cancelAppointment(${appointmentId})" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded mr-2">Batalkan</button>
            `;
        }
        
        window.openDoctorModal('Detail Janji Temu - ' + appointment.patientName, detailsHtml, footerButtons);
    };

    window.confirmAppointment = (appointmentId) => {
        const appointment = appointments.find(app => app.id === appointmentId);
        if (!appointment) return;
        
        appointments = appointments.map(app => 
            app.id === appointmentId ? { ...app, status: 'Dikonfirmasi' } : app
        );
        
        renderAppointmentsList(currentFilter);
        updateStatistics();
        window.closeDoctorModal();
        alert(`Janji temu ${appointment.patientName} berhasil dikonfirmasi!`);
    };

    window.cancelAppointment = (appointmentId) => {
        const appointment = appointments.find(app => app.id === appointmentId);
        if (!appointment) return;
        
        const reason = prompt('Alasan pembatalan (opsional):');
        
        appointments = appointments.map(app => 
            app.id === appointmentId ? { ...app, status: 'Dibatalkan', cancelReason: reason } : app
        );
        
        renderAppointmentsList(currentFilter);
        updateStatistics();
        window.closeDoctorModal();
        alert(`Janji temu ${appointment.patientName} berhasil dibatalkan.`);
    };
    // --- Schedule Actions ---
    window.editSchedule = (scheduleId) => {
        const schedule = doctorSchedules.find(s => s.id === scheduleId);
        if (!schedule) return;
        
        const formHtml = `
            <form id="editScheduleForm" class="space-y-4">
                <input type="hidden" id="editScheduleId" value="${schedule.id}">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Hari:</label>
                        <p class="mt-1 text-sm text-gray-900 p-2 bg-gray-50 rounded">${schedule.day}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Poliklinik:</label>
                        <p class="mt-1 text-sm text-gray-900 p-2 bg-gray-50 rounded">${schedule.polyclinic}</p>
                    </div>
                </div>
                <div>
                    <label for="editScheduleTime" class="block text-sm font-medium text-gray-700">Waktu Praktek:</label>
                    <input type="text" id="editScheduleTime" value="${schedule.time}" required 
                           placeholder="Contoh: 09:00 - 12:00"
                           class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                </div>
                <div>
                    <label for="editScheduleQuota" class="block text-sm font-medium text-gray-700">Kuota Pasien:</label>
                    <input type="number" id="editScheduleQuota" value="${schedule.quota}" required min="1" max="50"
                           class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                </div>
                <div>
                    <label for="editScheduleRegistered" class="block text-sm font-medium text-gray-700">Pasien Terdaftar:</label>
                    <input type="number" id="editScheduleRegistered" value="${schedule.registered}" required min="0"
                           class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                </div>
            </form>
        `;
        
        const footerButtons = '<button type="button" onclick="saveScheduleChanges()" class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mr-2">Simpan Perubahan</button>';
        window.openDoctorModal('Edit Jadwal Praktek - ' + schedule.day, formHtml, footerButtons);
    };

    window.saveScheduleChanges = () => {
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
            return s;
        });
        
        renderSchedulesList();
        updateStatistics();
        window.closeDoctorModal();
        alert('Jadwal praktek berhasil diperbarui!');
    };

    window.toggleScheduleStatus = (scheduleId) => {
        const schedule = doctorSchedules.find(s => s.id === scheduleId);
        if (!schedule) return;
        
        const action = schedule.isActive ? 'non-aktifkan' : 'aktifkan';
        const confirmMessage = `Apakah Anda yakin ingin ${action} jadwal praktek hari ${schedule.day}?`;
        
        if (confirm(confirmMessage)) {
            doctorSchedules = doctorSchedules.map(s => 
                s.id === scheduleId ? { ...s, isActive: !s.isActive } : s
            );
            
            renderSchedulesList();
            updateStatistics();
            alert(`Jadwal praktek hari ${schedule.day} berhasil di${action}.`);
        }
    };

    window.addNewSchedule = () => {
        const formHtml = `
            <form id="addScheduleForm" class="space-y-4">
                <div>
                    <label for="newScheduleDay" class="block text-sm font-medium text-gray-700">Hari:</label>
                    <select id="newScheduleDay" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                        <option value="">Pilih Hari</option>
                        <option value="Senin">Senin</option>
                        <option value="Selasa">Selasa</option>
                        <option value="Rabu">Rabu</option>
                        <option value="Kamis">Kamis</option>
                        <option value="Jumat">Jumat</option>
                        <option value="Sabtu">Sabtu</option>
                        <option value="Minggu">Minggu</option>
                    </select>
                </div>
                <div>
                    <label for="newScheduleTime" class="block text-sm font-medium text-gray-700">Waktu Praktek:</label>
                    <input type="text" id="newScheduleTime" required 
                           placeholder="Contoh: 09:00 - 12:00"
                           class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                </div>
                <div>
                    <label for="newScheduleQuota" class="block text-sm font-medium text-gray-700">Kuota Pasien:</label>
                    <input type="number" id="newScheduleQuota" required min="1" max="50" value="20"
                           class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                </div>
                <div>
                    <label for="newSchedulePolyclinic" class="block text-sm font-medium text-gray-700">Poliklinik:</label>
                    <select id="newSchedulePolyclinic" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                        <option value="Umum">Umum</option>
                        <option value="Anak">Anak</option>
                        <option value="Gigi">Gigi</option>
                        <option value="Mata">Mata</option>
                        <option value="THT">THT</option>
                        <option value="Kulit">Kulit</option>
                        <option value="Penyakit Dalam">Penyakit Dalam</option>
                        <option value="Kardiologi">Kardiologi</option>
                        <option value="Neurologi">Neurologi</option>
                    </select>
                </div>
            </form>
        `;
        
        const footerButtons = '<button type="button" onclick="saveNewSchedule()" class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mr-2">Tambah Jadwal</button>';
        window.openDoctorModal('Tambah Jadwal Praktek Baru', formHtml, footerButtons);
    };

    window.saveNewSchedule = () => {
        const form = document.getElementById('addScheduleForm');
        if (!form || !form.checkValidity()) {
            form?.reportValidity();
            return;
        }

        const newDay = document.getElementById('newScheduleDay').value;
        const newTime = document.getElementById('newScheduleTime').value;
        const newQuota = parseInt(document.getElementById('newScheduleQuota').value);
        const newPolyclinic = document.getElementById('newSchedulePolyclinic').value;

        // Check if schedule for this day already exists
        const existingSchedule = doctorSchedules.find(s => 
            s.doctorId === currentDoctor.id && s.day === newDay
        );
        
        if (existingSchedule) {
            alert(`Jadwal untuk hari ${newDay} sudah ada. Silakan edit jadwal yang sudah ada.`);
            return;
        }

        const newSchedule = {
            id: Math.max(...doctorSchedules.map(s => s.id)) + 1,
            doctorId: currentDoctor.id,
            doctorName: currentDoctor.name,
            polyclinic: newPolyclinic,
            day: newDay,
            time: newTime,
            quota: newQuota,
            registered: 0,
            isActive: true
        };

        doctorSchedules.push(newSchedule);
        renderSchedulesList();
        updateStatistics();
        window.closeDoctorModal();
        alert(`Jadwal praktek hari ${newDay} berhasil ditambahkan!`);
    };    // --- Event Listeners ---
    if (filterTodayBtn) {
        filterTodayBtn.addEventListener('click', () => {
            currentFilter = 'today';
            filterTodayBtn.classList.add('bg-blue-100', 'text-blue-700');
            filterTodayBtn.classList.remove('bg-gray-100', 'text-gray-700');
            filterAllBtn.classList.remove('bg-blue-100', 'text-blue-700');
            filterAllBtn.classList.add('bg-gray-100', 'text-gray-700');
            renderAppointmentsList('today');
        });
    }

    if (filterAllBtn) {
        filterAllBtn.addEventListener('click', () => {
            currentFilter = 'all';
            filterAllBtn.classList.add('bg-blue-100', 'text-blue-700');
            filterAllBtn.classList.remove('bg-gray-100', 'text-gray-700');
            filterTodayBtn.classList.remove('bg-blue-100', 'text-blue-700');
            filterTodayBtn.classList.add('bg-gray-100', 'text-gray-700');
            renderAppointmentsList('all');
        });
    }

    if (addScheduleBtn) {
        addScheduleBtn.addEventListener('click', () => {
            window.addNewSchedule();
        });
    }

    // --- Initial Render ---
    renderAppointmentsList('today');
    renderSchedulesList();
    updateStatistics();
    
    // Set initial filter button state
    if (filterTodayBtn) {
        filterTodayBtn.classList.add('bg-blue-100', 'text-blue-700');
        filterTodayBtn.classList.remove('bg-gray-100', 'text-gray-700');
    }
    
    console.log('Doctor Dashboard initialized successfully');
    console.log(`Welcome, ${currentDoctor.name}!`);
});

// Close modal when clicking outside
document.addEventListener('click', (event) => {
    const modal = document.getElementById('doctorModal');
    if (modal && event.target === modal) {
        window.closeDoctorModal();
    }
});