/* ============================================
   VASHISTA C V - ENTERPRISE PORTFOLIO
   Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== Page Loader =====
    const pageLoader = document.querySelector('.page-loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            pageLoader.classList.add('hidden');
        }, 1000);
    });
    
    // ===== Navbar Scroll Effect =====
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // ===== Active Nav Link =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-menu a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
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
    
    // ===== Smooth Scroll for Nav Links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ===== Reveal on Scroll Animation =====
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
    
    // ===== Parallax Effect for Hero =====
    const heroVisual = document.querySelector('.hero-visual');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (heroVisual && scrolled < 800) {
            heroVisual.style.transform = `translateY(${scrolled * 0.15}px)`;
        }
    });
    
    // ===== 3D Tilt Effect for Cards =====
    const tiltCards = document.querySelectorAll('.project-card, .skill-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
    
    // ===== Mobile Menu Toggle =====
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.navbar-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // ===== Counter Animation =====
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        const counterObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
        
        counterObserver.observe(counter);
    });
    
    // ===== Form Validation & Submit =====
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('.form-submit');
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Form will submit normally to formsubmit.co
            setTimeout(() => {
                submitBtn.textContent = 'Message Sent!';
                setTimeout(() => {
                    submitBtn.textContent = 'Send Message';
                    submitBtn.disabled = false;
                }, 2000);
            }, 1000);
        });
    }
    
    // ===== Cursor Glow Effect =====
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    cursorGlow.style.cssText = `
        position: fixed;
        width: 400px;
        height: 400px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(102, 126, 234, 0.08) 0%, transparent 70%);
        pointer-events: none;
        z-index: -1;
        transition: transform 0.15s ease;
    `;
    document.body.appendChild(cursorGlow);
    
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX - 200 + 'px';
        cursorGlow.style.top = e.clientY - 200 + 'px';
    });
    
});
