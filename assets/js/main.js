// Theme Management
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check local storage for theme preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    body.setAttribute('data-theme', currentTheme);
    updateToggleIcon(currentTheme === 'dark');
}

themeToggle?.addEventListener('click', () => {
    const isDark = body.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';

    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggleIcon(!isDark);
});

function updateToggleIcon(isDark) {
    if (themeToggle) {
        themeToggle.textContent = isDark ? '☀️' : '🌙';
    }
}

// Initial icon set
updateToggleIcon(body.getAttribute('data-theme') === 'dark');

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const sidebar = document.querySelector('.sidebar');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        // Toggle Nav Links (Public Pages)
        if (navLinks) {
            navLinks.classList.toggle('active');
        }

        // Toggle Sidebar (Dashboards)
        if (sidebar) {
            sidebar.classList.toggle('active');
        }

        // Change icon
        const isOpen = navLinks?.classList.contains('active') || sidebar?.classList.contains('active');
        mobileMenuBtn.textContent = isOpen ? '✕' : '☰';
    });
}

console.log('Main JS loaded');
