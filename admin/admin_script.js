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
        });
    }
    
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

    // --- Chart Management Functions ---
    let polyclinicChart, visitsChart, doctorUtilizationChart, genderChart;

    function initializeCharts() {
        createPolyclinicChart();
        createVisitsChart();
        createDoctorUtilizationChart();
        createGenderChart();
    }

    function createPolyclinicChart() {
        const ctx = document.getElementById('polyclinicChart');
        if (!ctx) return;

        // Count visits by polyclinic
        const polyclinicData = {};
        patientVisits.forEach(visit => {
            if (visit.polyclinic) {
                polyclinicData[visit.polyclinic] = (polyclinicData[visit.polyclinic] || 0) + 1;
            }
        });

        const labels = Object.keys(polyclinicData);
        const data = Object.values(polyclinicData);
        const colors = [
            '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
            '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
        ];

        polyclinicChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors.slice(0, labels.length),
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    function createVisitsChart() {
        const ctx = document.getElementById('visitsChart');
        if (!ctx) return;

        // Group visits by date for the last 7 days
        const last7Days = [];
        const visitCounts = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            last7Days.push(date.toLocaleDateString('id-ID', { 
                month: 'short', 
                day: 'numeric' 
            }));

            const count = patientVisits.filter(visit => visit.visitDate === dateStr).length;
            visitCounts.push(count);
        }

        visitsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: last7Days,
                datasets: [{
                    label: 'Kunjungan',
                    data: visitCounts,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    function createDoctorUtilizationChart() {
        const ctx = document.getElementById('doctorUtilizationChart');
        if (!ctx) return;

        const doctorData = doctorSchedules.map(schedule => ({
            name: schedule.doctorName || 'Unknown Doctor',
            utilization: schedule.quota > 0 ? ((schedule.registered / schedule.quota) * 100) : 0
        })).slice(0, 8);

        const labels = doctorData.map(d => d.name);
        const data = doctorData.map(d => d.utilization);

        doctorUtilizationChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Utilisasi (%)',
                    data: data,
                    backgroundColor: data.map(value => 
                        value >= 80 ? '#ef4444' : 
                        value >= 60 ? '#f59e0b' : '#10b981'
                    ),
                    borderRadius: 4,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 0
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    function createGenderChart() {
        const ctx = document.getElementById('genderChart');
        if (!ctx) return;

        // Count patients by gender
        const genderData = { 'Laki-laki': 0, 'Perempuan': 0 };
        patients.forEach(patient => {
            if (patient.gender) {
                genderData[patient.gender] = (genderData[patient.gender] || 0) + 1;
            }
        });

        genderChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(genderData),
                datasets: [{
                    data: Object.values(genderData),
                    backgroundColor: ['#3b82f6', '#ec4899'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    function updateCharts() {
        if (polyclinicChart) {
            polyclinicChart.destroy();
            createPolyclinicChart();
        }
        if (visitsChart) {
            visitsChart.destroy();
            createVisitsChart();
        }
        if (doctorUtilizationChart) {
            doctorUtilizationChart.destroy();
            createDoctorUtilizationChart();
        }
        if (genderChart) {
            genderChart.destroy();
            createGenderChart();
        }
    }

    // --- Statistics Functions ---
    function updateOperationalStatistics() {
        // Total Pasien
        const totalPatients = patients.length;
        document.getElementById('totalPatients').textContent = totalPatients;

        // Total Jadwal Dokter
        const totalSchedules = doctorSchedules.length;
        document.getElementById('totalSchedules').textContent = totalSchedules;

        // Slot Tersedia
        let availableSlots = 0;
        doctorSchedules.forEach(schedule => {
            if (typeof schedule.quota === 'number' && typeof schedule.registered === 'number') {
                availableSlots += Math.max(0, schedule.quota - schedule.registered);
            }
        });
        document.getElementById('availableSlots').textContent = availableSlots;
    }

    function updateStatistics() {
        updateOperationalStatistics();
        updateCharts();
    }

    // --- Render Functions ---
    function renderPatientList() {
        if (!patientList) return;
        patientList.innerHTML = '';
        if (patients.length === 0) {
            patientList.innerHTML = '<p class="text-gray-500">Tidak ada data pasien.</p>';
            return;
        }
        patients.forEach(patient => {
            const patientCard = document.createElement('div');
            patientCard.className = 'data-card';
            patientCard.id = 'patient-' + patient.id;
            patientCard.innerHTML = 
                '<div class="data-card-info">' +
                    '<p class="name">' + patient.name + '</p>' +
                    '<p>NIK: ' + patient.nik + '</p>' +
                '</div>' +
                '<div class="data-card-actions">' +
                    '<button onclick="window.viewPatientDetails(' + patient.id + ')" class="action-button view-button bg-blue-500 hover:bg-blue-600 text-white">Lihat</button>' +
                    '<button onclick="window.editPatient(' + patient.id + ')" class="action-button edit-button bg-yellow-500 hover:bg-yellow-600 text-white">Edit</button>' +
                    '<button onclick="window.confirmDeletePatient(' + patient.id + ')" class="action-button delete-button bg-red-500 hover:bg-red-600 text-white">Hapus</button>' +
                '</div>';
            patientList.appendChild(patientCard);
        });
    }

    function renderDoctorScheduleList() {
        if (!doctorScheduleList) return;
        doctorScheduleList.innerHTML = '';
        if (doctorSchedules.length === 0) {
            doctorScheduleList.innerHTML = '<p class="text-gray-500">Tidak ada jadwal dokter.</p>';
            return;
        }
        doctorSchedules.forEach(schedule => {
            const scheduleCard = document.createElement('div');
            scheduleCard.className = 'data-card';
            scheduleCard.id = 'schedule-' + schedule.id;
            scheduleCard.innerHTML = 
                '<div class="data-card-info">' +
                    '<p class="name">' + schedule.doctorName + ' - ' + schedule.polyclinic + '</p>' +
                    '<p>Hari: ' + schedule.day + ', Jam: ' + schedule.time + '</p>' +
                    '<p>Kuota: ' + schedule.registered + '/' + schedule.quota + '</p>' +
                '</div>' +
                '<div class="data-card-actions">' +
                    '<button onclick="window.viewDoctorScheduleDetails(' + schedule.id + ')" class="action-button view-button bg-blue-500 hover:bg-blue-600 text-white">Lihat</button>' +
                    '<button onclick="window.editDoctorSchedule(' + schedule.id + ')" class="action-button edit-button bg-yellow-500 hover:bg-yellow-600 text-white">Edit</button>' +
                    '<button onclick="window.confirmDeleteDoctorSchedule(' + schedule.id + ')" class="action-button delete-button bg-red-500 hover:bg-red-600 text-white">Hapus</button>' +
                '</div>';
            doctorScheduleList.appendChild(scheduleCard);
        });
    }

    // --- Modal Functions ---
    window.openAdminModal = (title, content, footerButtons) => {
        if (!adminModal || !adminModalTitle || !adminModalBody || !adminModalFooter) return;
        adminModalTitle.textContent = title;
        adminModalBody.innerHTML = content;
        adminModalFooter.innerHTML = footerButtons || '';
        adminModal.classList.remove('hidden');
    };

    window.closeAdminModal = () => {
        if (!adminModal || !adminModalBody || !adminModalFooter) return;
        adminModal.classList.add('hidden');
        adminModalBody.innerHTML = '';
        adminModalFooter.innerHTML = '';
    };

    // Initialize the admin panel
    renderPatientList();
    renderDoctorScheduleList();
    updateStatistics();
    
    // Initialize charts after data is loaded
    initializeCharts();

    // Set default date to today for reports
    const reportDateInput = document.getElementById('reportDate');
    if (reportDateInput) {
        reportDateInput.value = new Date().toISOString().split('T')[0];
    }

    // --- DATA RECAP FUNCTIONS ---
    
    // Helper function to get date range based on report type
    function getDateRange(reportType, selectedDate) {
        const date = new Date(selectedDate);
        const today = new Date();
        
        switch(reportType) {
            case 'daily':
                return {
                    start: selectedDate,
                    end: selectedDate,
                    label: `Tanggal ${date.toLocaleDateString('id-ID')}`
                };
            case 'weekly':
                const startOfWeek = new Date(date);
                startOfWeek.setDate(date.getDate() - date.getDay());
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                return {
                    start: startOfWeek.toISOString().split('T')[0],
                    end: endOfWeek.toISOString().split('T')[0],
                    label: `Minggu ${startOfWeek.toLocaleDateString('id-ID')} - ${endOfWeek.toLocaleDateString('id-ID')}`
                };
            case 'monthly':
                const year = date.getFullYear();
                const month = date.getMonth();
                const startOfMonth = new Date(year, month, 1);
                const endOfMonth = new Date(year, month + 1, 0);
                return {
                    start: startOfMonth.toISOString().split('T')[0],
                    end: endOfMonth.toISOString().split('T')[0],
                    label: `Bulan ${date.toLocaleDateString('id-ID', {month: 'long', year: 'numeric'})}`
                };
            default:
                return { start: selectedDate, end: selectedDate, label: date.toLocaleDateString('id-ID') };
        }
    }

    // Filter visits by date range
    function filterVisitsByDateRange(startDate, endDate) {
        return patientVisits.filter(visit => {
            if (!visit.visitDate) return false;
            return visit.visitDate >= startDate && visit.visitDate <= endDate;
        });
    }

    // Generate main visit report
    window.generateVisitReport = () => {
        const reportType = document.getElementById('reportType').value;
        const selectedDate = document.getElementById('reportDate').value;
        
        if (!selectedDate) {
            alert('Silakan pilih tanggal terlebih dahulu');
            return;
        }

        const dateRange = getDateRange(reportType, selectedDate);
        const filteredVisits = filterVisitsByDateRange(dateRange.start, dateRange.end);
        
        // Calculate summary statistics
        const totalVisits = filteredVisits.length;
        const uniquePatients = new Set(filteredVisits.map(v => v.patientId)).size;
        const daysInRange = reportType === 'daily' ? 1 : 
                           reportType === 'weekly' ? 7 : 
                           new Date(new Date(selectedDate).getFullYear(), new Date(selectedDate).getMonth() + 1, 0).getDate();
        const avgVisitsPerDay = (totalVisits / daysInRange).toFixed(1);
        
        // Find busiest polyclinic
        const polyclinicCounts = {};
        filteredVisits.forEach(visit => {
            if (visit.polyclinic) {
                polyclinicCounts[visit.polyclinic] = (polyclinicCounts[visit.polyclinic] || 0) + 1;
            }
        });
        const busiestPolyclinic = Object.keys(polyclinicCounts).reduce((a, b) => 
            polyclinicCounts[a] > polyclinicCounts[b] ? a : b, '-'
        );

        // Update summary cards
        document.getElementById('totalVisits').textContent = totalVisits;
        document.getElementById('uniquePatients').textContent = uniquePatients;
        document.getElementById('avgVisitsPerDay').textContent = avgVisitsPerDay;
        document.getElementById('busiestPolyclinic').textContent = busiestPolyclinic;

        // Update additional stats
        const activePolyclinics = Object.keys(polyclinicCounts).length;
        document.getElementById('totalActivePolyclinics').textContent = activePolyclinics;
        
        // Today's schedules
        const today = new Date().toISOString().split('T')[0];
        const todaySchedules = doctorSchedules.filter(schedule => {
            // Assuming schedules are for today if they're active
            return schedule.isActive;
        }).length;
        document.getElementById('todaySchedules').textContent = todaySchedules;

        // Average utilization
        const totalQuota = doctorSchedules.reduce((sum, schedule) => sum + (schedule.quota || 0), 0);
        const totalRegistered = doctorSchedules.reduce((sum, schedule) => sum + (schedule.registered || 0), 0);
        const avgUtilization = totalQuota > 0 ? ((totalRegistered / totalQuota) * 100).toFixed(1) : 0;
        document.getElementById('averageUtilization').textContent = avgUtilization + '%';

        // Generate polyclinic report
        generatePolyclinicReport(filteredVisits);
        
        // Generate doctor report
        generateDoctorReport(filteredVisits);
        
        // Generate detailed visit table
        generateVisitTable(filteredVisits);

        console.log(`Generated ${reportType} report for ${dateRange.label}: ${totalVisits} visits`);
    };

    // Generate polyclinic service report
    window.generatePolyclinicServiceReport = () => {
        const reportType = document.getElementById('reportType').value;
        const selectedDate = document.getElementById('reportDate').value;
        
        if (!selectedDate) {
            alert('Silakan pilih tanggal terlebih dahulu');
            return;
        }

        const dateRange = getDateRange(reportType, selectedDate);
        const filteredVisits = filterVisitsByDateRange(dateRange.start, dateRange.end);
        
        generatePolyclinicReport(filteredVisits);
        console.log(`Generated polyclinic service report for ${dateRange.label}`);
    };

    // Generate schedule service report
    window.generateScheduleServiceReport = () => {
        const reportType = document.getElementById('reportType').value;
        const selectedDate = document.getElementById('reportDate').value;
        
        if (!selectedDate) {
            alert('Silakan pilih tanggal terlebih dahulu');
            return;
        }

        const dateRange = getDateRange(reportType, selectedDate);
        const filteredVisits = filterVisitsByDateRange(dateRange.start, dateRange.end);
        
        generateDoctorReport(filteredVisits);
        console.log(`Generated schedule service report for ${dateRange.label}`);
    };

    // Generate polyclinic breakdown report
    function generatePolyclinicReport(visits) {
        const polyclinicReport = document.getElementById('polyclinicReport');
        if (!polyclinicReport) return;

        // Count visits by polyclinic
        const polyclinicData = {};
        const polyclinicSchedules = {};
        
        visits.forEach(visit => {
            if (visit.polyclinic) {
                polyclinicData[visit.polyclinic] = (polyclinicData[visit.polyclinic] || 0) + 1;
            }
        });

        // Count schedules by polyclinic for utilization calculation
        doctorSchedules.forEach(schedule => {
            if (schedule.polyclinic) {
                if (!polyclinicSchedules[schedule.polyclinic]) {
                    polyclinicSchedules[schedule.polyclinic] = { quota: 0, registered: 0 };
                }
                polyclinicSchedules[schedule.polyclinic].quota += schedule.quota || 0;
                polyclinicSchedules[schedule.polyclinic].registered += schedule.registered || 0;
            }
        });

        const totalVisits = visits.length;
        let reportHTML = '';

        Object.entries(polyclinicData).forEach(([polyclinic, count]) => {
            const percentage = totalVisits > 0 ? ((count / totalVisits) * 100).toFixed(1) : 0;
            const scheduleData = polyclinicSchedules[polyclinic] || { quota: 0, registered: 0 };
            const utilization = scheduleData.quota > 0 ? 
                ((scheduleData.registered / scheduleData.quota) * 100).toFixed(1) : 0;

            reportHTML += `
                <div class="flex justify-between items-center p-2 bg-white rounded border">
                    <div class="flex-1">
                        <span class="font-medium text-gray-800">${polyclinic}</span>
                        <div class="text-xs text-gray-500">
                            ${count} kunjungan (${percentage}%) • Utilisasi: ${utilization}%
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-sm font-bold text-blue-600">${count}</div>
                        <div class="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                            <div class="bg-blue-600 h-1.5 rounded-full" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                </div>
            `;
        });

        if (reportHTML === '') {
            reportHTML = '<p class="text-gray-500 text-center p-4">Tidak ada data kunjungan</p>';
        }

        polyclinicReport.innerHTML = reportHTML;
    }

    // Generate doctor breakdown report
    function generateDoctorReport(visits) {
        const doctorReport = document.getElementById('doctorReport');
        if (!doctorReport) return;

        // Count visits by doctor
        const doctorData = {};
        const doctorScheduleData = {};
        
        visits.forEach(visit => {
            if (visit.doctorName) {
                doctorData[visit.doctorName] = (doctorData[visit.doctorName] || 0) + 1;
            }
        });

        // Get schedule data for each doctor
        doctorSchedules.forEach(schedule => {
            if (schedule.doctorName) {
                if (!doctorScheduleData[schedule.doctorName]) {
                    doctorScheduleData[schedule.doctorName] = { 
                        quota: 0, 
                        registered: 0,
                        polyclinic: schedule.polyclinic || '-'
                    };
                }
                doctorScheduleData[schedule.doctorName].quota += schedule.quota || 0;
                doctorScheduleData[schedule.doctorName].registered += schedule.registered || 0;
            }
        });

        const totalVisits = visits.length;
        let reportHTML = '';

        Object.entries(doctorData).forEach(([doctorName, count]) => {
            const percentage = totalVisits > 0 ? ((count / totalVisits) * 100).toFixed(1) : 0;
            const scheduleData = doctorScheduleData[doctorName] || { quota: 0, registered: 0, polyclinic: '-' };
            const utilization = scheduleData.quota > 0 ? 
                ((scheduleData.registered / scheduleData.quota) * 100).toFixed(1) : 0;

            reportHTML += `
                <div class="flex justify-between items-center p-2 bg-white rounded border">
                    <div class="flex-1">
                        <span class="font-medium text-gray-800">${doctorName}</span>
                        <div class="text-xs text-gray-500">
                            ${scheduleData.polyclinic} • ${count} kunjungan (${percentage}%) • Utilisasi: ${utilization}%
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-sm font-bold text-green-600">${count}</div>
                        <div class="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                            <div class="bg-green-600 h-1.5 rounded-full" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                </div>
            `;
        });

        if (reportHTML === '') {
            reportHTML = '<p class="text-gray-500 text-center p-4">Tidak ada data kunjungan</p>';
        }

        doctorReport.innerHTML = reportHTML;
    }

    // Generate detailed visit table
    function generateVisitTable(visits) {
        const visitTableBody = document.getElementById('visitTableBody');
        if (!visitTableBody) return;

        let tableHTML = '';

        // Sort visits by date and time
        const sortedVisits = visits.sort((a, b) => {
            const dateA = new Date(a.visitDate + ' ' + (a.visitTime || '00:00'));
            const dateB = new Date(b.visitDate + ' ' + (b.visitTime || '00:00'));
            return dateB - dateA; // Most recent first
        });

        sortedVisits.forEach(visit => {
            const statusClass = visit.status === 'Selesai' ? 'status-completed' :
                               visit.status === 'Sedang Dilayani' ? 'status-in-progress' :
                               visit.status === 'Menunggu' ? 'status-waiting' : 'status-scheduled';

            tableHTML += `
                <tr class="hover:bg-gray-50">
                    <td class="px-2 md:px-4 py-2 text-xs md:text-sm">${new Date(visit.visitDate).toLocaleDateString('id-ID')}</td>
                    <td class="px-2 md:px-4 py-2 text-xs md:text-sm">${visit.visitTime || '-'}</td>
                    <td class="px-2 md:px-4 py-2 text-xs md:text-sm font-medium">${visit.patientName || '-'}</td>
                    <td class="px-2 md:px-4 py-2 text-xs md:text-sm">${visit.doctorName || '-'}</td>
                    <td class="px-2 md:px-4 py-2 text-xs md:text-sm">${visit.polyclinic || '-'}</td>
                    <td class="px-2 md:px-4 py-2">
                        <span class="status-badge ${statusClass}">${visit.status || 'Terjadwal'}</span>
                    </td>
                    <td class="px-2 md:px-4 py-2 text-xs md:text-sm text-center">${visit.queueNumber || '-'}</td>
                </tr>
            `;
        });

        if (tableHTML === '') {
            tableHTML = `
                <tr>
                    <td colspan="7" class="px-4 py-8 text-center text-gray-500">
                        Tidak ada data kunjungan untuk periode yang dipilih
                    </td>
                </tr>
            `;
        }

        visitTableBody.innerHTML = tableHTML;
    }

    // Export visit report to CSV
    window.exportVisitReport = () => {
        const reportType = document.getElementById('reportType').value;
        const selectedDate = document.getElementById('reportDate').value;
        
        if (!selectedDate) {
            alert('Silakan pilih tanggal terlebih dahulu');
            return;
        }

        const dateRange = getDateRange(reportType, selectedDate);
        const filteredVisits = filterVisitsByDateRange(dateRange.start, dateRange.end);
        
        if (filteredVisits.length === 0) {
            alert('Tidak ada data untuk diekspor');
            return;
        }

        // Create CSV content
        const headers = ['Tanggal', 'Waktu', 'Pasien', 'Dokter', 'Poliklinik', 'Status', 'No. Antrian'];
        let csvContent = headers.join(',') + '\n';
        
        filteredVisits.forEach(visit => {
            const row = [
                visit.visitDate || '',
                visit.visitTime || '',
                `"${visit.patientName || ''}"`,
                `"${visit.doctorName || ''}"`,
                `"${visit.polyclinic || ''}"`,
                `"${visit.status || 'Terjadwal'}"`,
                visit.queueNumber || ''
            ];
            csvContent += row.join(',') + '\n';
        });

        // Download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `laporan_kunjungan_${reportType}_${selectedDate}.csv`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log(`Exported ${filteredVisits.length} visit records to CSV`);
    };

    // Generate random mock data
    window.generateRandomData = () => {
        if (!confirm('Ini akan menambahkan 60+ data kunjungan acak. Lanjutkan?')) {
            return;
        }

        const indonesianNames = [
            'Siti Nurhaliza', 'Budi Santoso', 'Dewi Sartika', 'Ahmad Fauzi', 'Sri Wahyuni',
            'Muhammad Iqbal', 'Ratna Sari', 'Hendra Gunawan', 'Aisyah Putri', 'Rizky Ramadan',
            'Indira Kartika', 'Bambang Wijaya', 'Maya Sari', 'Doni Pratama', 'Sari Wulandari',
            'Andi Setiawan', 'Fitri Handayani', 'Rudi Hermawan', 'Lestari Ningrum', 'Yoga Pratama'
        ];

        const statuses = ['Selesai', 'Sedang Dilayani', 'Menunggu', 'Terjadwal'];
        const polyclinics = ['Poli Umum', 'Poli Gigi', 'Poli Anak', 'Poli Jantung', 'Poli Mata'];
        const doctorNames = ['Dr. Ahmad Yani', 'Dr. Siti Aminah', 'Dr. Budi Santoso', 'Dr. Maya Sari', 'Dr. Rizky Fauzi'];

        // Generate visits for the last 30 days
        const newVisits = [];
        const today = new Date();
        
        for (let i = 0; i < 65; i++) {
            const visitDate = new Date(today);
            visitDate.setDate(today.getDate() - Math.floor(Math.random() * 30));
            
            const visit = {
                id: Date.now() + i,
                patientId: Math.floor(Math.random() * 1000) + 1,
                patientName: indonesianNames[Math.floor(Math.random() * indonesianNames.length)],
                doctorName: doctorNames[Math.floor(Math.random() * doctorNames.length)],
                polyclinic: polyclinics[Math.floor(Math.random() * polyclinics.length)],
                visitDate: visitDate.toISOString().split('T')[0],
                visitTime: `${String(Math.floor(Math.random() * 8) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 6) * 10).padStart(2, '0')}`,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                queueNumber: Math.floor(Math.random() * 50) + 1
            };
            
            newVisits.push(visit);
        }

        // Add new visits to existing data
        patientVisits.push(...newVisits);
        
        // Update all displays
        updateStatistics();
        
        alert(`Berhasil menambahkan ${newVisits.length} data kunjungan acak!`);
        console.log(`Generated ${newVisits.length} random visit records`);
    };

    // Reset mock data to original state
    window.resetMockData = () => {
        if (!confirm('Ini akan mereset semua data ke kondisi awal. Lanjutkan?')) {
            return;
        }

        // Reload original mock data
        loadMockData().then(() => {
            updateStatistics();
            alert('Data berhasil direset ke kondisi awal!');
            console.log('Mock data reset to original state');
        });
    };

    // Auto-generate initial report on page load
    setTimeout(() => {
        if (document.getElementById('reportDate').value) {
            generateVisitReport();
        }
    }, 1000);

    // --- PATIENT MANAGEMENT FUNCTIONS ---
    
    window.viewPatientDetails = (patientId) => {
        const patient = patients.find(p => p.id === patientId);
        if (!patient) {
            alert('Data pasien tidak ditemukan');
            return;
        }

        const patientVisits = patientVisits.filter(v => v.patientId === patientId);
        const visitCount = patientVisits.length;
        const lastVisit = patientVisits.length > 0 ? 
            patientVisits.sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate))[0] : null;

        const content = `
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                        <p class="mt-1 text-sm text-gray-900">${patient.name || '-'}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">NIK</label>
                        <p class="mt-1 text-sm text-gray-900">${patient.nik || '-'}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                        <p class="mt-1 text-sm text-gray-900">${patient.gender || '-'}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
                        <p class="mt-1 text-sm text-gray-900">${patient.birthDate || '-'}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">No. Telepon</label>
                        <p class="mt-1 text-sm text-gray-900">${patient.phone || '-'}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Email</label>
                        <p class="mt-1 text-sm text-gray-900">${patient.email || '-'}</p>
                    </div>
                    <div class="col-span-2">
                        <label class="block text-sm font-medium text-gray-700">Alamat</label>
                        <p class="mt-1 text-sm text-gray-900">${patient.address || '-'}</p>
                    </div>
                </div>
                <div class="border-t pt-4">
                    <h4 class="font-medium text-gray-900 mb-2">Statistik Kunjungan</h4>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span class="text-gray-600">Total Kunjungan:</span>
                            <span class="font-medium ml-2">${visitCount}</span>
                        </div>
                        <div>
                            <span class="text-gray-600">Kunjungan Terakhir:</span>
                            <span class="font-medium ml-2">${lastVisit ? new Date(lastVisit.visitDate).toLocaleDateString('id-ID') : 'Belum ada'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        window.openAdminModal('Detail Pasien', content);
    };

    window.editPatient = (patientId) => {
        const patient = patients.find(p => p.id === patientId);
        if (!patient) {
            alert('Data pasien tidak ditemukan');
            return;
        }

        const content = `
            <form id="editPatientForm" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                        <input type="text" id="editPatientName" value="${patient.name || ''}" 
                               class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">NIK</label>
                        <input type="text" id="editPatientNik" value="${patient.nik || ''}" 
                               class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                        <select id="editPatientGender" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                            <option value="Laki-laki" ${patient.gender === 'Laki-laki' ? 'selected' : ''}>Laki-laki</option>
                            <option value="Perempuan" ${patient.gender === 'Perempuan' ? 'selected' : ''}>Perempuan</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
                        <input type="date" id="editPatientBirthDate" value="${patient.birthDate || ''}" 
                               class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">No. Telepon</label>
                        <input type="tel" id="editPatientPhone" value="${patient.phone || ''}" 
                               class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="editPatientEmail" value="${patient.email || ''}" 
                               class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                    </div>
                    <div class="col-span-2">
                        <label class="block text-sm font-medium text-gray-700">Alamat</label>
                        <textarea id="editPatientAddress" rows="3" 
                                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">${patient.address || ''}</textarea>
                    </div>
                </div>
            </form>
        `;

        const footerButtons = `
            <button onclick="savePatientEdit(${patientId})" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-2">Simpan</button>
            <button onclick="closeAdminModal()" class="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded">Batal</button>
        `;

        window.openAdminModal('Edit Pasien', content, footerButtons);
    };

    window.savePatientEdit = (patientId) => {
        const patient = patients.find(p => p.id === patientId);
        if (!patient) return;

        // Get form data
        const name = document.getElementById('editPatientName').value.trim();
        const nik = document.getElementById('editPatientNik').value.trim();
        const gender = document.getElementById('editPatientGender').value;
        const birthDate = document.getElementById('editPatientBirthDate').value;
        const phone = document.getElementById('editPatientPhone').value.trim();
        const email = document.getElementById('editPatientEmail').value.trim();
        const address = document.getElementById('editPatientAddress').value.trim();

        if (!name || !nik) {
            alert('Nama dan NIK harus diisi');
            return;
        }

        // Update patient data
        patient.name = name;
        patient.nik = nik;
        patient.gender = gender;
        patient.birthDate = birthDate;
        patient.phone = phone;
        patient.email = email;
        patient.address = address;

        // Re-render patient list
        renderPatientList();
        updateStatistics();
        
        window.closeAdminModal();
        alert('Data pasien berhasil diperbarui');
    };

    window.confirmDeletePatient = (patientId) => {
        const patient = patients.find(p => p.id === patientId);
        if (!patient) return;

        if (confirm(`Apakah Anda yakin ingin menghapus data pasien "${patient.name}"?`)) {
            // Remove patient from array
            patients = patients.filter(p => p.id !== patientId);
            
            // Remove related visits
            patientVisits = patientVisits.filter(v => v.patientId !== patientId);
            
            // Re-render lists and update stats
            renderPatientList();
            updateStatistics();
            
            alert('Data pasien berhasil dihapus');
        }
    };

    // --- DOCTOR SCHEDULE MANAGEMENT FUNCTIONS ---
    
    window.viewDoctorScheduleDetails = (scheduleId) => {
        const schedule = doctorSchedules.find(s => s.id === scheduleId);
        if (!schedule) {
            alert('Data jadwal tidak ditemukan');
            return;
        }

        const scheduleVisits = patientVisits.filter(v => 
            v.doctorName === schedule.doctorName && v.polyclinic === schedule.polyclinic
        );
        const utilization = schedule.quota > 0 ? ((schedule.registered / schedule.quota) * 100).toFixed(1) : 0;

        const content = `
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Nama Dokter</label>
                        <p class="mt-1 text-sm text-gray-900">${schedule.doctorName || '-'}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Poliklinik</label>
                        <p class="mt-1 text-sm text-gray-900">${schedule.polyclinic || '-'}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Hari</label>
                        <p class="mt-1 text-sm text-gray-900">${schedule.day || '-'}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Waktu</label>
                        <p class="mt-1 text-sm text-gray-900">${schedule.time || '-'}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Kuota</label>
                        <p class="mt-1 text-sm text-gray-900">${schedule.quota || 0}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Terdaftar</label>
                        <p class="mt-1 text-sm text-gray-900">${schedule.registered || 0}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Status</label>
                        <p class="mt-1 text-sm text-gray-900">
                            <span class="px-2 py-1 text-xs rounded-full ${schedule.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                ${schedule.isActive ? 'Aktif' : 'Non-aktif'}
                            </span>
                        </p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Utilisasi</label>
                        <p class="mt-1 text-sm text-gray-900">${utilization}%</p>
                    </div>
                </div>
                <div class="border-t pt-4">
                    <h4 class="font-medium text-gray-900 mb-2">Statistik Kunjungan</h4>
                    <div class="text-sm text-gray-600">
                        Total kunjungan terkait jadwal ini: <span class="font-medium">${scheduleVisits.length}</span>
                    </div>
                </div>
            </div>
        `;

        window.openAdminModal('Detail Jadwal Dokter', content);
    };

    window.editDoctorSchedule = (scheduleId) => {
        const schedule = doctorSchedules.find(s => s.id === scheduleId);
        if (!schedule) {
            alert('Data jadwal tidak ditemukan');
            return;
        }

        const content = `
            <form id="editScheduleForm" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Nama Dokter</label>
                        <input type="text" id="editScheduleDoctorName" value="${schedule.doctorName || ''}" 
                               class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Poliklinik</label>
                        <input type="text" id="editSchedulePolyclinic" value="${schedule.polyclinic || ''}" 
                               class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Hari</label>
                        <select id="editScheduleDay" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                            <option value="Senin" ${schedule.day === 'Senin' ? 'selected' : ''}>Senin</option>
                            <option value="Selasa" ${schedule.day === 'Selasa' ? 'selected' : ''}>Selasa</option>
                            <option value="Rabu" ${schedule.day === 'Rabu' ? 'selected' : ''}>Rabu</option>
                            <option value="Kamis" ${schedule.day === 'Kamis' ? 'selected' : ''}>Kamis</option>
                            <option value="Jumat" ${schedule.day === 'Jumat' ? 'selected' : ''}>Jumat</option>
                            <option value="Sabtu" ${schedule.day === 'Sabtu' ? 'selected' : ''}>Sabtu</option>
                            <option value="Minggu" ${schedule.day === 'Minggu' ? 'selected' : ''}>Minggu</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Waktu</label>
                        <input type="text" id="editScheduleTime" value="${schedule.time || ''}" 
                               placeholder="08:00-12:00" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Kuota</label>
                        <input type="number" id="editScheduleQuota" value="${schedule.quota || 0}" min="1" 
                               class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Terdaftar</label>
                        <input type="number" id="editScheduleRegistered" value="${schedule.registered || 0}" min="0" 
                               class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                    </div>
                    <div class="col-span-2">
                        <label class="flex items-center">
                            <input type="checkbox" id="editScheduleActive" ${schedule.isActive ? 'checked' : ''} 
                                   class="mr-2">
                            <span class="text-sm font-medium text-gray-700">Jadwal Aktif</span>
                        </label>
                    </div>
                </div>
            </form>
        `;

        const footerButtons = `
            <button onclick="saveDoctorScheduleEdit(${scheduleId})" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-2">Simpan</button>
            <button onclick="closeAdminModal()" class="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded">Batal</button>
        `;

        window.openAdminModal('Edit Jadwal Dokter', content, footerButtons);
    };

    window.saveDoctorScheduleEdit = (scheduleId) => {
        const schedule = doctorSchedules.find(s => s.id === scheduleId);
        if (!schedule) return;

        // Get form data
        const doctorName = document.getElementById('editScheduleDoctorName').value.trim();
        const polyclinic = document.getElementById('editSchedulePolyclinic').value.trim();
        const day = document.getElementById('editScheduleDay').value;
        const time = document.getElementById('editScheduleTime').value.trim();
        const quota = parseInt(document.getElementById('editScheduleQuota').value);
        const registered = parseInt(document.getElementById('editScheduleRegistered').value);
        const isActive = document.getElementById('editScheduleActive').checked;

        if (!doctorName || !polyclinic || !day || !time || quota < 1) {
            alert('Semua field harus diisi dengan benar');
            return;
        }

        if (registered > quota) {
            alert('Jumlah terdaftar tidak boleh melebihi kuota');
            return;
        }

        // Update schedule data
        schedule.doctorName = doctorName;
        schedule.polyclinic = polyclinic;
        schedule.day = day;
        schedule.time = time;
        schedule.quota = quota;
        schedule.registered = registered;
        schedule.isActive = isActive;

        // Re-render schedule list
        renderDoctorScheduleList();
        updateStatistics();
        
        window.closeAdminModal();
        alert('Jadwal dokter berhasil diperbarui');
    };

    window.confirmDeleteDoctorSchedule = (scheduleId) => {
        const schedule = doctorSchedules.find(s => s.id === scheduleId);
        if (!schedule) return;

        if (confirm(`Apakah Anda yakin ingin menghapus jadwal "${schedule.doctorName}" di ${schedule.polyclinic}?`)) {
            // Remove schedule from array
            doctorSchedules = doctorSchedules.filter(s => s.id !== scheduleId);
            
            // Re-render lists and update stats
            renderDoctorScheduleList();
            updateStatistics();
            
            alert('Jadwal dokter berhasil dihapus');
        }
    };
});