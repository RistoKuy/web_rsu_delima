// Global Application State
let appState = {
    currentUser: null,
    currentView: 'login',
    selectedUserType: 'patient' // Default to patient
};

// User Type Management
function setUserType(type) {
    appState.selectedUserType = type;
    
    // Update toggle buttons
    document.querySelectorAll('.user-type-toggle').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeToggle = document.getElementById(type + 'Toggle');
    if (activeToggle) {
        activeToggle.classList.add('active');
    }
    
    // Update login form placeholder text based on user type
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
      if (emailInput && passwordInput) {
        switch(type) {
            case 'admin':
                emailInput.placeholder = 'Masukkan email atau nama pengguna admin';
                passwordInput.placeholder = 'Masukkan kata sandi admin';
                break;
            case 'doctor':
                emailInput.placeholder = 'Masukkan email atau nama pengguna dokter';
                passwordInput.placeholder = 'Masukkan kata sandi dokter';
                break;
            default: // patient
                emailInput.placeholder = 'Masukkan email atau nama pengguna';
                passwordInput.placeholder = 'Masukkan kata sandi Anda';
        }
    }
    
    // Control signup link visibility - only show for patients
    const signupLink = document.getElementById('signupLink');
    if (signupLink) {
        if (type === 'patient') {
            signupLink.style.display = 'block';
        } else {
            signupLink.style.display = 'none';
        }
    }
}

// Mock Data - loaded from JSON file
let mockData = {
    users: [],
    patients: [],
    polyclinics: [],
    doctors: [],
    appointments: [],
    doctorSchedules: [],
    patientVisits: []
};

// Load mock data from JSON file
async function loadMockData() {
    try {
        const response = await fetch('./assets/mockData.json');
        const data = await response.json();
        mockData = { ...mockData, ...data };
        console.log('Mock data loaded successfully');
    } catch (error) {
        console.error('Error loading mock data:', error);
    }
}

// Average consultation time in minutes
const AVG_CONSULTATION_MINUTES = 15;

// Function to generate proper queue number
function generateQueueNumber(doctorId, appointmentDate, appointmentTime) {
    // Get all appointments for this doctor, date, and time slot that are not cancelled
    const existingAppointments = mockData.appointments.filter(apt =>
        apt.doctorId === doctorId &&
        apt.date === appointmentDate &&
        apt.time === appointmentTime &&
        apt.status !== 'cancelled'
    );
    
    // Generate queue number: A001, A002, etc. for first doctor, B001, B002 for second doctor, etc.
    const doctorLetter = String.fromCharCode(65 + (doctorId - 1)); // A for doctor 1, B for doctor 2, etc.
    const queueNumber = existingAppointments.length + 1;
    
    return `${doctorLetter}${String(queueNumber).padStart(3, '0')}`;
}

// Function to calculate estimated wait time
function calculateEstimatedWaitTime(doctorId, appointmentDate, appointmentTime) {
    const now = new Date();
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);

    // Only calculate for today's appointments that are in the future or very recent past (within avg consultation time)
    if (appointmentDateTime.toDateString() !== now.toDateString() || appointmentDateTime < now.setMinutes(now.getMinutes() - AVG_CONSULTATION_MINUTES)) {
        return null; // No wait time for past days or appointments too far in the past today
    }
    now.setMinutes(now.getMinutes() + AVG_CONSULTATION_MINUTES); // Reset now to current time for comparison

    const appointmentsForDoctorToday = mockData.appointments.filter(apt =>
        apt.doctorId === doctorId &&
        apt.date === appointmentDate &&
        apt.status === 'confirmed' && // Only consider confirmed appointments
        new Date(`${apt.date}T${apt.time}`) < appointmentDateTime // Appointments before the current one
    ).sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

    let patientsAhead = 0;
    for (const apt of appointmentsForDoctorToday) {
        const aptDateTime = new Date(`${apt.date}T${apt.time}`);
        // Count patients whose appointment time is before the current appointment's time
        // and are still considered "waiting" (i.e., their slot hasn't passed by more than AVG_CONSULTATION_MINUTES from now)
        if (aptDateTime < appointmentDateTime) {
             // A simple way to check if they are likely still in queue or recently finished
            const estimatedEndTimeForPatientAhead = new Date(aptDateTime.getTime() + AVG_CONSULTATION_MINUTES * 60000);
            if (estimatedEndTimeForPatientAhead > new Date()) { // If their estimated end time is still in the future from "now"
                patientsAhead++;
            }
        }
    }
    
    if (patientsAhead === 0 && appointmentDateTime <= new Date(new Date().getTime() + 5 * 60000) ) { // If it's your turn or very soon
        return "Segera giliran Anda";
    }

    const waitTimeMinutes = patientsAhead * AVG_CONSULTATION_MINUTES;
    
    if (waitTimeMinutes <= 0) {
         // If the appointment is in the future but no one is ahead (e.g., first appointment of the day)
        const timeDiff = appointmentDateTime.getTime() - new Date().getTime();
        if (timeDiff > 0) {
            const minutesToAppointment = Math.round(timeDiff / 60000);
            if (minutesToAppointment < 5) return "Segera giliran Anda";
            if (minutesToAppointment < AVG_CONSULTATION_MINUTES) return `± ${minutesToAppointment} menit (menunggu jadwal)`;
            return null; // If it's far in the future, no "wait time" yet, just scheduled time
        }
        return null; // Default for past or current slot with no one ahead
    }

    return `± ${waitTimeMinutes} menit`;
}


// Initialize Application
document.addEventListener('DOMContentLoaded', async function() {
    // Load mock data first
    await loadMockData();
    
    // Show loading screen briefly
    setTimeout(() => {
        document.getElementById('loadingView').style.display = 'none';
        
        // Initialize user type toggle
        setUserType('patient'); // Set default user type
          // Check if user is logged in (from localStorage)
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            appState.currentUser = JSON.parse(savedUser);
            showView('home');
        } else {
            showView('login');
        }
    }, 2000);
    
    // Initialize responsive navigation
    handleResponsiveNavigation();
    enhanceMobileNavigation();
});

// Navigation Functions
function showView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.add('hidden');
    });

    // Show selected view
    document.getElementById(viewName + 'View').classList.remove('hidden');
    appState.currentView = viewName;

    // Update navigation visibility and active states
    updateNavigation();

    // Load view-specific content
    switch(viewName) {
        case 'home':
            loadHomeContent();
            break;
        case 'findDoctor':
            loadPolyclinics();
            break;
        case 'myAppointments':
            loadMyAppointments();
            break;
        case 'profile':
            loadProfileContent();
            break;
    }
}

// Enhanced Navigation Functions
function showNavigation() {
    const desktopNav = document.getElementById('desktopNavbar');
    const mobileBottomNav = document.getElementById('mobileBottomNav');
    const isMobile = window.innerWidth < 768; // md breakpoint
    
    if (desktopNav && mobileBottomNav) {
        if (isMobile) {
            // Mobile view: hide desktop nav, show mobile nav
            desktopNav.classList.add('hidden');
            mobileBottomNav.classList.remove('hidden');
        } else {
            // Desktop view: show desktop nav, hide mobile nav
            desktopNav.classList.remove('hidden');
            mobileBottomNav.classList.add('hidden');
        }
        
        // Update active navigation items
        updateActiveNavItems();
    }
}

function hideNavigation() {
    const elements = ['desktopNavbar', 'mobileBottomNav'];
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.add('hidden');
        }
    });
}

function updateNavigation() {
    const authViews = ['login', 'signup'];
    if (authViews.includes(appState.currentView)) {
        hideNavigation();
    } else {
        showNavigation();
        // Ensure responsive navigation is properly set
        handleResponsiveNavigation();
    }
}

function updateActiveNavItems() {
    const currentView = appState.currentView;
    
    // Clear all active states first
    clearActiveStates();
    
    // Navigation mapping for main views
    const navMapping = {
        'home': 0,
        'findDoctor': 1,
        'myAppointments': 2,
        'profile': 3
    };
    
    if (navMapping.hasOwnProperty(currentView)) {
        const activeIndex = navMapping[currentView];
        setActiveState(activeIndex);
    }
}

function clearActiveStates() {
    // Clear desktop navigation states
    const desktopLinks = document.querySelectorAll('#desktopNavbar .nav-link');
    desktopLinks.forEach(link => {
        link.classList.remove('text-primary-600', 'border-primary-600');
        link.classList.add('text-gray-700');
    });
    
    // Clear mobile navigation states
    const mobileItems = document.querySelectorAll('#mobileBottomNav .mobile-nav-item');
    mobileItems.forEach(item => {
        item.classList.remove('text-primary-600', 'active');
        item.classList.add('text-gray-500');
    });
}

function setActiveState(index) {
    // Set active state for desktop navigation
    const desktopLinks = document.querySelectorAll('#desktopNavbar .nav-link');
    if (desktopLinks[index]) {
        desktopLinks[index].classList.remove('text-gray-700');
        desktopLinks[index].classList.add('text-primary-600');
    }
      // Set active state for mobile navigation
    const mobileItems = document.querySelectorAll('#mobileBottomNav .mobile-nav-item');
    if (mobileItems[index]) {
        mobileItems[index].classList.remove('text-gray-500');
        mobileItems[index].classList.add('text-primary-600', 'active');
    }
}

// Enhanced Mobile Menu Functions - REMOVED
// Mobile menu functions removed as menu button was removed from navigation

// Close mobile menu when clicking outside - REMOVED
// Event listener removed as mobile menu overlay no longer exists

// Authentication Functions
function handleLogin(event) {
    event.preventDefault();
    const loginIdentifier = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Prototype pass-through: Accept any credentials
    if (loginIdentifier && password) {
        // Handle different user types
        switch(appState.selectedUserType) {
            case 'admin':
                // Store admin session
                sessionStorage.setItem('userRole', 'admin');
                sessionStorage.setItem('userData', JSON.stringify({
                    loginIdentifier: loginIdentifier,
                    name: 'Admin',
                    role: 'admin'
                }));
                // Redirect to admin console
                window.location.href = 'admin/admin_index.html';
                return;
                  
            case 'doctor':
                // Store doctor session
                sessionStorage.setItem('userRole', 'dokter');
                sessionStorage.setItem('userData', JSON.stringify({
                    id: 1,
                    loginIdentifier: loginIdentifier,
                    name: 'Dr. Ahmad Subarjo',
                    specialization: 'Dokter Umum',
                    polyclinic: 'Umum',
                    role: 'dokter'
                }));
                // Redirect to doctor dashboard
                window.location.href = 'dokter/dokter_index.html';
                return;
                
            default: // patient
                // Check if user exists in mock data by email or username
                let user = mockData.users.find(u => 
                    u.email === loginIdentifier || 
                    u.username === loginIdentifier
                );
                
                if (!user) {
                    // Create a new user for prototype purposes
                    // Generate username from input if it looks like email, otherwise use as username
                    const isEmail = loginIdentifier.includes('@');
                    const username = isEmail ? loginIdentifier.split('@')[0] : loginIdentifier;
                    const email = isEmail ? loginIdentifier : `${loginIdentifier}@example.com`;
                    
                    user = {
                        id: mockData.users.length + 1,
                        name: username.charAt(0).toUpperCase() + username.slice(1), // Capitalize first letter
                        username: username,
                        email: email,
                        password: password,
                        dob: '1990-01-01',
                        address: '123 Jalan Contoh, Jakarta',
                        phone: '+62812345678',
                        gender: 'male',
                        bpjs: ''
                    };
                    mockData.users.push(user);
                }
                
                appState.currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                showView('home');
                showModal('Sukses', 'Selamat datang di RSU Delima! Anda berhasil masuk.', [
                    { text: 'OK', class: 'btn-primary', action: 'closeModal()' }
                ]);
        }
    } else {
        showModal('Login Gagal', 'Harap masukkan email/nama pengguna dan kata sandi.', [
            { text: 'OK', class: 'btn-primary', action: 'closeModal()' }
        ]);
    }
}

function handleSignup(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    // Basic validation for prototype - just check required fields
    const name = formData.get('name');
    const loginIdentifier = formData.get('email'); // This field now accepts email or username
    
    if (!name || !loginIdentifier || !password) {
        showModal('Error', 'Harap isi semua field yang diperlukan (Nama, Email/Nama Pengguna, Kata Sandi).', [
            { text: 'OK', class: 'btn-primary', action: 'closeModal()' }
        ]);
        return;
    }
    
    if (password !== confirmPassword) {
        showModal('Error', 'Kata sandi tidak cocok. Silakan coba lagi.', [
            { text: 'OK', class: 'btn-primary', action: 'closeModal()' }
        ]);
        return;
    }

    // Determine if input is email or username
    const isEmail = loginIdentifier.includes('@');
    const username = isEmail ? loginIdentifier.split('@')[0] : loginIdentifier;
    const email = isEmail ? loginIdentifier : `${loginIdentifier}@example.com`;

    // Prototype pass-through: Allow any identifier, remove existing user with same email or username
    mockData.users = mockData.users.filter(u => u.email !== email && u.username !== username);

    // Create new user with provided data or defaults
    const newUser = {
        id: mockData.users.length + 1,
        name: name,
        username: username,
        email: email,
        password: password,
        dob: formData.get('dob') || '1990-01-01',
        address: formData.get('address') || 'Alamat Contoh, Jakarta',
        phone: formData.get('phone') || '+62812345678',
        gender: formData.get('gender') || 'male',
        bpjs: formData.get('bpjs') || ''
    };

    mockData.users.push(newUser);
    appState.currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    showView('home');
    showModal('Akun Berhasil Dibuat', 'Akun Anda berhasil dibuat! Selamat datang di RSU Delima.', [
        { text: 'OK', class: 'btn-primary', action: 'closeModal()' }
    ]);
}

function logout() {
    showModal('Konfirmasi Keluar', 'Apakah Anda yakin ingin keluar?', [
        { text: 'Batal', class: 'btn-secondary', action: 'closeModal()' },
        { text: 'Keluar', class: 'btn-danger', action: 'confirmLogout()' }
    ]);
}

function confirmLogout() {
    appState.currentUser = null;
    localStorage.removeItem('currentUser');
    closeModal();
    showView('login');
}

// Home Content Functions
function loadHomeContent() {
    if (appState.currentUser) {
        document.getElementById('welcomeMessage').textContent = `Selamat datang, ${appState.currentUser.name}!`;
        
        // Load upcoming appointment
        loadUpcomingAppointment();
    }
}

function loadUpcomingAppointment() {
    const userAppointments = mockData.appointments.filter(apt => 
        apt.userId === appState.currentUser.id && 
        apt.status === 'confirmed' &&
        new Date(apt.date + ' ' + apt.time) > new Date()
    ).sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));

    const upcomingSection = document.getElementById('upcomingAppointment');
    const upcomingContent = document.getElementById('upcomingAppointmentContent');

    if (userAppointments.length > 0) {
        const nextAppointment = userAppointments[0];
        const doctor = mockData.doctors.find(d => d.id === nextAppointment.doctorId);
        const polyclinic = mockData.polyclinics.find(p => p.id === doctor.polyclinicId);
        const estimatedWaitTime = calculateEstimatedWaitTime(nextAppointment.doctorId, nextAppointment.date, nextAppointment.time);

        upcomingContent.innerHTML = `
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p class="font-medium text-gray-900">${doctor.name}</p>
                    <p class="text-sm text-gray-600">${polyclinic.name}</p>
                    <p class="text-sm text-gray-600">${formatDate(nextAppointment.date)} pukul ${nextAppointment.time}</p>
                    <p class="text-sm text-gray-600">Antrian: ${nextAppointment.queueNumber}</p>
                    ${estimatedWaitTime ? `<p class="text-sm text-blue-600">⏳ Estimasi Tunggu: ${estimatedWaitTime}</p>` : ''}
                </div>
                <div class="mt-4 sm:mt-0">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Dikonfirmasi
                    </span>
                </div>
            </div>
        `;
        upcomingSection.classList.remove('hidden');
    } else {
        upcomingSection.classList.add('hidden');
    }
}

// Find Doctor Functions
function loadPolyclinics() {
    const grid = document.getElementById('polyclinicsGrid');
    grid.innerHTML = mockData.polyclinics.map(polyclinic => `
        <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6" 
             onclick="selectPolyclinic(${polyclinic.id})">
            <div class="text-center">
                <div class="text-4xl mb-4">${polyclinic.icon}</div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">${polyclinic.name}</h3>
                <p class="text-sm text-gray-600">${polyclinic.description}</p>
            </div>
        </div>
    `).join('');
}

function filterPolyclinics() {
    const searchTerm = document.getElementById('doctorSearch').value.toLowerCase();
    const grid = document.getElementById('polyclinicsGrid');
    
    const filteredPolyclinics = mockData.polyclinics.filter(polyclinic =>
        polyclinic.name.toLowerCase().includes(searchTerm) ||
        polyclinic.description.toLowerCase().includes(searchTerm)
    );

    grid.innerHTML = filteredPolyclinics.map(polyclinic => `
        <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6" 
             onclick="selectPolyclinic(${polyclinic.id})">
            <div class="text-center">
                <div class="text-4xl mb-4">${polyclinic.icon}</div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">${polyclinic.name}</h3>
                <p class="text-sm text-gray-600">${polyclinic.description}</p>
            </div>
        </div>
    `).join('');
}

function selectPolyclinic(polyclinicId) {
    appState.selectedPolyclinic = mockData.polyclinics.find(p => p.id === polyclinicId);
    loadDoctorsList();
    showView('polyclinicDoctors');
}

function loadDoctorsList() {
    document.getElementById('polyclinicTitle').textContent = `Dokter ${appState.selectedPolyclinic.name}`;
    
    const doctors = mockData.doctors.filter(d => d.polyclinicId === appState.selectedPolyclinic.id);
    const doctorsList = document.getElementById('doctorsList');
    
    doctorsList.innerHTML = doctors.map(doctor => `
        <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex flex-col sm:flex-row sm:items-center">
                <div class="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-4 sm:mb-0 sm:mr-4">
                    <svg class="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                    </svg>
                </div>
                <div class="flex-1 text-center sm:text-left">
                    <h3 class="text-lg font-semibold text-gray-900">${doctor.name}</h3>
                    <p class="text-gray-600">${doctor.specialty}</p>
                    <p class="text-sm text-gray-500 mt-1">${doctor.bio}</p>
                </div>
                <div class="mt-4 sm:mt-0 sm:ml-4">
                    <button onclick="selectDoctor(${doctor.id})" 
                            class="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium">
                        Lihat Jadwal
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function selectDoctor(doctorId) {
    appState.selectedDoctor = mockData.doctors.find(d => d.id === doctorId);
    loadDoctorSchedule();
    showView('doctorSchedule');
}

function goBackToDoctorsList() {
    showView('polyclinicDoctors');
}

// Doctor Schedule Functions
function loadDoctorSchedule() {
    const doctor = appState.selectedDoctor;
    document.getElementById('doctorName').textContent = doctor.name;
    document.getElementById('doctorSpecialty').textContent = doctor.specialty;
    document.getElementById('doctorBio').textContent = doctor.bio;
      generateDateButtons();
    appState.selectedDate = null;
    appState.selectedTime = null;
    document.getElementById('timeSlots').innerHTML = '<p class="col-span-full text-gray-500 text-center">Silakan pilih tanggal terlebih dahulu</p>';
}

function generateDateButtons() {
    const dateButtons = document.getElementById('dateButtons');
    const today = new Date();
    const buttons = [];
    
    // Map Indonesian to English for schedule lookup
    const indoToEng = {
        minggu: 'sunday',
        senin: 'monday',
        selasa: 'tuesday',
        rabu: 'wednesday',
        kamis: 'thursday',
        jumat: 'friday',
        sabtu: 'saturday'
    };
    
    // Generate dates from tomorrow (H-30) to H-1 (30 days advance booking, stop 1 day before)
    for (let i = 1; i <= 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dayNameIndo = getDayName(date.getDay());
        const dayNameEng = indoToEng[dayNameIndo];
        
        // Check if doctor has schedule for this day (using English key)
        const hasSchedule = appState.selectedDoctor.schedule[dayNameEng];
        
        // Show only first 14 days initially, with option to load more
        if (i <= 14) {
            buttons.push(`
                <button onclick="selectDate('${formatDateForInput(date)}')"
                        class="px-4 py-2 text-sm font-medium rounded-md border ${hasSchedule ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'border-gray-200 text-gray-400 cursor-not-allowed'}"
                        ${!hasSchedule ? 'disabled' : ''}>
                    <div class="text-center">
                        <div class="font-medium text-capitalize">${dayNameIndo.charAt(0).toUpperCase() + dayNameIndo.slice(1)}</div>
                        <div class="text-xs">${formatDateDisplay(date)}</div>
                        ${hasSchedule ? getAvailabilityInfo(date, dayNameEng) : ''}
                    </div>
                </button>
            `);
        }
    }
    
    // Add "Load More Dates" button
    buttons.push(`
        <button onclick="loadMoreDates()" id="loadMoreBtn"
                class="px-4 py-2 text-sm font-medium rounded-md border border-blue-300 text-blue-700 hover:bg-blue-50">
            <div class="text-center">
                <div class="font-medium">Lihat Lebih</div>
                <div class="text-xs">16 hari kedepan</div>
            </div>
        </button>
    `);
    
    dateButtons.innerHTML = buttons.join('');
}

function getAvailabilityInfo(date, dayNameEng) {
    // Get existing appointments for this date and doctor
    const dateString = formatDateForInput(date);
    const doctorId = appState.selectedDoctor.id;
    const timeSlots = appState.selectedDoctor.schedule[dayNameEng] || [];
    
    if (timeSlots.length === 0) {
        return '<div class="text-xs text-gray-600">Tidak praktik</div>';
    }
    
    // Calculate total capacity and used slots across all time slots for this date
    let totalUsedSlots = 0;
    let totalCapacity = 0;
    
    timeSlots.forEach(timeSlot => {
        const existingAppointments = mockData.appointments.filter(apt =>
            apt.doctorId === doctorId &&
            apt.date === dateString &&
            apt.time === timeSlot &&
            apt.status !== 'cancelled'
        );
        totalUsedSlots += existingAppointments.length;
        totalCapacity += 20; // Max 20 patients per time slot
    });
    
    const availableSlots = totalCapacity - totalUsedSlots;
    const utilizationPercentage = (totalUsedSlots / totalCapacity) * 100;
    
    if (availableSlots <= 0) {
        return '<div class="text-xs text-red-600">Penuh</div>';
    } else if (utilizationPercentage >= 80) {
        return '<div class="text-xs text-orange-600">Hampir Penuh</div>';
    } else if (utilizationPercentage >= 50) {
        return '<div class="text-xs text-blue-600">Tersedia</div>';
    }
    return '<div class="text-xs text-green-600">Banyak Tersedia</div>';
}

function loadMoreDates() {
    const dateButtons = document.getElementById('dateButtons');
    const today = new Date();
    const additionalButtons = [];
    
    const indoToEng = {
        minggu: 'sunday',
        senin: 'monday',
        selasa: 'tuesday',
        rabu: 'wednesday',
        kamis: 'thursday',
        jumat: 'friday',
        sabtu: 'saturday'
    };
    
    // Generate remaining dates (15-30)
    for (let i = 15; i <= 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dayNameIndo = getDayName(date.getDay());
        const dayNameEng = indoToEng[dayNameIndo];
        
        const hasSchedule = appState.selectedDoctor.schedule[dayNameEng];
        
        additionalButtons.push(`
            <button onclick="selectDate('${formatDateForInput(date)}')"
                    class="px-4 py-2 text-sm font-medium rounded-md border ${hasSchedule ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'border-gray-200 text-gray-400 cursor-not-allowed'}"
                    ${!hasSchedule ? 'disabled' : ''}>
                <div class="text-center">
                    <div class="font-medium text-capitalize">${dayNameIndo.charAt(0).toUpperCase() + dayNameIndo.slice(1)}</div>
                    <div class="text-xs">${formatDateDisplay(date)}</div>
                    ${hasSchedule ? getAvailabilityInfo(date, dayNameEng) : ''}
                </div>
            </button>
        `);
    }
    
    // Remove load more button and add additional dates
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.remove();
    }
    
    dateButtons.insertAdjacentHTML('beforeend', additionalButtons.join(''));
}

function selectDate(dateString) {
    appState.selectedDate = dateString;
    appState.selectedTime = null;
    
    // Update date button styles
    document.querySelectorAll('#dateButtons button').forEach(btn => {
        btn.classList.remove('border-primary-500', 'text-primary-600', 'bg-primary-50');
        btn.classList.add('border-gray-300', 'text-gray-700');
    });
    
    event.target.closest('button').classList.remove('border-gray-300', 'text-gray-700');
    event.target.closest('button').classList.add('border-primary-500', 'text-primary-600', 'bg-primary-50');
    
    loadTimeSlots(dateString);
}

function loadTimeSlots(dateString) {
    const date = new Date(dateString);
    const dayNameIndo = getDayName(date.getDay());
    const indoToEng = {
        minggu: 'sunday',
        senin: 'monday',
        selasa: 'tuesday',
        rabu: 'wednesday',
        kamis: 'thursday',
        jumat: 'friday',
        sabtu: 'saturday'
    };
    const dayNameEng = indoToEng[dayNameIndo];
    const timeSlots = appState.selectedDoctor.schedule[dayNameEng] || [];
    const timeSlotsContainer = document.getElementById('timeSlots');
    if (timeSlots.length === 0) {
        timeSlotsContainer.innerHTML = '<p class="col-span-full text-gray-500 text-center">Tidak ada slot tersedia untuk tanggal ini</p>';
        return;
    }
    // Check for existing appointments
    const existingAppointments = mockData.appointments.filter(apt =>
        apt.doctorId === appState.selectedDoctor.id &&
        apt.date === dateString &&
        apt.status !== 'cancelled'
    );
    
    timeSlotsContainer.innerHTML = timeSlots.map(time => {
        const appointmentsForTimeSlot = existingAppointments.filter(apt => apt.time === time);
        const bookedCount = appointmentsForTimeSlot.length;
        const isFullyBooked = bookedCount >= 20; // Max 20 patients per schedule
        const availableSlots = Math.max(0, 20 - bookedCount);
        
        let statusClass = 'border-gray-300 text-gray-700 hover:bg-gray-50';
        let statusText = `${availableSlots} slot tersisa`;
        
        if (isFullyBooked) {
            statusClass = 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed';
            statusText = 'Penuh';
        } else if (availableSlots <= 3) {
            statusClass = 'border-orange-300 text-orange-700 hover:bg-orange-50';
            statusText = `${availableSlots} slot tersisa`;
        }
        
        return `
            <button onclick="${isFullyBooked ? '' : `selectTime('${time}')`}"
                    class="p-3 text-sm font-medium rounded-md border ${statusClass}"
                    ${isFullyBooked ? 'disabled' : ''}>
                <div class="font-medium">${time}</div>
                <div class="text-xs mt-1 ${isFullyBooked ? 'text-red-500' : availableSlots <= 3 ? 'text-orange-600' : 'text-green-600'}">${statusText}</div>
            </button>
        `;
    }).join('');
}

function selectTime(time) {
    appState.selectedTime = time;
    
    // Update time slot styles
    document.querySelectorAll('#timeSlots button').forEach(btn => {
        btn.classList.remove('border-primary-500', 'text-primary-600', 'bg-primary-50');
        btn.classList.add('border-gray-300', 'text-gray-700');
    });
    
    event.target.classList.remove('border-gray-300', 'text-gray-700');
    event.target.classList.add('border-primary-500', 'text-primary-600', 'bg-primary-50');
    
    // Show booking confirmation
    setTimeout(() => {
        showView('bookAppointment');
        loadAppointmentSummary();
    }, 500);
}

function goBackToDoctorSchedule() {
    showView('doctorSchedule');
}

// Booking Functions
function loadAppointmentSummary() {
    const doctor = appState.selectedDoctor;
    const polyclinic = appState.selectedPolyclinic;
    const estimatedWaitTime = calculateEstimatedWaitTime(doctor.id, appState.selectedDate, appState.selectedTime);

    document.getElementById('appointmentSummary').innerHTML = `
        <div class="border-l-4 border-primary-500 pl-4 space-y-1">
            <p class="font-medium text-gray-900">Dokter: ${doctor.name}</p>
            <p class="text-gray-600">Spesialisasi: ${doctor.specialty}</p>
            <p class="text-gray-600">Poliklinik: ${polyclinic.name}</p>
            <p class="text-gray-600">Tanggal: ${formatDate(appState.selectedDate)}</p>
            <p class="text-gray-600">Waktu: ${appState.selectedTime}</p>
            ${estimatedWaitTime ? `<p class="text-sm text-blue-600">⏳ Estimasi Tunggu: ${estimatedWaitTime}</p>` : ''}
        </div>
    `;
}

function confirmBooking(event) {
    event.preventDefault();
    const reason = document.getElementById('reasonForVisit').value; // Reason is now optional

    // Check capacity before booking
    const doctorId = appState.selectedDoctor.id;
    const dateString = appState.selectedDate;
    const timeSlot = appState.selectedTime;
    
    const existingAppointments = mockData.appointments.filter(apt =>
        apt.doctorId === doctorId &&
        apt.date === dateString &&
        apt.time === timeSlot &&
        apt.status !== 'cancelled'
    );
    
    // Maximum 20 patients per doctor per schedule
    if (existingAppointments.length >= 20) {
        showModal('Kapasitas Penuh', 'Maaf, kapasitas untuk jadwal ini sudah penuh (maksimal 20 pasien). Silakan pilih jadwal lain.', 
                 [{ text: 'OK', class: 'btn-primary', action: 'closeModal()' }]);
        return;
    }

    // Generate proper queue number based on appointment sequence for this doctor/date/time
    const queueNumber = generateQueueNumber(doctorId, dateString, timeSlot);

    const newAppointmentData = {
        // id will be set based on whether it's a new booking or reschedule to avoid conflicts if we were to reuse IDs
        userId: appState.currentUser.id,
        doctorId: appState.selectedDoctor.id,
        polyclinicId: appState.selectedPolyclinic.id, // Ensure this is correctly populated
        date: appState.selectedDate,
        time: appState.selectedTime,
        reason: reason, // Will be empty if user doesn't fill it
        queueNumber: queueNumber, // This will be a new queue number
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };

    if (appState.appointmentToRescheduleId) {
        const originalAppointment = mockData.appointments.find(apt => apt.id === appState.appointmentToRescheduleId);
        if (originalAppointment) {
            originalAppointment.status = 'rescheduled'; // Mark original as rescheduled
            // Optionally, link the new appointment to the old one if needed, e.g., originalAppointment.rescheduledToId = newId;
        }
        newAppointmentData.id = mockData.appointments.length + 1; // Assign new ID
        mockData.appointments.push(newAppointmentData);
        appState.appointmentToRescheduleId = null; // Clear the state

        loadBookingSuccess(newAppointmentData);
        showView('bookingSuccess');
        setTimeout(() => { // Delay modal for view transition
            showModal('Jadwal Ulang Berhasil', 'Janji temu Anda telah berhasil dijadwalkan ulang.', [{ text: 'OK', class: 'btn-primary', action: 'closeModal()' }]);
        }, 100);
    } else {
        // Handle new booking
        newAppointmentData.id = mockData.appointments.length + 1; // Assign new ID
        mockData.appointments.push(newAppointmentData);
        loadBookingSuccess(newAppointmentData);
        showView('bookingSuccess');
        // Standard success message is part of loadBookingSuccess or can be added if needed
    }
}

function loadBookingSuccess(appointment) {
    const doctor = mockData.doctors.find(d => d.id === appointment.doctorId);
    const polyclinic = mockData.polyclinics.find(p => p.id === appointment.polyclinicId);
    const estimatedWaitTime = calculateEstimatedWaitTime(appointment.doctorId, appointment.date, appointment.time);

    document.getElementById('successAppointmentDetails').innerHTML = `
        <div class="space-y-2">
            <div class="flex justify-between">
                <span class="font-medium">Dokter:</span>
                <span>${doctor.name}</span>
            </div>
            <div class="flex justify-between">
                <span class="font-medium">Poliklinik:</span>
                <span>${polyclinic.name}</span>
            </div>
            <div class="flex justify-between">
                <span class="font-medium">Tanggal:</span>
                <span>${formatDate(appointment.date)}</span>
            </div>
            <div class="flex justify-between">
                <span class="font-medium">Waktu:</span>
                <span>${appointment.time}</span>
            </div>
            <div class="flex justify-between">
                <span class="font-medium">Nomor Antrian:</span>
                <span class="font-bold text-primary-600">${appointment.queueNumber}</span>
            </div>
            ${estimatedWaitTime ? `
            <div class="flex justify-between">
                <span class="font-medium text-blue-600">⏳ Estimasi Tunggu:</span>
                <span class="text-blue-600">${estimatedWaitTime}</span>
            </div>` : ''}
            <div class="flex justify-between">
                <span class="font-medium">Alasan:</span>
                <span>${appointment.reason}</span>
            </div>
        </div>
    `;
}

// My Appointments Functions
function loadMyAppointments() {
    switchAppointmentTab('upcoming');
}

function switchAppointmentTab(tab) {
    appState.currentAppointmentTab = tab;
    
    // Update tab styles
    document.querySelectorAll('.appointment-tab').forEach(tabBtn => {
        tabBtn.classList.remove('border-primary-500', 'text-primary-600');
        tabBtn.classList.add('border-transparent', 'text-gray-500');
    });
    
    document.getElementById(tab + 'Tab').classList.remove('border-transparent', 'text-gray-500');
    document.getElementById(tab + 'Tab').classList.add('border-primary-500', 'text-primary-600');
    
    renderAppointments();
}

function renderAppointments() {
    const userAppointments = mockData.appointments.filter(apt => apt.userId === appState.currentUser.id);
    const now = new Date();
    
    let filteredAppointments;
    if (appState.currentAppointmentTab === 'upcoming') {
        filteredAppointments = userAppointments.filter(apt => {
            const appointmentDateTime = new Date(apt.date + ' ' + apt.time);
            // Show confirmed appointments that are in the future
            return apt.status === 'confirmed' && appointmentDateTime > now;
        }).sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));
    } else { // 'past' tab
        filteredAppointments = userAppointments.filter(apt => {
            const appointmentDateTime = new Date(apt.date + ' ' + apt.time);
            // Show completed, cancelled, rescheduled, or confirmed appointments that are in the past
            return apt.status === 'completed' || apt.status === 'cancelled' || apt.status === 'rescheduled' || (apt.status === 'confirmed' && appointmentDateTime <= now);
        }).sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time)); // Sort past appointments descending
    }
    
    const appointmentsList = document.getElementById('appointmentsList');
    
    if (filteredAppointments.length === 0) {
        appointmentsList.innerHTML = `
            <div class="text-center py-12">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>                <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada janji temu</h3>
                <p class="mt-1 text-sm text-gray-500">Anda tidak memiliki janji temu ${appState.currentAppointmentTab === 'upcoming' ? 'mendatang' : 'sebelumnya'} yang sesuai dengan filter ini.</p>
            </div>
        `;
        return;
    }
    
    appointmentsList.innerHTML = filteredAppointments.map(appointment => {
        const doctor = mockData.doctors.find(d => d.id === appointment.doctorId);
        const polyclinic = mockData.polyclinics.find(p => p.id === appointment.polyclinicId); // Corrected: was doctor.polyclinicId
        const estimatedWaitTime = (appointment.status === 'confirmed' && new Date(appointment.date + ' ' + appointment.time) >= now) 
                                  ? calculateEstimatedWaitTime(appointment.doctorId, appointment.date, appointment.time) 
                                  : null;
        
        let actionButtonsHTML = '';
        if (appointment.status === 'confirmed' && appState.currentAppointmentTab === 'upcoming' && new Date(appointment.date + ' ' + appointment.time) > now) {
            actionButtonsHTML = `
                <button onclick="startRescheduleAppointment(${appointment.id})"
                        class="text-blue-600 hover:text-blue-700 text-sm font-medium mr-2">
                    Jadwal Ulang
                </button>
                <button onclick="cancelAppointment(${appointment.id})" 
                        class="text-red-600 hover:text-red-700 text-sm font-medium">
                    Batalkan
                </button>`;
        }

        return `
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div class="flex-1">
                        <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                            <div class="flex-1">
                                <h3 class="text-lg font-semibold text-gray-900">${doctor.name}</h3>
                                <p class="text-gray-600">${polyclinic.name}</p>
                                <div class="mt-2 text-sm text-gray-500">
                                    <p>📅 ${formatDate(appointment.date)} pukul ${appointment.time}</p>
                                    <p>🎫 Antrian: ${appointment.queueNumber}</p>
                                    ${estimatedWaitTime ? `<p class="text-blue-600">⏳ Estimasi Tunggu: ${estimatedWaitTime}</p>` : ''}
                                    <p>📝 Alasan: ${appointment.reason || 'Tidak ada keterangan tambahan.'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 lg:mt-0 lg:ml-6 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(appointment.status)}">
                            ${getStatusText(appointment.status)}
                        </span>
                        ${actionButtonsHTML}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function getStatusBadgeClass(status) {
    switch(status) {
        case 'confirmed': return 'bg-green-100 text-green-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        case 'completed': return 'bg-blue-100 text-blue-800';
        case 'rescheduled': return 'bg-yellow-100 text-yellow-800'; // Added
        default: return 'bg-gray-100 text-gray-800';
    }
}

function getStatusText(status) {
    switch(status) {
        case 'confirmed': return 'Dikonfirmasi';
        case 'cancelled': return 'Dibatalkan';
        case 'completed': return 'Selesai';
        case 'rescheduled': return 'Dijadwalkan Ulang'; // Added
        default: return 'Tidak Diketahui';
    }
}

function cancelAppointment(appointmentId) {
    showModal('Batalkan Janji Temu', 'Apakah Anda yakin ingin membatalkan janji temu ini?', [
        { text: 'Pertahankan Janji Temu', class: 'btn-secondary', action: 'closeModal()' },
        { text: 'Batalkan Janji Temu', class: 'btn-danger', action: `confirmCancelAppointment(${appointmentId})` }
    ]);
}

function confirmCancelAppointment(appointmentId) {
    const appointment = mockData.appointments.find(apt => apt.id === appointmentId);
    if (appointment) {
        appointment.status = 'cancelled';
        closeModal();
        renderAppointments(); // Re-render to reflect the change
        setTimeout(() => { // Delay modal for view update
            showModal('Janji Temu Dibatalkan', 'Janji temu Anda berhasil dibatalkan.', [
                { text: 'OK', class: 'btn-primary', action: 'closeModal()' }
            ]);
        }, 100);
    }
}

// Add this new function for starting the reschedule process
function startRescheduleAppointment(appointmentId) {
    const appointmentToReschedule = mockData.appointments.find(apt => apt.id === appointmentId);
    if (!appointmentToReschedule) {
        showModal('Error', 'Janji temu tidak ditemukan.', [{ text: 'OK', class: 'btn-primary', action: 'closeModal()' }]);
        return;
    }

    appState.appointmentToRescheduleId = appointmentId;
    
    // Pre-select doctor and polyclinic for the schedule view
    appState.selectedDoctor = mockData.doctors.find(d => d.id === appointmentToReschedule.doctorId);
    if (!appState.selectedDoctor) {
        showModal('Error', 'Data dokter untuk janji temu ini tidak ditemukan.', [{ text: 'OK', class: 'btn-primary', action: 'closeModal()' }]);
        appState.appointmentToRescheduleId = null; // Reset state
        return;
    }
    appState.selectedPolyclinic = mockData.polyclinics.find(p => p.id === appState.selectedDoctor.polyclinicId);
     if (!appState.selectedPolyclinic) { // It's good practice to check this too
        showModal('Error', 'Data poliklinik untuk dokter ini tidak ditemukan.', [{ text: 'OK', class: 'btn-primary', action: 'closeModal()' }]);
        appState.appointmentToRescheduleId = null; // Reset state
        appState.selectedDoctor = null; // Reset state
        return;
    }

    showView('doctorSchedule'); 
    // loadDoctorSchedule() is called by showView() if 'doctorSchedule' is the case.
    
    // Inform user about rescheduling
    setTimeout(() => { // Delay modal for view transition
        showModal('Info Jadwal Ulang', 
                  `Anda sedang menjadwalkan ulang janji temu dengan ${appState.selectedDoctor.name} (semula pada ${formatDate(appointmentToReschedule.date)} pukul ${appointmentToReschedule.time}). Silakan pilih tanggal dan waktu baru.`, 
                  [{ text: 'Mengerti', class: 'btn-primary', action: 'closeModal()' }]);
    }, 100);
}

// Profile Functions
function loadProfileContent() {
    const user = appState.currentUser;
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileDetails').innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700">Nama Pengguna</label>
                <p class="mt-1 text-sm text-gray-900">${user.username || 'Tidak tersedia'}</p>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <p class="mt-1 text-sm text-gray-900">${user.email}</p>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
                <p class="mt-1 text-sm text-gray-900">${formatDate(user.dob)}</p>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Telepon</label>
                <p class="mt-1 text-sm text-gray-900">${user.phone}</p>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                <p class="mt-1 text-sm text-gray-900 capitalize">${user.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</p>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Nomor BPJS</label>
                <p class="mt-1 text-sm text-gray-900">${user.bpjs || 'Tidak tersedia'}</p>
            </div>
            <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700">Alamat</label>
                <p class="mt-1 text-sm text-gray-900">${user.address}</p>
            </div>
        </div>
    `;
}

// Modal Functions
function showModal(title, message, buttons) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').textContent = message;
    
    const modalButtons = document.getElementById('modalButtons');
    modalButtons.innerHTML = buttons.map(btn => 
        `<button onclick="${btn.action}" class="flex-1 py-2 px-4 rounded-md font-medium ${getButtonClass(btn.class)}">${btn.text}</button>`
    ).join('');
    
    document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

function getButtonClass(className) {
    switch(className) {
        case 'btn-primary': return 'bg-primary-600 hover:bg-primary-700 text-white';
        case 'btn-secondary': return 'bg-gray-300 hover:bg-gray-400 text-gray-700';
        case 'btn-danger': return 'bg-red-500 hover:bg-red-600 text-white';
        default: return 'bg-gray-300 hover:bg-gray-400 text-gray-700';
    }
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function formatDateDisplay(date) {
    return date.toLocaleDateString('id-ID', { 
        month: 'short', 
        day: 'numeric' 
    });
}

function formatDateForInput(date) {
    return date.toISOString().split('T')[0];
}

function getDayName(dayIndex) {
    // Return Indonesian day names in lowercase to match the UI and for clarity
    const days = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
    return days[dayIndex];
}

// Responsive Navigation Handler
function handleResponsiveNavigation() {
    // Handle window resize to adjust navigation visibility
    function adjustNavigationForScreenSize() {
        const desktopNav = document.getElementById('desktopNavbar');
        const mobileBottomNav = document.getElementById('mobileBottomNav');
        const isMobile = window.innerWidth < 768; // md breakpoint
        
        // Only adjust if user is authenticated (not on login/signup pages)
        const authViews = ['login', 'signup'];
        if (!authViews.includes(appState.currentView)) {
            if (isMobile) {
                // Mobile view: hide desktop nav, show mobile nav
                if (desktopNav) {
                    desktopNav.classList.add('hidden');
                }
                if (mobileBottomNav) {
                    mobileBottomNav.classList.remove('hidden');
                }            } else {
                // Desktop view: show desktop nav, hide mobile nav
                if (desktopNav) {
                    desktopNav.classList.remove('hidden');
                }
                if (mobileBottomNav) {
                    mobileBottomNav.classList.add('hidden');
                }
            }
        }
    }
    
    // Add window resize listener
    window.addEventListener('resize', adjustNavigationForScreenSize);
    
    // Run initial check
    adjustNavigationForScreenSize();
}

// Enhanced mobile navigation feedback
function enhanceMobileNavigation() {
    const mobileItems = document.querySelectorAll('#mobileBottomNav .mobile-nav-item');
    
    mobileItems.forEach((item, index) => {
        // Add touch start feedback
        item.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        }, { passive: true });
        
        // Reset on touch end
        item.addEventListener('touchend', function() {
            setTimeout(() => {
                if (!this.classList.contains('active')) {
                    this.style.transform = '';
                }
            }, 150);
        }, { passive: true });
        
        // Reset on touch cancel
        item.addEventListener('touchcancel', function() {
            this.style.transform = '';
        }, { passive: true });
    });
}