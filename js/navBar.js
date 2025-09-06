// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light'; // Default to light for better initial accessibility
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = this.themeToggle?.querySelector('.theme-icon');
        
        this.init();
    }
    
    init() {
        if (this.themeToggle && this.themeIcon) {
            this.setTheme(this.theme);
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.theme = theme;
        
        // Update icon
        if (this.themeIcon) {
            this.themeIcon.className = `fas fa-${theme === 'dark' ? 'sun' : 'moon'} theme-icon`;
        }
    }
    
    toggleTheme() {
        if (!this.themeIcon) return;
        const newTheme = this.theme === 'dark' ? 'light' : 'dark';
        
        // Add rotation animation
        this.themeIcon.style.transform = 'rotate(180deg)';
        
        setTimeout(() => {
            this.setTheme(newTheme);
            this.themeIcon.style.transform = 'rotate(0deg)';
        }, 150);
    }
}

// Navigation Manager
class NavigationManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navPills = document.querySelectorAll('.nav-pill');
        this.mobileNavPills = document.querySelectorAll('.mobile-nav-pill');
        this.sections = document.querySelectorAll('section[id]');
        this.navbarCollapse = document.querySelector('.navbar-collapse');
        
        this.init();
    }
    
    init() {
        this.handleScroll();
        this.handleNavigation();
        
        // Throttle scroll events for performance
        window.addEventListener('scroll', this.throttle(() => this.handleScroll(), 100));
    }
    
    handleScroll() {
        // Navbar scroll effect
        if (this.navbar) {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        }
        
        // Active section highlighting
        this.updateActiveSection();
    }
    
    updateActiveSection() {
        let current = '';
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 200) && window.scrollY < (sectionTop + sectionHeight - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        // Update desktop nav pills
        this.navPills.forEach(pill => {
            pill.classList.remove('active');
            pill.removeAttribute('aria-current');
            if (pill.getAttribute('href') === `#${current}`) {
                pill.classList.add('active');
                pill.setAttribute('aria-current', 'page');
            }
        });
        
        // Update mobile nav pills
        this.mobileNavPills.forEach(pill => {
            pill.classList.remove('active');
            pill.removeAttribute('aria-current');
            if (pill.getAttribute('href') === `#${current}`) {
                pill.classList.add('active');
                pill.setAttribute('aria-current', 'page');
            }
        });
    }
    
    handleNavigation() {
        // Desktop navigation
        this.navPills.forEach(pill => {
            pill.addEventListener('click', (e) => this.handleNavClick(e, pill));
        });
        
        // Mobile navigation
        this.mobileNavPills.forEach(pill => {
            pill.addEventListener('click', (e) => this.handleNavClick(e, pill));
        });
    }
    
    handleNavClick(e, pill) {
        e.preventDefault();
        
        const targetId = pill.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            // Smooth scroll
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update active state
            document.querySelectorAll('.nav-pill, .mobile-nav-pill').forEach(p => {
                p.classList.remove('active');
                p.removeAttribute('aria-current');
            });
            pill.classList.add('active');
            pill.setAttribute('aria-current', 'page');
        }
    }
    
    // Throttle function for performance
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// Pill Animation Manager
class PillAnimationManager {
    constructor() {
        this.navPills = document.querySelector('.nav-pills');
        this.pills = document.querySelectorAll('.nav-pill');
        
        if (this.navPills) {
            this.init();
        }
    }
    
    init() {
        this.pills.forEach(pill => {
            pill.addEventListener('mouseenter', () => this.onPillHover(pill));
            pill.addEventListener('mouseleave', () => this.onPillLeave(pill));
        });
    }
    
    onPillHover(pill) {
        pill.style.boxShadow = '0 0 20px rgba(128, 128, 128, 0.3)';
    }
    
    onPillLeave(pill) {
        if (!pill.classList.contains('active')) {
            pill.style.boxShadow = '';
        }
    }
}

// Intersection Observer for animations
class AnimationObserver {
    constructor() {
        this.options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries), 
            this.options
        );
        
        this.init();
    }
    
    init() {
        document.querySelectorAll('.demo-section').forEach(section => {
            this.observer.observe(section);
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new NavigationManager();
    new PillAnimationManager();
    new AnimationObserver();
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Handle resize events
window.addEventListener('resize', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        navbar.style.transition = 'none';
        setTimeout(() => {
            navbar.style.transition = 'all 0.3s ease';
        }, 100);
    }
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse?.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    }
});