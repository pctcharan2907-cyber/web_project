// =========================
// Common Utility Functions
// =========================

// Initialize demo data if first time
function initDemoData() {
  if (localStorage.getItem('demoInitialized')) return;

  // Demo resources
  const demoResources = [
    { id: 1, title: '🧘 Managing Exam Stress', content: 'Practical techniques for staying calm during exams. Deep breathing, time management, and self-care strategies.' },
    { id: 2, title: '😴 Better Sleep Habits', content: 'Guide to improving sleep quality for better mental health. Establish routines, limit screen time, create a calm environment.' },
    { id: 3, title: '🤝 Building Social Connections', content: 'Tips for making friends and building support networks in college. Join clubs, attend events, be yourself.' },
    { id: 4, title: '💪 Exercise for Mental Health', content: 'How physical activity improves mood and reduces anxiety. Even 20 minutes daily can make a difference.' }
  ];

  // Demo sessions
  const demoSessions = [
    { id: 1, topic: 'Stress Management Workshop', date: '2025-11-15', time: '2:00 PM' },
    { id: 2, topic: 'One-on-One Counseling', date: '2025-11-18', time: '10:00 AM' },
    { id: 3, topic: 'Group Therapy Session', date: '2025-11-20', time: '4:00 PM' }
  ];

  // Demo announcements
  const demoUpdates = [
    { id: 1, message: 'Welcome to the Mental Health Support Platform! We\'re here to help you thrive.', date: '2025-11-01' },
    { id: 2, message: 'New wellness workshop series starting next week. Check the sessions tab!', date: '2025-11-05' }
  ];

  // Demo forum messages
  const demoMessages = [
    { id: 1, author: 'Sarah M.', text: 'Just wanted to say this platform has been so helpful for me. Thank you! 💚', date: '2025-11-04' },
    { id: 2, author: 'Alex K.', text: 'Anyone else dealing with pre-exam anxiety? Looking for study buddies!', date: '2025-11-05' }
  ];

  saveData('resources', demoResources);
  saveData('sessions', demoSessions);
  saveData('updates', demoUpdates);
  saveData('messages', demoMessages);
  localStorage.setItem('demoInitialized', 'true');
}

// Save data to localStorage
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Get data from localStorage
function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

// =========================
// Theme (Light / Dark) Toggle
// =========================
function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark-theme');
  } else {
    document.documentElement.classList.remove('dark-theme');
  }
  localStorage.setItem('theme', theme);
  // sync admin settings select if present
  const sel = document.getElementById('themeSelect');
  if (sel) sel.value = theme === 'dark' ? 'Dark Mode' : 'Light Mode';
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark-theme');
  applyTheme(isDark ? 'light' : 'dark');
}

// create floating toggle button and wire it up
document.addEventListener('DOMContentLoaded', () => {
  // Initialize demo data on first load
  initDemoData();

  const existing = document.getElementById('themeToggleBtn');
  if (!existing) {
    const btn = document.createElement('button');
    btn.id = 'themeToggleBtn';
    btn.className = 'theme-toggle';
    btn.title = 'Toggle light / dark theme';
    btn.setAttribute('aria-pressed', 'false');
    btn.innerHTML = '🌓';
    btn.addEventListener('click', () => {
      toggleTheme();
      btn.setAttribute('aria-pressed', document.documentElement.classList.contains('dark-theme'));
    });
    document.body.appendChild(btn);
  }

  // apply saved theme
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') applyTheme('dark');
  else applyTheme('light');

  // sync admin theme select change to theme
  const adminSelect = document.getElementById('themeSelect');
  if (adminSelect) {
    adminSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      applyTheme(val && val.toLowerCase().includes('dark') ? 'dark' : 'light');
    });
  }
});

// =========================
// ADMIN LOGIN
// =========================
const adminLoginForm = document.getElementById("adminLoginForm");
if (adminLoginForm) {
  adminLoginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("adminEmail").value;
    const password = document.getElementById("adminPassword").value;

    // Default admin credentials
    if (email === "g.ramesh120807@gmail.com" && password === "123") {
      window.location.href = "admin.html";
    } else {
      document.getElementById("adminLoginMsg").innerText =
        "Invalid admin credentials!";
    }
  });
}

// =========================
// STUDENT SIGNUP
// =========================
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("studentName").value;
    const email = document.getElementById("studentSignupEmail").value;
    const password = document.getElementById("studentSignupPassword").value;
    const confirm = document.getElementById("confirmPassword").value;

    if (password !== confirm) {
      document.getElementById("signupMsg").innerText = "Passwords do not match!";
      return;
    }

    const students = getData("students");
    const exists = students.find((s) => s.email === email);

    if (exists) {
      document.getElementById("signupMsg").innerText =
        "Account already exists. Please log in.";
      return;
    }

    students.push({ name, email, password });
    saveData("students", students);

    document.getElementById("signupMsg").innerText =
      "Account created! Redirecting to login...";
    setTimeout(() => (window.location.href = "student-login.html"), 1500);
  });
}

// =========================
// STUDENT LOGIN
// =========================
const studentLoginForm = document.getElementById("studentLoginForm");
if (studentLoginForm) {
  studentLoginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("studentEmail").value;
    const password = document.getElementById("studentPassword").value;

    const students = getData("students");
    const user = students.find(
      (s) => s.email === email && s.password === password
    );

    if (user) {
      localStorage.setItem("currentStudent", JSON.stringify(user));
      window.location.href = "student.html";
    } else {
      document.getElementById("studentLoginMsg").innerText =
        "Invalid email or password!";
    }
  });
}

// =========================
// ADMIN DASHBOARD LOGIC
// =========================
const resourceForm = document.getElementById("resourceForm");
const sessionForm = document.getElementById("sessionForm");
const updateForm = document.getElementById("updateForm");

// Handle resource adding
if (resourceForm) {
  resourceForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("resourceTitle").value;
    const desc = document.getElementById("resourceContent").value;

    const resources = getData("resources");
    resources.push({ title, desc });
    saveData("resources", resources);

    document.getElementById("resourceTitle").value = "";
    document.getElementById("resourceContent").value = "";
    loadAdminResources();
  });
}

// Handle session adding
if (sessionForm) {
  sessionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const topic = document.getElementById("sessionTopic").value;
    const date = document.getElementById("sessionDate").value;

    const sessions = getData("sessions");
    sessions.push({ topic, date });
    saveData("sessions", sessions);

    document.getElementById("sessionTopic").value = "";
    document.getElementById("sessionDate").value = "";
    loadAdminSessions();
  });
}

// Handle support update posting
if (updateForm) {
  updateForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = document.getElementById("updateMessage").value;
    const updates = getData("updates");
    updates.push({ message });
    saveData("updates", updates);

    document.getElementById("updateMessage").value = "";
    loadAdminUpdates();
  });
}

// Load Admin Resources
function loadAdminResources() {
  const list = document.getElementById("resourceList");
  if (list) {
    list.innerHTML = "";
    const resources = getData("resources");
    resources.forEach((r) => {
      const li = document.createElement("li");
      li.textContent = ${r.title}: ${r.desc};
      list.appendChild(li);
    });
  }
}

// Load Admin Sessions
function loadAdminSessions() {
  const list = document.getElementById("sessionList");
  if (list) {
    list.innerHTML = "";
    const sessions = getData("sessions");
    sessions.forEach((s) => {
      const li = document.createElement("li");
      li.textContent = ${s.topic} — ${s.date};
      list.appendChild(li);
    });
  }
}

// Load Admin Updates
function loadAdminUpdates() {
  const list = document.getElementById("updateList");
  if (list) {
    list.innerHTML = "";
    const updates = getData("updates");
    updates.forEach((u) => {
      const li = document.createElement("li");
      li.textContent = u.message;
      list.appendChild(li);
    });
  }
}

loadAdminResources();
loadAdminSessions();
loadAdminUpdates();

// =========================
// STUDENT DASHBOARD LOGIC
// =========================
function loadStudentResources() {
  const list = document.getElementById("studentResourceList");
  if (list) {
    list.innerHTML = "";
    const resources = getData("resources");
    if (resources.length === 0) {
      list.innerHTML = "<li>No resources yet.</li>";
    } else {
      resources.forEach((r) => {
        const li = document.createElement("li");
        li.textContent = ${r.title}: ${r.desc};l
        list.appendChild(li);
      });
    }
  }
}
// =========================
// ADMIN DASHBOARD LOGIC
// =========================
const resourceForm = document.getElementById("resourceForm");
const sessionForm = document.getElementById("sessionForm");
const updateForm = document.getElementById("updateForm");

// Handle resource adding
if (resourceForm) {
  resourceForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("resourceTitle").value;
    const desc = document.getElementById("resourceContent").value;

    const resources = getData("resources");
    resources.push({ title, desc });
    saveData("resources", resources);

    document.getElementById("resourceTitle").value = "";
    document.getElementById("resourceContent").value = "";
    loadAdminResources();
   loadAdminResources();
  });
}

// Handle session adding
if (sessionForm) {
  sessionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const topic = document.getElementById("sessionTopic").value;
    const date = document.getElementById("sessionDate").value;
  const sessions = getData("sessions");
    sessions.push({ topic, date });
    saveData("sessions", sessions);

    document.getElementById("sessionTopic").value = "";
    document.getElementById("sessionDate").value = "";
    loadAdminSessions();
  });
}
