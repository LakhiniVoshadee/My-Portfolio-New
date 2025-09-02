function toggleTheme() {
    const body = document.body;
    const icons = [document.getElementById('themeIcon'), document.getElementById('themeIconDesktop')];

    if (body.classList.contains('theme-light')) {
        body.classList.replace('theme-light', 'theme-dark');
        icons.forEach(icon => icon && (icon.textContent = '☀️'));
    } else {
        body.classList.replace('theme-dark', 'theme-light');
        icons.forEach(icon => icon && (icon.textContent = '🌙'));
    }
}

// Active link on click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});