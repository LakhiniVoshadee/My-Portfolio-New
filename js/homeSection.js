// Theme Management
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = document.getElementById('theme-icon');
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
        
        this.init();
    }
    
    init() {
        // Set initial theme
        this.setTheme(this.currentTheme);
        
        // Add event listeners
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Keyboard support
        this.themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
        
        // Listen for system theme changes
        this.watchSystemTheme();
    }
    
    getStoredTheme() {
        try {
            return localStorage.getItem('portfolio-theme');
        } catch (e) {
            return null;
        }
    }
    
    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }
    
    watchSystemTheme() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!this.getStoredTheme()) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // Add rotation animation
        this.themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            this.themeToggle.style.transform = '';
        }, 300);
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        
        // Store preference
        try {
            localStorage.setItem('portfolio-theme', theme);
        } catch (e) {
            console.warn('Could not save theme preference');
        }
        
        // Update icon and tooltip
        this.updateThemeIcon(theme);
        
        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: theme }
        }));
    }
    
    updateThemeIcon(theme) {
        if (theme === 'dark') {
            this.themeIcon.className = 'fas fa-sun';
            this.themeToggle.setAttribute('title', 'Switch to Light Mode');
            this.themeToggle.setAttribute('aria-label', 'Switch to light theme');
        } else {
            this.themeIcon.className = 'fas fa-moon';
            this.themeToggle.setAttribute('title', 'Switch to Dark Mode');
            this.themeToggle.setAttribute('aria-label', 'Switch to dark theme');
        }
    }
}

// Smooth Scrolling Navigation
class SmoothNavigation {
    constructor() {
        this.init();
    }
    
    init() {
        // Handle navigation clicks
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Skip empty or placeholder links
                if (href === '#' || href === '#!') {
                    e.preventDefault();
                    return;
                }
                
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    e.preventDefault();
                    this.scrollToElement(targetElement);
                }
            });
        });
        
        // Update active nav on scroll
        this.updateActiveNavOnScroll();
    }
    
    scrollToElement(element) {
        const offsetTop = element.offsetTop - 80; // Account for fixed navbar
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
    
    updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPos = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
}

// Image Loading and Error Handling
class ImageManager {
    constructor() {
        this.init();
    }
    
    init() {
        const profileImage = document.querySelector('.profile-image');
        
        if (profileImage) {
            this.handleImageLoading(profileImage);
        }
    }
    
    handleImageLoading(img) {
        // Add loading state
        const container = img.closest('.image-container');
        container.classList.add('loading');
        
        // Handle successful load
        img.addEventListener('load', () => {
            container.classList.remove('loading');
            container.classList.add('loaded');
            this.addImageAnimation(img);
        });
        
        // Handle error
        img.addEventListener('error', () => {
            container.classList.remove('loading');
            container.classList.add('error');
            this.createFallback(container);
        });
        
        // If image is already cached and loaded
        if (img.complete && img.naturalHeight !== 0) {
            container.classList.remove('loading');
            container.classList.add('loaded');
            this.addImageAnimation(img);
        }
    }
    
    addImageAnimation(img) {
        // Add entrance animation
        img.style.animation = 'fadeIn 0.6s ease-out forwards';
    }
    
    createFallback(container) {
        // Create fallback content if image fails to load
        const fallback = document.createElement('div');
        fallback.className = 'image-fallback';
        fallback.innerHTML = `
            <div class="fallback-avatar">
                <i class="fas fa-user"></i>
            </div>
        `;
        
        // Add fallback styles
        const style = document.createElement('style');
        style.textContent = `
            .image-fallback {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, var(--social-bg), var(--border-color));
            }
            .fallback-avatar {
                font-size: 4rem;
                color: var(--text-secondary);
                opacity: 0.7;
            }
        `;
        
        if (!document.querySelector('style[data-fallback]')) {
            style.setAttribute('data-fallback', 'true');
            document.head.appendChild(style);
        }
        
        container.appendChild(fallback);
    }
}

// Social Links Manager
class SocialLinksManager {
    constructor() {
        this.socialLinks = document.querySelectorAll('.social-link');
        this.init();
    }
    
    init() {
        this.socialLinks.forEach(link => {
            this.setupSocialLink(link);
        });
    }
    
    setupSocialLink(link) {
        // Add click handling
        link.addEventListener('click', (e) => {
            const platform = this.getPlatformName(link);
            
            if (link.getAttribute('href') === '#') {
                e.preventDefault();
                this.showComingSoonMessage(platform);
                this.trackSocialClick(platform, 'placeholder');
            } else {
                this.trackSocialClick(platform, 'external');
            }
        });
        
        // Add hover effects
        this.addHoverEffects(link);
    }
    
    getPlatformName(link) {
        const icon = link.querySelector('i');
        if (!icon) return 'Unknown';
        
        const classes = icon.className;
        if (classes.includes('linkedin')) return 'LinkedIn';
        if (classes.includes('github')) return 'GitHub';
        if (classes.includes('twitter')) return 'Twitter';
        if (classes.includes('dribbble')) return 'Dribbble';
        if (classes.includes('behance')) return 'Behance';
        return 'Unknown';
    }
    
    showComingSoonMessage(platform) {
        // Create notification
        const notification = this.createNotification(`${platform} link coming soon!`);
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }
    
    createNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'social-notification';
        notification.textContent = message;
        
        // Add styles if not already added
        if (!document.querySelector('style[data-notification]')) {
            const style = document.createElement('style');
            style.setAttribute('data-notification', 'true');
            style.textContent = `
                .social-notification {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0.8);
                    background: var(--btn-primary-bg);
                    color: var(--btn-primary-text);
                    padding: 1rem 2rem;
                    border-radius: 25px;
                    z-index: 1001;
                    font-weight: 500;
                    box-shadow: 0 15px 35px var(--shadow-color);
                    opacity: 0;
                    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    pointer-events: none;
                    backdrop-filter: blur(20px);
                }
                
                .social-notification.show {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                
                .social-notification.hide {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.8);
                }
            `;
            document.head.appendChild(style);
        }
        
        return notification;
    }
    
    addHoverEffects(link) {
        const icon = link.querySelector('i');
        
        link.addEventListener('mouseenter', () => {
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
            }
        });
        
        link.addEventListener('mouseleave', () => {
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    }
    
    trackSocialClick(platform, type) {
        // Analytics placeholder
        console.log(`Social link clicked: ${platform} (${type})`);
        
        // Here you would integrate with your analytics service
        // Example: gtag('event', 'social_click', { platform, type });
    }
}

// Performance and Loading Manager
class PerformanceManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.measurePageLoad();
        this.optimizeImages();
        this.handleVisibilityChanges();
    }
    
    measurePageLoad() {
        window.addEventListener('load', () => {
            if (window.performance && window.performance.timing) {
                const loadTime = window.performance.timing.loadEventEnd - 
                               window.performance.timing.navigationStart;
                console.log(`Portfolio loaded in ${loadTime}ms`);
                
                // Track slow loads
                if (loadTime > 3000) {
                    console.warn('Slow page load detected');
                }
            }
        });
    }
    
    optimizeImages() {
        const images = document.querySelectorAll('img');
        
        // Add lazy loading if supported
        if ('loading' in HTMLImageElement.prototype) {
            images.forEach(img => {
                if (!img.hasAttribute('loading')) {
                    img.setAttribute('loading', 'lazy');
                }
            });
        }
    }
    
    handleVisibilityChanges() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Page is hidden - pause non-essential animations
                document.body.classList.add('page-hidden');
            } else {
                // Page is visible - resume animations
                document.body.classList.remove('page-hidden');
            }
        });
    }
}

// Accessibility Manager
class AccessibilityManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.addFocusManagement();
        this.addKeyboardNavigation();
        this.addAriaLabels();
        this.handleReducedMotion();
    }
    
    addFocusManagement() {
        // Enhanced focus indicators
        const focusableElements = document.querySelectorAll(
            'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        focusableElements.forEach(el => {
            el.addEventListener('focus', () => {
                el.style.outline = '3px solid var(--btn-primary-bg)';
                el.style.outlineOffset = '2px';
            });
            
            el.addEventListener('blur', () => {
                el.style.outline = '';
                el.style.outlineOffset = '';
            });
        });
    }
    
    addKeyboardNavigation() {
        // Handle Enter/Space on buttons and links
        const interactiveElements = document.querySelectorAll('.btn, .social-link, .theme-toggle-btn');
        
        interactiveElements.forEach(el => {
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    el.click();
                }
            });
        });
    }
    
    addAriaLabels() {
        // Add descriptive labels for screen readers
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            const platform = link.getAttribute('title');
            if (platform) {
                link.setAttribute('aria-label', `Visit ${platform} profile`);
            }
        });
        
        // Update theme toggle aria-label
        document.addEventListener('themeChanged', (e) => {
            const toggle = document.getElementById('theme-toggle');
            const theme = e.detail.theme;
            const nextTheme = theme === 'light' ? 'dark' : 'light';
            toggle.setAttribute('aria-label', `Switch to ${nextTheme} theme`);
        });
    }
    
    handleReducedMotion() {
        // Respect user's motion preferences
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const handleMotionPreference = (e) => {
            if (e.matches) {
                document.body.classList.add('reduced-motion');
                // Add CSS to reduce animations
                const style = document.createElement('style');
                style.textContent = `
                    .reduced-motion * {
                        animation-duration: 0.01ms !important;
                        transition-duration: 0.01ms !important;
                    }
                `;
                document.head.appendChild(style);
            } else {
                document.body.classList.remove('reduced-motion');
            }
        };
        
        // Check initial state
        handleMotionPreference(mediaQuery);
        
        // Listen for changes
        mediaQuery.addEventListener('change', handleMotionPreference);
    }
}

// Scroll Effects Manager
class ScrollEffectsManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.addNavbarScrollEffect();
        this.addParallaxEffect();
    }
    
    addNavbarScrollEffect() {
        const navbar = document.querySelector('.navbar');
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
        
        // Add scrolled navbar styles
        if (!document.querySelector('style[data-navbar-scroll]')) {
            const style = document.createElement('style');
            style.setAttribute('data-navbar-scroll', 'true');
            style.textContent = `
                .navbar {
                    transition: all 0.3s ease;
                }
                .navbar.scrolled {
                    background: var(--nav-bg);
                    box-shadow: 0 2px 20px var(--nav-shadow);
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    addParallaxEffect() {
        const imageContainer = document.querySelector('.image-container');
        
        if (imageContainer) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.3;
                
                if (scrolled < window.innerHeight) {
                    imageContainer.style.transform = `translateY(${rate}px)`;
                }
            });
        }
    }
}

// Main Application Initialization
class PortfolioApp {
    constructor() {
        this.managers = {};
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeManagers());
        } else {
            this.initializeManagers();
        }
    }
    
    initializeManagers() {
        try {
            // Initialize all managers
            this.managers.theme = new ThemeManager();
            this.managers.navigation = new SmoothNavigation();
            this.managers.image = new ImageManager();
            this.managers.social = new SocialLinksManager();
            this.managers.performance = new PerformanceManager();
            this.managers.accessibility = new AccessibilityManager();
            this.managers.scrollEffects = new ScrollEffectsManager();
            
            // Mark as loaded
            document.body.classList.add('portfolio-loaded');
            
            // Dispatch ready event
            document.dispatchEvent(new CustomEvent('portfolioReady', {
                detail: { managers: this.managers }
            }));
            
            console.log('Portfolio initialized successfully');
            
        } catch (error) {
            console.error('Error initializing portfolio:', error);
            
            // Fallback initialization
            this.initializeFallback();
        }
    }
    
    initializeFallback() {
        // Basic functionality if full initialization fails
        console.log('Running in fallback mode');
        
        // At minimum, initialize theme manager
        try {
            this.managers.theme = new ThemeManager();
        } catch (error) {
            console.error('Could not initialize theme manager:', error);
        }
    }
}

// Initialize the application
const portfolioApp = new PortfolioApp();