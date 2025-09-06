// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'dark';
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = this.themeToggle.querySelector('.theme-icon');
        
        this.init();
    }
    
    init() {
        this.setTheme(this.theme);
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.theme = theme;
        
        // Update icon
        if (theme === 'dark') {
            this.themeIcon.className = 'fas fa-sun theme-icon';
        } else {
            this.themeIcon.className = 'fas fa-moon theme-icon';
        }
    }
    
    toggleTheme() {
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
        
        this.init();
    }
    
    init() {
        this.handleScroll();
        this.handleNavigation();
        this.handleMobileMenu();
        
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    handleScroll() {
        // Navbar scroll effect
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
        
        // Active section highlighting
        this.updateActiveSection();
    }
    
    updateActiveSection() {
        let current = '';
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        // Update desktop nav pills
        this.navPills.forEach(pill => {
            pill.classList.remove('active');
            if (pill.getAttribute('href') === '#' + current) {
                pill.classList.add('active');
            }
        });
        
        // Update mobile nav pills
        this.mobileNavPills.forEach(pill => {
            pill.classList.remove('active');
            if (pill.getAttribute('href') === '#' + current) {
                pill.classList.add('active');
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
            
            // Update active state immediately
            document.querySelectorAll('.nav-pill, .mobile-nav-pill').forEach(p => {
                p.classList.remove('active');
            });
            pill.classList.add('active');
            
            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        }
    }
    
    handleMobileMenu() {
        // Auto-close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            const navbarToggler = document.querySelector('.navbar-toggler');
            
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                if (!navbarCollapse.contains(e.target) && !navbarToggler.contains(e.target)) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            }
        });
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
        // Add subtle glow effect
        pill.style.boxShadow = '0 0 20px rgba(128, 128, 128, 0.3)';
    }
    
    onPillLeave(pill) {
        // Remove glow effect if not active
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
        // Observe demo sections for fade-in animations
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

// Performance optimization
class PerformanceOptimizer {
    constructor() {
        this.ticking = false;
    }
    
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
    
    debounce(func, delay) {
        let timeoutId;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(context, args), delay);
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize managers
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
    // Recalculate positions if needed
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
        // Close mobile menu
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    }
});

// Add subtle parallax effect to navbar
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const navbar = document.getElementById('navbar');
    
    if (navbar && scrolled < 500) {
        navbar.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
});