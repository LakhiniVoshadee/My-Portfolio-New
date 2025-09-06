// About Section JavaScript functionality
class AboutSection {
    constructor() {
        this.init();
    }

    init() {
        this.initScrollAnimations();
        this.initCounterAnimations();
        this.initSkillTagAnimations();
        this.initTimelineAnimations();
        this.initParallaxEffects();
        this.bindEvents();
    }

    // Initialize scroll-based animations
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                    
                    // Trigger counter animation for stats
                    if (entry.target.classList.contains('stat-item')) {
                        this.animateCounter(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe all elements with data-aos attribute
        document.querySelectorAll('[data-aos]').forEach(el => {
            observer.observe(el);
        });
    }

    // Animate counter numbers
    animateCounter(element) {
        const numberElement = element.querySelector('.stat-number');
        if (!numberElement || numberElement.classList.contains('animated')) return;

        const target = parseInt(numberElement.textContent);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        numberElement.classList.add('animated');

        const updateCounter = () => {
            current += step;
            if (current < target) {
                numberElement.textContent = Math.floor(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                numberElement.textContent = target + '+';
            }
        };

        updateCounter();
    }

    // Initialize skill tag hover effects
    initSkillTagAnimations() {
        const skillTags = document.querySelectorAll('.skill-tag');
        
        skillTags.forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                this.createRippleEffect(tag);
            });
        });
    }

    // Create ripple effect for interactive elements
    createRippleEffect(element) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(0);
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            animation: ripple 0.6s linear;
            pointer-events: none;
            z-index: 1;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Initialize timeline animations
    initTimelineAnimations() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('timeline-animate');
                    }, 200);
                }
            });
        }, { threshold: 0.3 });

        timelineItems.forEach(item => {
            timelineObserver.observe(item);
        });
    }

    // Initialize subtle parallax effects
    initParallaxEffects() {
        let ticking = false;

        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const decorations = document.querySelectorAll('.decoration');
            
            decorations.forEach((decoration, index) => {
                const speed = 0.5 + (index * 0.2);
                const yPos = -(scrolled * speed);
                decoration.style.transform = `translateY(${yPos}px)`;
            });

            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // Bind event listeners
    bindEvents() {
        // Download resume button
        const downloadBtn = document.querySelector('.btn-download');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', this.handleDownloadResume.bind(this));
        }

        // Get in touch button
        const contactBtn = document.querySelector('.btn-outline-secondary');
        if (contactBtn) {
            contactBtn.addEventListener('click', this.scrollToContact.bind(this));
        }

        // Add click effects to timeline cards
        const timelineCards = document.querySelectorAll('.timeline-card');
        timelineCards.forEach(card => {
            card.addEventListener('click', (e) => {
                this.createCardClickEffect(e, card);
            });
        });

        // Add hover effects to profile image
        const profileWrapper = document.querySelector('.profile-image-wrapper');
        if (profileWrapper) {
            profileWrapper.addEventListener('mouseenter', this.handleProfileHover.bind(this));
            profileWrapper.addEventListener('mouseleave', this.handleProfileLeave.bind(this));
        }
    }

    // Handle resume download
    handleDownloadResume() {
        const btn = document.querySelector('.btn-download');
        const originalText = btn.innerHTML;
        
        // Show loading state
        btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Preparing...';
        btn.disabled = true;
        btn.style.pointerEvents = 'none';
        
        // Simulate download preparation
        setTimeout(() => {
            // Reset button
            btn.innerHTML = originalText;
            btn.disabled = false;
            btn.style.pointerEvents = 'auto';
            
            // Show success notification
            this.showNotification('Resume download started!', 'success');
            
            // In a real application, trigger actual download here
            // this.triggerDownload();
        }, 2000);
    }

    // Trigger actual file download
    triggerDownload() {
        const link = document.createElement('a');
        link.href = 'assets/documents/Lakhini_Voshadee_Resume.pdf'; // Update with actual file path
        link.download = 'Lakhini_Voshadee_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Scroll to contact section
    scrollToContact() {
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            contactSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Create click effect for cards
    createCardClickEffect(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            left: ${x - 10}px;
            top: ${y - 10}px;
            background: rgba(231, 129, 143, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: cardRipple 0.8s ease-out;
            pointer-events: none;
            z-index: 10;
        `;
        
        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        card.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 800);
    }

    // Handle profile image hover
    handleProfileHover() {
        const profileImg = document.querySelector('.profile-img');
        if (profileImg) {
            profileImg.style.transform = 'scale(1.05)';
        }
    }

    // Handle profile image hover leave
    handleProfileLeave() {
        const profileImg = document.querySelector('.profile-img');
        if (profileImg) {
            profileImg.style.transform = 'scale(1)';
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 'info-circle';
        notification.innerHTML = `
            <i class="fas fa-${icon} me-2"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            transform: translateX(400px);
            transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            font-weight: 500;
            display: flex;
            align-items: center;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 4000);
    }

    // Typing effect for text elements
    typeText(element, text, speed = 50) {
        element.textContent = '';
        let i = 0;
        
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }

    // Smooth reveal animation for timeline items
    revealTimelineItems() {
        const items = document.querySelectorAll('.timeline-item');
        
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                item.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 100);
            }, index * 200);
        });
    }
}

// CSS for animations
const aboutSectionCSS = `
    @keyframes ripple {
        to {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
        }
    }
    
    @keyframes cardRipple {
        to {
            transform: scale(15);
            opacity: 0;
        }
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        font-size: 14px;
        margin-left: 12px;
        cursor: pointer;
        opacity: 0.8;
        transition: opacity 0.2s ease;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    .timeline-animate {
        animation: slideInFromLeft 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    @keyframes slideInFromLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;

// Inject CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = aboutSectionCSS;
document.head.appendChild(styleSheet);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AboutSection();
});

// Global functions for inline event handlers
window.downloadResume = function() {
    const aboutSection = new AboutSection();
    aboutSection.handleDownloadResume();
};

window.scrollToContact = function() {
    const aboutSection = new AboutSection();
    aboutSection.scrollToContact();
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AboutSection;
}