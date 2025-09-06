// ==================== ABOUT SECTION FUNCTIONALITY ====================

document.addEventListener('DOMContentLoaded', function() {
    initializeAboutSection();
});

function initializeAboutSection() {
    // Initialize number counters
    initCounterAnimations();

    // Initialize scroll animations
    initAboutScrollAnimations();

    // Initialize tech item animations
    initTechAnimations();

    // Initialize intersection observers
    initAboutObservers();

    // Initialize theme handling
    initAboutThemeHandling();

    // Initialize resume download tracking
    initResumeDownload();
}

// ==================== COUNTER ANIMATIONS ====================
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-count'));
        let current = 0;
        const increment = target / 50; // Animation duration control
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 50);
    };

    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// ==================== SCROLL ANIMATIONS ====================
function initAboutScrollAnimations() {
    // Parallax effect for background shapes
    const handleScroll = () => {
        const scrolled = window.pageYOffset;
        const aboutSection = document.querySelector('.about-section');

        if (!aboutSection) return;

        const sectionTop = aboutSection.offsetTop;
        const sectionHeight = aboutSection.offsetHeight;
        const windowHeight = window.innerHeight;

        // Only animate when section is in view
        if (scrolled + windowHeight > sectionTop && scrolled < sectionTop + sectionHeight) {
            const shapes = document.querySelectorAll('.about-shape');
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.2;
                const yPos = (scrolled - sectionTop) * speed;
                shape.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.05}deg)`;
            });
        }
    };

    // Throttled scroll handler
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ==================== TECH ANIMATIONS ====================
function initTechAnimations() {
    const techItems = document.querySelectorAll('.tech-item');

    // Add staggered animation delays
    techItems.forEach((item, index) => {
        item.style.animationDelay = `${(index * 0.1) + 1.4}s`;
    });

    // Enhanced hover effects
    techItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });

        // Add ripple effect on click
        item.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: radial-gradient(circle, rgba(102, 126, 234, 0.3), transparent);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                z-index: 1;
            `;

            this.style.position = 'relative';
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ==================== INTERSECTION OBSERVERS ====================
function initAboutObservers() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                // Special handling for tech categories
                if (entry.target.classList.contains('tech-category')) {
                    const techItems = entry.target.querySelectorAll('.tech-item');
                    techItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe main elements
    const elementsToObserve = [
        '.about-intro',
        '.tech-category',
        '.resume-section'
    ];

    elementsToObserve.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => observer.observe(element));
    });

    // Initially hide tech items for staggered animation
    const techItems = document.querySelectorAll('.tech-item');
    techItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
}

// ==================== THEME HANDLING ====================
function initAboutThemeHandling() {
    const updateAboutTheme = () => {
        const isDark = document.body.classList.contains('theme-dark');
        const aboutSection = document.querySelector('.about-section');

        if (aboutSection) {
            if (isDark) {
                aboutSection.setAttribute('data-theme', 'dark');
            } else {
                aboutSection.removeAttribute('data-theme');
            }
        }
    };

    // Initial theme setup
    updateAboutTheme();

    // Observe theme changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                updateAboutTheme();
            }
        });
    });

    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });
}

// ==================== RESUME DOWNLOAD ====================
function initResumeDownload() {
    const resumeBtn = document.querySelector('.resume-btn');

    if (resumeBtn) {
        resumeBtn.addEventListener('click', function(e) {
            // Add download animation
            this.style.transform = 'scale(0.95)';

            setTimeout(() => {
                this.style.transform = 'translateY(-3px)';
            }, 150);

            // Track download event (you can integrate with analytics)
            console.log('Resume download initiated');

            // Add success notification (optional)
            showDownloadNotification();
        });
    }
}

function showDownloadNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--gradient-primary);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = 'Resume download started!';

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ==================== TECH CATEGORY FILTERING ====================
function initTechFiltering() {
    // This can be extended to add filtering functionality
    const categories = document.querySelectorAll('.tech-category');

    categories.forEach(category => {
        const header = category.querySelector('.category-header');

        header.addEventListener('click', function() {
            // Toggle expanded state
            category.classList.toggle('expanded');

            // Animate the toggle
            const techGrid = category.querySelector('.tech-grid');
            if (category.classList.contains('expanded')) {
                techGrid.style.maxHeight = techGrid.scrollHeight + 'px';
            } else {
                techGrid.style.maxHeight = '200px'; // Default height
            }
        });
    });
}

// ==================== UTILITY FUNCTIONS ====================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Handle resize events
window.addEventListener('resize', debounce(() => {
    // Recalculate animations on resize if needed
    const techItems = document.querySelectorAll('.tech-item');
    techItems.forEach(item => {
        item.style.transform = 'translateY(0) scale(1)';
    });
}, 250));

// ==================== EXPORT FOR TESTING ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeAboutSection,
        initCounterAnimations,
        initTechAnimations,
        debounce,
        isInViewport
    };
}