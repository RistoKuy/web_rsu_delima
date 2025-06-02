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
            isActive: true,
            weekNumber: getCurrentWeek(),
            year: new Date().getFullYear()
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
            isActive: true,
            weekNumber: getCurrentWeek(),
            year: new Date().getFullYear()
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
            isActive: true,
            weekNumber: getCurrentWeek(),
            year: new Date().getFullYear()
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
            isActive: true,
            weekNumber: getCurrentWeek(),
            year: new Date().getFullYear()
        },
        // Next week schedules
        { 
            id: 5, 
            doctorId: 1,
            doctorName: 'Dr. Ahmad Subarjo', 
            polyclinic: 'Umum', 
            day: 'Senin', 
            time: '09:00 - 12:00', 
            quota: 20, 
            registered: 3,
            isActive: true,
            weekNumber: getCurrentWeek() + 1,
            year: new Date().getFullYear()
        },
        { 
            id: 6, 
            doctorId: 1,
            doctorName: 'Dr. Ahmad Subarjo', 
            polyclinic: 'Umum', 
            day: 'Rabu', 
            time: '14:00 - 17:00', 
            quota: 15, 
            registered: 0,
            isActive: true,
            weekNumber: getCurrentWeek() + 1,
            year: new Date().getFullYear()
        }
    ];    // --- Utility Functions ---
    function getCurrentWeek() {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const pastDaysOfYear = (now - startOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
    }

    function getWeekDates(weekNumber, year) {
        const jan1 = new Date(year, 0, 1);
        const startOfWeek = new Date(jan1.getTime() + ((weekNumber - 1) * 7 - jan1.getDay()) * 86400000);
        
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            dates.push(date);
        }
        return dates;
    }

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

    function getNextQueueNumber(scheduleId, date) {
        const existingAppointments = appointments.filter(app => 
            app.scheduleId === scheduleId && 
            app.date === date && 
            app.status !== 'Dibatalkan'
        );
        return existingAppointments.length + 1;
    }

    function calculateEstimatedTime(scheduleTime, queueNumber) {
        const [startTime] = scheduleTime.split(' - ');
        const [hours, minutes] = startTime.split(':').map(Number);
        
        // Estimate 15 minutes per patient
        const estimatedMinutes = (queueNumber - 1) * 15;
        const totalMinutes = hours * 60 + minutes + estimatedMinutes;
        
        const estimatedHours = Math.floor(totalMinutes / 60);
        const estimatedMins = totalMinutes % 60;
        
        return `${estimatedHours.toString().padStart(2, '0')}:${estimatedMins.toString().padStart(2, '0')}`;
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
    }    // Current week for schedule display
    let currentWeekNumber = getCurrentWeek();
    let currentYear = new Date().getFullYear();

    function renderSchedulesList() {
        if (!schedulesList) return;
        
        // Filter schedules for current doctor and selected week
        const doctorSched = doctorSchedules.filter(schedule => 
            schedule.doctorId === currentDoctor.id && 
            schedule.weekNumber === currentWeekNumber &&
            schedule.year === currentYear
        );
        
        schedulesList.innerHTML = '';
        
        // Add week navigation
        const weekNavigation = `
            <div class="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-lg">
                <button onclick="changeWeek(-1)" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm">
                    ← Minggu Sebelumnya
                </button>
                <div class="text-center">
                    <h3 class="font-medium text-gray-900">Minggu ke-${currentWeekNumber} Tahun ${currentYear}</h3>
                    <p class="text-sm text-gray-600">${getWeekDateRange(currentWeekNumber, currentYear)}</p>
                </div>
                <button onclick="changeWeek(1)" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm">
                    Minggu Berikutnya →
                </button>
            </div>
        `;
        schedulesList.insertAdjacentHTML('beforeend', weekNavigation);
        
        if (doctorSched.length === 0) {
            schedulesList.insertAdjacentHTML('beforeend', `
                <div class="text-center py-8 text-gray-500">
                    <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p>Belum ada jadwal praktek minggu ini</p>
                    <button onclick="addNewSchedule()" class="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm">
                        Tambah Jadwal Minggu Ini
                    </button>
                </div>
            `);
            return;
        }
        
        // Sort schedules by day order
        const dayOrder = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
        doctorSched.sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));
        
        doctorSched.forEach(schedule => {
            const availableSlots = schedule.quota - schedule.registered;
            const percentageFull = (schedule.registered / schedule.quota * 100);
            
            const scheduleCard = `
                <div class="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white ${!schedule.isActive ? 'opacity-60' : ''}">
                    <div class="flex justify-between items-start mb-3">
                        <div class="flex-1">
                            <h4 class="font-semibold text-gray-900">${schedule.day}</h4>
                            <p class="text-sm text-gray-600">${schedule.time}</p>
                            <p class="text-sm text-gray-600">Poliklinik: ${schedule.polyclinic}</p>
                            <p class="text-sm text-gray-500">Slot tersisa: ${availableSlots}</p>
                        </div>
                        <div class="text-right">
                            <span class="px-2 py-1 text-xs font-medium rounded-full ${schedule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                                ${schedule.isActive ? 'Aktif' : 'Non-aktif'}
                            </span>
                            ${percentageFull >= 90 ? '<span class="block mt-1 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Hampir Penuh</span>' : ''}
                            ${percentageFull === 100 ? '<span class="block mt-1 px-2 py-1 text-xs font-medium rounded-full bg-red-200 text-red-900">Penuh</span>' : ''}
                        </div>
                    </div>
                    <div class="mb-3">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">Pasien Terdaftar:</span>
                            <span class="font-medium">${schedule.registered}/${schedule.quota}</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div class="bg-blue-600 h-2 rounded-full" style="width: ${percentageFull}%"></div>
                        </div>
                    </div>
                    <div class="flex space-x-2 flex-wrap gap-1">
                        <button onclick="viewScheduleDetails(${schedule.id})" class="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors">
                            Detail Pasien
                        </button>
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
    }

    function getWeekDateRange(weekNumber, year) {
        const dates = getWeekDates(weekNumber, year);
        const startDate = dates[0].toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        const endDate = dates[6].toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        return `${startDate} - ${endDate}`;
    }

    window.changeWeek = (direction) => {
        currentWeekNumber += direction;
        
        // Handle year transition
        if (currentWeekNumber < 1) {
            currentWeekNumber = 52;
            currentYear--;
        } else if (currentWeekNumber > 52) {
            currentWeekNumber = 1;
            currentYear++;
        }
        
        renderSchedulesList();
        updateStatistics(); // Update stats for new week
    };

    window.addNewSchedule = () => {
        const content = `
            <form id="addScheduleForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Hari</label>
                    <select id="scheduleDay" class="w-full p-2 border border-gray-300 rounded-md" required>
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
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Jam Mulai</label>
                        <input type="time" id="scheduleStartTime" class="w-full p-2 border border-gray-300 rounded-md" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Jam Selesai</label>
                        <input type="time" id="scheduleEndTime" class="w-full p-2 border border-gray-300 rounded-md" required>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Kuota Pasien (Maksimal 20)</label>
                    <input type="number" id="scheduleQuota" min="1" max="20" class="w-full p-2 border border-gray-300 rounded-md" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Poliklinik</label>
                    <input type="text" id="schedulePolyclinic" value="${currentDoctor.polyclinic}" class="w-full p-2 border border-gray-300 rounded-md bg-gray-100" readonly>
                </div>
            </form>
        `;
        
        const footerButtons = `
            <button type="button" onclick="saveNewSchedule()" class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
                Simpan Jadwal
            </button>
        `;
        
        openDoctorModal('Tambah Jadwal Baru', content, footerButtons);
    };

    window.saveNewSchedule = () => {
        const form = document.getElementById('addScheduleForm');
        const formData = new FormData(form);
        
        const day = document.getElementById('scheduleDay').value;
        const startTime = document.getElementById('scheduleStartTime').value;
        const endTime = document.getElementById('scheduleEndTime').value;
        const quota = parseInt(document.getElementById('scheduleQuota').value);
        const polyclinic = document.getElementById('schedulePolyclinic').value;
        
        if (!day || !startTime || !endTime || !quota) {
            alert('Mohon lengkapi semua field');
            return;
        }
        
        if (quota > 20) {
            alert('Kuota maksimal adalah 20 pasien');
            return;
        }
        
        // Check for duplicate schedule
        const existingSchedule = doctorSchedules.find(schedule => 
            schedule.doctorId === currentDoctor.id &&
            schedule.day === day &&
            schedule.weekNumber === currentWeekNumber &&
            schedule.year === currentYear &&
            schedule.isActive
        );
        
        if (existingSchedule) {
            alert('Jadwal untuk hari tersebut sudah ada di minggu ini');
            return;
        }
        
        const newSchedule = {
            id: Date.now(),
            doctorId: currentDoctor.id,
            doctorName: currentDoctor.name,
            polyclinic: polyclinic,
            day: day,
            time: `${startTime} - ${endTime}`,
            quota: quota,
            registered: 0,
            isActive: true,
            weekNumber: currentWeekNumber,
            year: currentYear
        };
        
        doctorSchedules.push(newSchedule);
        renderSchedulesList();
        updateStatistics();
        closeDoctorModal();
        
        alert('Jadwal berhasil ditambahkan');
    };// --- Modal Functions ---
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
    window.viewScheduleDetails = (scheduleId) => {
        const schedule = doctorSchedules.find(sch => sch.id === scheduleId);
        if (!schedule) return;
        
        // Get appointments for this schedule
        const scheduleAppointments = appointments.filter(app => 
            app.doctorId === currentDoctor.id && 
            app.polyclinic === schedule.polyclinic &&
            // Check if appointment day matches schedule day (simple check for demo)
            new Date(app.date).toLocaleDateString('id-ID', { weekday: 'long' }) === schedule.day
        );
        
        let appointmentsList = '';
        if (scheduleAppointments.length === 0) {
            appointmentsList = '<p class="text-gray-500 text-center py-4">Belum ada pasien terdaftar</p>';
        } else {
            appointmentsList = scheduleAppointments.map((app, index) => `
                <div class="border-b pb-3 mb-3 last:border-b-0">
                    <div class="flex justify-between items-start">
                        <div>
                            <h5 class="font-medium">${app.patientName}</h5>
                            <p class="text-sm text-gray-600">Antrian: ${index + 1}</p>
                            <p class="text-sm text-gray-600">Estimasi: ${calculateEstimatedTime(schedule.time, index + 1)}</p>
                            <p class="text-sm text-gray-600">Keluhan: ${app.complaint}</p>
                        </div>
                        <span class="px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(app.status)}">
                            ${app.status}
                        </span>
                    </div>
                </div>
            `).join('');
        }
        
        const detailsHtml = `
            <div class="space-y-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="font-medium mb-2">Informasi Jadwal</h4>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span class="text-gray-600">Hari:</span>
                            <span class="ml-2 font-medium">${schedule.day}</span>
                        </div>
                        <div>
                            <span class="text-gray-600">Waktu:</span>
                            <span class="ml-2 font-medium">${schedule.time}</span>
                        </div>
                        <div>
                            <span class="text-gray-600">Poliklinik:</span>
                            <span class="ml-2 font-medium">${schedule.polyclinic}</span>
                        </div>
                        <div>
                            <span class="text-gray-600">Status:</span>
                            <span class="ml-2 font-medium">${schedule.isActive ? 'Aktif' : 'Non-aktif'}</span>
                        </div>
                        <div>
                            <span class="text-gray-600">Kuota:</span>
                            <span class="ml-2 font-medium">${schedule.quota} pasien</span>
                        </div>
                        <div>
                            <span class="text-gray-600">Terdaftar:</span>
                            <span class="ml-2 font-medium">${schedule.registered} pasien</span>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4 class="font-medium mb-3">Daftar Pasien (${scheduleAppointments.length})</h4>
                    <div class="max-h-64 overflow-y-auto">
                        ${appointmentsList}
                    </div>
                </div>
            </div>
        `;
        
        openDoctorModal(`Detail Jadwal - ${schedule.day}`, detailsHtml);
    };

    window.editSchedule = (scheduleId) => {
        const schedule = doctorSchedules.find(sch => sch.id === scheduleId);
        if (!schedule) return;
        
        const [startTime, endTime] = schedule.time.split(' - ');
        
        const content = `
            <form id="editScheduleForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Hari</label>
                    <select id="editScheduleDay" class="w-full p-2 border border-gray-300 rounded-md" required>
                        <option value="Senin" ${schedule.day === 'Senin' ? 'selected' : ''}>Senin</option>
                        <option value="Selasa" ${schedule.day === 'Selasa' ? 'selected' : ''}>Selasa</option>
                        <option value="Rabu" ${schedule.day === 'Rabu' ? 'selected' : ''}>Rabu</option>
                        <option value="Kamis" ${schedule.day === 'Kamis' ? 'selected' : ''}>Kamis</option>
                        <option value="Jumat" ${schedule.day === 'Jumat' ? 'selected' : ''}>Jumat</option>
                        <option value="Sabtu" ${schedule.day === 'Sabtu' ? 'selected' : ''}>Sabtu</option>
                        <option value="Minggu" ${schedule.day === 'Minggu' ? 'selected' : ''}>Minggu</option>
                    </select>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Jam Mulai</label>
                        <input type="time" id="editScheduleStartTime" value="${startTime}" class="w-full p-2 border border-gray-300 rounded-md" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Jam Selesai</label>
                        <input type="time" id="editScheduleEndTime" value="${endTime}" class="w-full p-2 border border-gray-300 rounded-md" required>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Kuota Pasien (Maksimal 20)</label>
                    <input type="number" id="editScheduleQuota" value="${schedule.quota}" min="${schedule.registered}" max="20" class="w-full p-2 border border-gray-300 rounded-md" required>
                    <p class="text-xs text-gray-500 mt-1">*Kuota tidak dapat dikurangi di bawah jumlah pasien yang sudah terdaftar (${schedule.registered})</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Poliklinik</label>
                    <input type="text" value="${schedule.polyclinic}" class="w-full p-2 border border-gray-300 rounded-md bg-gray-100" readonly>
                </div>
            </form>
        `;
        
        const footerButtons = `
            <button type="button" onclick="updateSchedule(${scheduleId})" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                Simpan Perubahan
            </button>
        `;
        
        openDoctorModal('Edit Jadwal', content, footerButtons);
    };

    window.updateSchedule = (scheduleId) => {
        const schedule = doctorSchedules.find(sch => sch.id === scheduleId);
        if (!schedule) return;
        
        const day = document.getElementById('editScheduleDay').value;
        const startTime = document.getElementById('editScheduleStartTime').value;
        const endTime = document.getElementById('editScheduleEndTime').value;
        const quota = parseInt(document.getElementById('editScheduleQuota').value);
        
        if (!day || !startTime || !endTime || !quota) {
            alert('Mohon lengkapi semua field');
            return;
        }
        
        if (quota > 20) {
            alert('Kuota maksimal adalah 20 pasien');
            return;
        }
        
        if (quota < schedule.registered) {
            alert(`Kuota tidak dapat dikurangi di bawah ${schedule.registered} (jumlah pasien yang sudah terdaftar)`);
            return;
        }
        
        // Update schedule
        schedule.day = day;
        schedule.time = `${startTime} - ${endTime}`;
        schedule.quota = quota;
        
        renderSchedulesList();
        updateStatistics();
        closeDoctorModal();
        
        alert('Jadwal berhasil diperbarui');
    };

    window.toggleScheduleStatus = (scheduleId) => {
        const schedule = doctorSchedules.find(sch => sch.id === scheduleId);
        if (!schedule) return;
        
        const action = schedule.isActive ? 'menonaktifkan' : 'mengaktifkan';
        if (confirm(`Apakah Anda yakin ingin ${action} jadwal ini?`)) {
            schedule.isActive = !schedule.isActive;
            renderSchedulesList();
            updateStatistics();
            alert(`Jadwal berhasil ${schedule.isActive ? 'diaktifkan' : 'dinonaktifkan'}`);
        }
    };

    // --- Event Listeners ---
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