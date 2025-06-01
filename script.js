// Mock Data
let mockData = {
    users: [
        {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            password: "password123",
            dob: "1990-01-15",
            address: "123 Main Street, Jakarta",
            phone: "+62812345678",
            gender: "male",
            bpjs: "0001234567890"
        }
    ],
    polyclinics: [
        {
            id: 1,
            name: "General Medicine",
            description: "Primary healthcare services for common medical conditions",
            icon: "🩺"
        },
        {
            id: 2,
            name: "Cardiology",
            description: "Heart and cardiovascular system specialists",
            icon: "❤️"
        },
        {
            id: 3,
            name: "Pediatrics",
            description: "Medical care for infants, children, and adolescents",
            icon: "👶"
        },
        {
            id: 4,
            name: "Orthopedics",
            description: "Bone, joint, and musculoskeletal system care",
            icon: "🦴"
        },
        {
            id: 5,
            name: "Dermatology",
            description: "Skin, hair, and nail condition treatments",
            icon: "🧴"
        },
        {
            id: 6,
            name: "Ophthalmology",
            description: "Eye and vision care specialists",
            icon: "👁️"
        }
    ],
    doctors: [
        {
            id: 1,
            name: "Dr. Sarah Johnson",
            specialty: "General Practitioner",
            polyclinicId: 1,
            bio: "Experienced general practitioner with 10+ years in family medicine.",
            schedule: {
                monday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
                tuesday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
                wednesday: ["09:00", "10:00", "11:00"],
                thursday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
                friday: ["09:00", "10:00", "11:00", "14:00", "15:00"]
            }
        },
        {
            id: 2,
            name: "Dr. Michael Chen",
            specialty: "Cardiologist",
            polyclinicId: 2,
            bio: "Board-certified cardiologist specializing in heart disease prevention and treatment.",
            schedule: {
                monday: ["10:00", "11:00", "14:00", "15:00", "16:00"],
                wednesday: ["10:00", "11:00", "14:00", "15:00"],
                friday: ["10:00", "11:00", "14:00", "15:00", "16:00"]
            }
        },
        {
            id: 3,
            name: "Dr. Emily Rodriguez",
            specialty: "Pediatrician",
            polyclinicId: 3,
            bio: "Dedicated pediatrician with expertise in child development and pediatric care.",
            schedule: {
                tuesday: ["09:00", "10:00", "11:00", "14:00"],
                thursday: ["09:00", "10:00", "11:00", "14:00"],
                saturday: ["09:00", "10:00", "11:00"]
            }
        },
        {
            id: 4,
            name: "Dr. Robert Wilson",
            specialty: "Orthopedic Surgeon",
            polyclinicId: 4,
            bio: "Experienced orthopedic surgeon specializing in joint replacement and sports medicine.",
            schedule: {
                monday: ["08:00", "09:00", "10:00", "14:00"],
                wednesday: ["08:00", "09:00", "10:00", "14:00"],
                friday: ["08:00", "09:00", "10:00"]
            }
        },
        {
            id: 5,
            name: "Dr. Lisa Thompson",
            specialty: "Dermatologist",
            polyclinicId: 5,
            bio: "Dermatologist with expertise in skin cancer detection and cosmetic procedures.",
            schedule: {
                tuesday: ["10:00", "11:00", "14:00", "15:00"],
                thursday: ["10:00", "11:00", "14:00", "15:00"],
                saturday: ["10:00", "11:00"]
            }
        },
        {
            id: 6,
            name: "Dr. David Kim",
            specialty: "Ophthalmologist",
            polyclinicId: 6,
            bio: "Eye specialist with advanced training in retinal diseases and cataract surgery.",
            schedule: {
                monday: ["09:00", "10:00", "11:00", "15:00"],
                wednesday: ["09:00", "10:00", "11:00", "15:00"],
                friday: ["09:00", "10:00", "11:00"]
            }
        }
    ],
    appointments: []
};

// Application State
let appState = {
    currentUser: null,
    currentView: 'login',
    selectedPolyclinic: null,
    selectedDoctor: null,
    selectedDate: null,
    selectedTime: null,
    currentAppointmentTab: 'upcoming'
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    // Show loading screen briefly
    setTimeout(() => {
        document.getElementById('loadingView').style.display = 'none';
        
        // Check if user is logged in (from localStorage)
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            appState.currentUser = JSON.parse(savedUser);
            showView('home');
            showNavigation();
        } else {
            showView('login');
        }
    }, 2000);
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
    
    if (desktopNav && mobileBottomNav) {
        // Desktop navigation (hidden on mobile)
        desktopNav.classList.remove('hidden');
        
        // Mobile bottom navigation (hidden on desktop)
        mobileBottomNav.classList.remove('hidden');
        
        // Update active navigation items
        updateActiveNavItems();
    }
}

function hideNavigation() {
    const elements = ['desktopNavbar', 'mobileBottomNav', 'mobileMenuOverlay'];
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
    
    // Set active state for mobile navigation (excluding menu button)
    const mobileItems = document.querySelectorAll('#mobileBottomNav .mobile-nav-item');
    if (mobileItems[index]) {
        mobileItems[index].classList.remove('text-gray-500');
        mobileItems[index].classList.add('text-primary-600', 'active');
    }
}

// Enhanced Mobile Menu Functions
function showMobileMenu() {
    const overlay = document.getElementById('mobileMenuOverlay');
    if (overlay) {
        overlay.classList.remove('hidden');
        // Add smooth animation
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
        });
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = 'hidden';
    }
}

function hideMobileMenu() {
    const overlay = document.getElementById('mobileMenuOverlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.classList.add('hidden');
            // Restore body scroll
            document.body.style.overflow = '';
        }, 300);
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const overlay = document.getElementById('mobileMenuOverlay');
    const menuButton = event.target.closest('[onclick*="showMobileMenu"]');
    
    if (overlay && !overlay.classList.contains('hidden') && 
        !event.target.closest('#mobileMenuOverlay > div') && 
        !menuButton) {
        hideMobileMenu();
    }
});

// Authentication Functions
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Prototype pass-through: Accept any credentials
    if (email && password) {
        // Check if user exists in mock data, if not create a simple user
        let user = mockData.users.find(u => u.email === email);
        
        if (!user) {
            // Create a new user for prototype purposes
            user = {
                id: mockData.users.length + 1,
                name: email.split('@')[0] || 'User', // Use email prefix as name
                email: email,
                password: password,
                dob: '1990-01-01',
                address: '123 Sample Street, Jakarta',
                phone: '+62812345678',
                gender: 'male',
                bpjs: ''
            };
            mockData.users.push(user);
        }
          appState.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        showView('home');
        showModal('Success', 'Welcome to RSU Delima! You have been successfully logged in.', [
            { text: 'OK', class: 'btn-primary', action: 'closeModal()' }
        ]);
    } else {
        showModal('Login Failed', 'Please enter both email and password.', [
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
    const email = formData.get('email');
    
    if (!name || !email || !password) {
        showModal('Error', 'Please fill in all required fields (Name, Email, Password).', [
            { text: 'OK', class: 'btn-primary', action: 'closeModal()' }
        ]);
        return;
    }
    
    if (password !== confirmPassword) {
        showModal('Error', 'Passwords do not match. Please try again.', [
            { text: 'OK', class: 'btn-primary', action: 'closeModal()' }
        ]);
        return;
    }

    // Prototype pass-through: Allow any email, even if it exists
    // Remove existing user with same email first
    mockData.users = mockData.users.filter(u => u.email !== email);

    // Create new user with provided data or defaults
    const newUser = {
        id: mockData.users.length + 1,
        name: name,
        email: email,
        password: password,
        dob: formData.get('dob') || '1990-01-01',
        address: formData.get('address') || 'Sample Address, Jakarta',
        phone: formData.get('phone') || '+62812345678',
        gender: formData.get('gender') || 'male',
        bpjs: formData.get('bpjs') || ''
    };

    mockData.users.push(newUser);
    appState.currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    showView('home');
    showModal('Account Created', 'Your account has been successfully created! Welcome to RSU Delima.', [
        { text: 'OK', class: 'btn-primary', action: 'closeModal()' }
    ]);
}

function logout() {
    showModal('Confirm Logout', 'Are you sure you want to logout?', [
        { text: 'Cancel', class: 'btn-secondary', action: 'closeModal()' },
        { text: 'Logout', class: 'btn-danger', action: 'confirmLogout()' }
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
        document.getElementById('welcomeMessage').textContent = `Welcome, ${appState.currentUser.name}!`;
        
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

        upcomingContent.innerHTML = `
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p class="font-medium text-gray-900">${doctor.name}</p>
                    <p class="text-sm text-gray-600">${polyclinic.name}</p>
                    <p class="text-sm text-gray-600">${formatDate(nextAppointment.date)} at ${nextAppointment.time}</p>
                    <p class="text-sm text-gray-600">Queue: ${nextAppointment.queueNumber}</p>
                </div>
                <div class="mt-4 sm:mt-0">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Confirmed
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
    document.getElementById('polyclinicTitle').textContent = `${appState.selectedPolyclinic.name} Doctors`;
    
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
                        View Schedule
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
    document.getElementById('timeSlots').innerHTML = '<p class="col-span-full text-gray-500 text-center">Please select a date first</p>';
}

function generateDateButtons() {
    const dateButtons = document.getElementById('dateButtons');
    const today = new Date();
    const buttons = [];
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dayName = getDayName(date.getDay());
        
        // Check if doctor has schedule for this day
        const hasSchedule = appState.selectedDoctor.schedule[dayName.toLowerCase()];
        
        buttons.push(`
            <button onclick="selectDate('${formatDateForInput(date)}')" 
                    class="px-4 py-2 text-sm font-medium rounded-md border ${hasSchedule ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'border-gray-200 text-gray-400 cursor-not-allowed'}"
                    ${!hasSchedule ? 'disabled' : ''}>
                <div class="text-center">
                    <div class="font-medium">${dayName}</div>
                    <div class="text-xs">${formatDateDisplay(date)}</div>
                </div>
            </button>
        `);
    }
    
    dateButtons.innerHTML = buttons.join('');
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
    const dayName = getDayName(date.getDay()).toLowerCase();
    const timeSlots = appState.selectedDoctor.schedule[dayName] || [];
    
    const timeSlotsContainer = document.getElementById('timeSlots');
    
    if (timeSlots.length === 0) {
        timeSlotsContainer.innerHTML = '<p class="col-span-full text-gray-500 text-center">No available slots for this date</p>';
        return;
    }
    
    // Check for existing appointments
    const existingAppointments = mockData.appointments.filter(apt => 
        apt.doctorId === appState.selectedDoctor.id && 
        apt.date === dateString &&
        apt.status !== 'cancelled'
    );
    
    timeSlotsContainer.innerHTML = timeSlots.map(time => {
        const isBooked = existingAppointments.some(apt => apt.time === time);
        return `
            <button onclick="${isBooked ? '' : `selectTime('${time}')`}" 
                    class="p-2 text-sm font-medium rounded-md border ${isBooked ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}"
                    ${isBooked ? 'disabled' : ''}>
                ${time}
                ${isBooked ? '<div class="text-xs text-red-500">Booked</div>' : ''}
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
    
    document.getElementById('appointmentSummary').innerHTML = `
        <div class="border-l-4 border-primary-500 pl-4">
            <p class="font-medium text-gray-900">Doctor: ${doctor.name}</p>
            <p class="text-gray-600">Specialty: ${doctor.specialty}</p>
            <p class="text-gray-600">Polyclinic: ${polyclinic.name}</p>
            <p class="text-gray-600">Date: ${formatDate(appState.selectedDate)}</p>
            <p class="text-gray-600">Time: ${appState.selectedTime}</p>
        </div>
    `;
}

function confirmBooking(event) {
    event.preventDefault();
    const reason = document.getElementById('reasonForVisit').value;
    
    if (!reason.trim()) {
        showModal('Error', 'Please provide a reason for your visit.', [
            { text: 'OK', class: 'btn-primary', action: 'closeModal()' }
        ]);
        return;
    }
    
    // Generate queue number
    const queueNumber = `Q${String(mockData.appointments.length + 1).padStart(3, '0')}`;
    
    // Create appointment
    const appointment = {
        id: mockData.appointments.length + 1,
        userId: appState.currentUser.id,
        doctorId: appState.selectedDoctor.id,
        polyclinicId: appState.selectedPolyclinic.id,
        date: appState.selectedDate,
        time: appState.selectedTime,
        reason: reason,
        queueNumber: queueNumber,
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };
    
    mockData.appointments.push(appointment);
    
    // Show success view
    loadBookingSuccess(appointment);
    showView('bookingSuccess');
}

function loadBookingSuccess(appointment) {
    const doctor = mockData.doctors.find(d => d.id === appointment.doctorId);
    const polyclinic = mockData.polyclinics.find(p => p.id === appointment.polyclinicId);
    
    document.getElementById('successAppointmentDetails').innerHTML = `
        <div class="space-y-2">
            <div class="flex justify-between">
                <span class="font-medium">Doctor:</span>
                <span>${doctor.name}</span>
            </div>
            <div class="flex justify-between">
                <span class="font-medium">Polyclinic:</span>
                <span>${polyclinic.name}</span>
            </div>
            <div class="flex justify-between">
                <span class="font-medium">Date:</span>
                <span>${formatDate(appointment.date)}</span>
            </div>
            <div class="flex justify-between">
                <span class="font-medium">Time:</span>
                <span>${appointment.time}</span>
            </div>
            <div class="flex justify-between">
                <span class="font-medium">Queue Number:</span>
                <span class="font-bold text-primary-600">${appointment.queueNumber}</span>
            </div>
            <div class="flex justify-between">
                <span class="font-medium">Reason:</span>
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
        filteredAppointments = userAppointments.filter(apt => 
            new Date(apt.date + ' ' + apt.time) > now || apt.status === 'confirmed'
        );
    } else {
        filteredAppointments = userAppointments.filter(apt => 
            new Date(apt.date + ' ' + apt.time) <= now || apt.status === 'completed'
        );
    }
    
    const appointmentsList = document.getElementById('appointmentsList');
    
    if (filteredAppointments.length === 0) {
        appointmentsList.innerHTML = `
            <div class="text-center py-12">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
                <p class="mt-1 text-sm text-gray-500">You don't have any ${appState.currentAppointmentTab} appointments.</p>
            </div>
        `;
        return;
    }
    
    appointmentsList.innerHTML = filteredAppointments.map(appointment => {
        const doctor = mockData.doctors.find(d => d.id === appointment.doctorId);
        const polyclinic = mockData.polyclinics.find(p => p.id === appointment.polyclinicId);
        
        return `
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div class="flex-1">
                        <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                            <div class="flex-1">
                                <h3 class="text-lg font-semibold text-gray-900">${doctor.name}</h3>
                                <p class="text-gray-600">${polyclinic.name}</p>
                                <div class="mt-2 text-sm text-gray-500">
                                    <p>📅 ${formatDate(appointment.date)} at ${appointment.time}</p>
                                    <p>🎫 Queue: ${appointment.queueNumber}</p>
                                    <p>📝 ${appointment.reason}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 lg:mt-0 lg:ml-6 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(appointment.status)}">
                            ${getStatusText(appointment.status)}
                        </span>
                        ${appointment.status === 'confirmed' && appState.currentAppointmentTab === 'upcoming' ? 
                            `<button onclick="cancelAppointment(${appointment.id})" 
                                     class="text-red-600 hover:text-red-700 text-sm font-medium">
                                Cancel
                             </button>` : ''}
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
        default: return 'bg-gray-100 text-gray-800';
    }
}

function getStatusText(status) {
    switch(status) {
        case 'confirmed': return 'Confirmed';
        case 'cancelled': return 'Cancelled';
        case 'completed': return 'Completed';
        default: return 'Unknown';
    }
}

function cancelAppointment(appointmentId) {
    showModal('Cancel Appointment', 'Are you sure you want to cancel this appointment?', [
        { text: 'Keep Appointment', class: 'btn-secondary', action: 'closeModal()' },
        { text: 'Cancel Appointment', class: 'btn-danger', action: `confirmCancelAppointment(${appointmentId})` }
    ]);
}

function confirmCancelAppointment(appointmentId) {
    const appointment = mockData.appointments.find(apt => apt.id === appointmentId);
    if (appointment) {
        appointment.status = 'cancelled';
        closeModal();
        renderAppointments();
        showModal('Appointment Cancelled', 'Your appointment has been successfully cancelled.', [
            { text: 'OK', class: 'btn-primary', action: 'closeModal()' }
        ]);
    }
}

// Profile Functions
function loadProfileContent() {
    const user = appState.currentUser;
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileEmail').textContent = user.email;
    
    document.getElementById('profileDetails').innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700">Date of Birth</label>
                <p class="mt-1 text-sm text-gray-900">${formatDate(user.dob)}</p>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Phone</label>
                <p class="mt-1 text-sm text-gray-900">${user.phone}</p>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Gender</label>
                <p class="mt-1 text-sm text-gray-900 capitalize">${user.gender}</p>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">BPJS Number</label>
                <p class="mt-1 text-sm text-gray-900">${user.bpjs || 'Not provided'}</p>
            </div>
            <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700">Address</label>
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
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function formatDateDisplay(date) {
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
    });
}

function formatDateForInput(date) {
    return date.toISOString().split('T')[0];
}

function getDayName(dayIndex) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
}