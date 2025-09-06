// Initialize AOS animation library
document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS animation library
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  });

  // Project card hover effect enhancement
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.querySelector('.project-overlay').style.opacity = '1';
    });
    
    card.addEventListener('mouseleave', function() {
      // Only fade out if not on mobile (where we keep it visible)
      if (window.innerWidth > 575) {
        this.querySelector('.project-overlay').style.opacity = '0';
      }
    });
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // Detect when projects section enters viewport for additional animations
  const projectsSection = document.querySelector('#projects');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add staggered animation to each project card
        const cards = document.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add('animated');
          }, 100 * index);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  if (projectsSection) {
    observer.observe(projectsSection);
  }
});