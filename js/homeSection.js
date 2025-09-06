// Theme Management
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = document.getElementById('theme-icon');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }
    
    init() {
        // Set initial theme
        this.setTheme(this.currentTheme);
        
        // Add event listener for theme toggle
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Add keyboard support for theme toggle
        this.themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
        
        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // Add a subtle animation to the toggle button
        this.themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            this.themeToggle.style.transform = '';
        }, 300);
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update icon
        if (theme === 'dark') {
            this.themeIcon.className = 'fas fa-sun';
            this.themeToggle.setAttribute('title', 'Switch to Light Mode');
        } else {
            this.themeIcon.className = 'fas fa-moon';
            this.themeToggle.setAttribute('title', 'Switch to Dark Mode');
        }
        
        // Trigger custom event for theme change
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: theme }
        }));
    }
}

// Smooth Scrolling for Anchor Links
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        // Get all anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Skip if it's just a hash or placeholder
                if (href === '#' || href === '#!') {
                    e.preventDefault();
                    return;
                }
                
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update URL without triggering scroll
                    history.pushState(null, null, href);
                }
            });
        });
    }
}

// Animation Observer for Enhanced Animations
class AnimationObserver {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }
    
    init() {
        // Create intersection observer
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                } else {
                    entry.target.classList.remove('animate-in');
                }
            });
        }, this.observerOptions);
        
        // Observe animated elements
        const animatedElements = document.querySelectorAll('.home-content > *, .image-container');
        animatedElements.forEach(el => {
            this.observer.observe(el);
        });
    }
}

// Social Links Handler
class SocialLinksManager {
    constructor() {
        this.socialLinks = document.querySelectorAll('.social-link');
        this.init();
    }
    
    init() {
        this.socialLinks.forEach(link => {
            // Add click analytics (placeholder)
            link.addEventListener('click', (e) => {
                const platform = this.getPlatformFromIcon(link);
                this.trackSocialClick(platform);
                
                // If it's a placeholder link (#), prevent navigation
                if (link.getAttribute('href') === '#') {
                    e.preventDefault();
                    this.showPlaceholderMessage(platform);
                }
            });
            
            // Add hover effects
            link.addEventListener('mouseenter', () => {
                this.addHoverEffect(link);
            });
            
            link.addEventListener('mouseleave', () => {
                this.removeHoverEffect(link);
            });
        });
    }
    
    getPlatformFromIcon(link) {
        const iconClasses = link.querySelector('i').className;
        if (iconClasses.includes('linkedin')) return 'LinkedIn';
        if (iconClasses.includes('github')) return 'GitHub';
        if (iconClasses.includes('twitter')) return 'Twitter';
        if (iconClasses.includes('dribbble')) return 'Dribbble';
        if (iconClasses.includes('behance')) return 'Behance';
        return 'Unknown';
    }
    
    trackSocialClick(platform) {
        console.log(`Social link clicked: ${platform}`);
        // Here you would typically send analytics data
        // Example: gtag('event', 'social_click', { platform: platform });
    }
    
    showPlaceholderMessage(platform) {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.className = 'social-notification';
        notification.textContent = `${platform} link coming soon!`;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--btn-primary-bg);
            color: var(--btn-primary-text);
            padding: 1rem 2rem;
            border-radius: 25px;
            z-index: 1001;
            font-weight: 500;
            box-shadow: 0 10px 30px var(--shadow-color);
            animation: fadeInUp 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 2 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }
    
    addHoverEffect(link) {
        const icon = link.querySelector('i');
        icon.style.transform = 'scale(1.2)';
    }
    
    removeHoverEffect(link) {
        const icon = link.querySelector('i');
        icon.style.transform = 'scale(1)';
    }
}

// Performance Observer for Monitoring
class PerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        // Monitor loading performance
        window.addEventListener('load', () => {
            if (window.performance && window.performance.timing) {
                const loadTime = window.performance.timing.loadEventEnd - 
                               window.performance.timing.navigationStart;
                console.log(`Page loaded in ${loadTime}ms`);
            }
        });
        
        // Monitor theme changes performance
        document.addEventListener('themeChanged', (e) => {
            const start = performance.now();
            requestAnimationFrame(() => {
                const end = performance.now();
                console.log(`Theme change took ${(end - start).toFixed(2)}ms`);
            });
        });
    }
}

// Accessibility Enhancements
class AccessibilityManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Add focus management
        this.addFocusManagement();
        
        // Add keyboard navigation
        this.addKeyboardNavigation();
        
        // Add screen reader enhancements
        this.addScreenReaderSupport();
    }
    
    addFocusManagement() {
        // Enhanced focus indicators
        const focusableElements = document.querySelectorAll(
            'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        focusableElements.forEach(el => {
            el.addEventListener('focus', () => {
                el.style.outline = '2px solid var(--btn-primary-bg)';
                el.style.outlineOffset = '2px';
            });
            
            el.addEventListener('blur', () => {
                el.style.outline = '';
                el.style.outlineOffset = '';
            });
        });
    }
    
    addKeyboardNavigation() {
        // Handle Enter key on buttons
        const buttons = document.querySelectorAll('.btn, .social-link');
        buttons.forEach(btn => {
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.target.click();
                }
            });
        });
    }
    
    addScreenReaderSupport() {
        // Add dynamic aria-labels based on theme
        document.addEventListener('themeChanged', (e) => {
            const themeToggle = document.getElementById('theme-toggle');
            const currentTheme = e.detail.theme;
            const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            themeToggle.setAttribute('aria-label', 
                `Current theme is ${currentTheme}. Click to switch to ${nextTheme} theme`
            );
        });
        
        // Initial aria-label
        const themeToggle = document.getElementById('theme-toggle');
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
        themeToggle.setAttribute('aria-label', 
            `Current theme is ${currentTheme}. Click to switch to ${nextTheme} theme`
        );
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    const themeManager = new ThemeManager();
    const smoothScroll = new SmoothScroll();
    const animationObserver = new AnimationObserver();
    const socialLinksManager = new SocialLinksManager();
    const performanceMonitor = new PerformanceMonitor();
    const accessibilityManager = new AccessibilityManager();
    
    // Add a loading complete class to body
    document.body.classList.add('loaded');
    
    console.log('Portfolio initialized successfully');
});