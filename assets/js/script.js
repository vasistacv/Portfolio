/* ============================================
   VASHISTA C V - GOD MODE GAMING PORTFOLIO
   Main JavaScript Engine v3.0
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

    // ===== PAGE LOADER WITH PERCENTAGE =====
    const pageLoader = document.querySelector('.page-loader');
    const loaderProgress = document.querySelector('.loader-progress');
    const loaderPercentage = document.querySelector('.loader-percentage');
    let progress = 0;

    const loadInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadInterval);
            setTimeout(() => {
                if (pageLoader) pageLoader.classList.add('hidden');
            }, 400);
        }
        if (loaderProgress) loaderProgress.style.width = progress + '%';
        if (loaderPercentage) loaderPercentage.textContent = Math.floor(progress) + '%';
    }, 150);

    window.addEventListener('load', () => {
        setTimeout(() => {
            progress = 100;
            if (loaderProgress) loaderProgress.style.width = '100%';
            if (loaderPercentage) loaderPercentage.textContent = '100%';
            setTimeout(() => {
                if (pageLoader) pageLoader.classList.add('hidden');
            }, 500);
        }, 800);
    });

    // ===== CUSTOM CURSOR =====
    const cursorFollower = document.querySelector('.cursor-follower');
    const cursorDot = document.querySelector('.cursor-dot');

    if (cursorFollower && cursorDot && window.innerWidth > 768) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        function animateCursor() {
            followerX += (mouseX - followerX) * 0.12;
            followerY += (mouseY - followerY) * 0.12;
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effect on interactive elements
        const hoverElements = document.querySelectorAll('a, button, .btn, .exp-card, .showcase-card, .tool-chip, .achievement-card, .social-link');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorFollower.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorFollower.classList.remove('hover'));
        });

        document.addEventListener('mousedown', () => cursorDot.classList.add('click'));
        document.addEventListener('mouseup', () => cursorDot.classList.remove('click'));
    }

    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.querySelector('.navbar');
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScrollY = scrollY;
    });

    // ===== MOBILE MENU =====
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('mobile-open');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('mobile-open');
            });
        });
    }

    // ===== ACTIVE NAV LINK =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-menu a');

    function setActiveLink() {
        const scrollPos = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(l => l.classList.remove('active'));
                const activeLink = document.querySelector(`.navbar-menu a[href="#${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', setActiveLink);

    // ===== TYPING ANIMATION =====
    const typingText = document.getElementById('typingText');
    const phrases = [
        'AI/ML Engineer & Researcher',
        'ISRO-NRSC Alumni',
        'Deep Learning Specialist',
        'Cybersecurity Expert',
        'Full Stack Developer',
        'Published Author',
        'Space Technology Enthusiast'
    ];

    if (typingText) {
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 60;

        function typeText() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                typingText.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 30;
            } else {
                typingText.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 60;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                typingSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 300;
            }

            setTimeout(typeText, typingSpeed);
        }
        setTimeout(typeText, 1500);
    }

    // ===== SCROLL REVEAL =====
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // ===== ANIMATED STAT COUNTERS =====
    const statValues = document.querySelectorAll('.stat-value[data-target]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                let current = 0;
                const increment = target / 40;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    entry.target.textContent = Math.floor(current);
                }, 40);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statValues.forEach(el => counterObserver.observe(el));

    // ===== SKILL BAR ANIMATION =====
    const skillBars = document.querySelectorAll('.skill-bar-fill');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const width = fill.style.getPropertyValue('--width');
                fill.style.width = width;
                fill.style.transition = 'width 1.5s cubic-bezier(0.23, 1, 0.32, 1)';
                skillObserver.unobserve(fill);
            }
        });
    }, { threshold: 0.3 });

    skillBars.forEach(bar => {
        bar.style.width = '0%';
        skillObserver.observe(bar);
    });

    // ===== PARTICLE CANVAS =====
    const particleCanvas = document.getElementById('particleCanvas');
    if (particleCanvas) {
        const ctx = particleCanvas.getContext('2d');
        let particles = [];
        const particleCount = window.innerWidth > 768 ? 60 : 25;

        function resizeCanvas() {
            particleCanvas.width = window.innerWidth;
            particleCanvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * particleCanvas.width;
                this.y = Math.random() * particleCanvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.4 + 0.1;
                this.hue = Math.random() > 0.5 ? 185 : 260;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > particleCanvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > particleCanvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.strokeStyle = `hsla(185, 100%, 60%, ${0.08 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            connectParticles();
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // ===== MATRIX RAIN CANVAS =====
    const matrixCanvas = document.getElementById('matrixCanvas');
    if (matrixCanvas && window.innerWidth > 768) {
        const mctx = matrixCanvas.getContext('2d');
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;

        const chars = '01アイウエオカキクケコVASHISTA';
        const fontSize = 14;
        const columns = Math.floor(matrixCanvas.width / fontSize);
        const drops = Array(columns).fill(1);

        function drawMatrix() {
            mctx.fillStyle = 'rgba(7, 8, 15, 0.05)';
            mctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
            mctx.fillStyle = '#00f0ff';
            mctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                mctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        setInterval(drawMatrix, 80);

        window.addEventListener('resize', () => {
            matrixCanvas.width = window.innerWidth;
            matrixCanvas.height = window.innerHeight;
        });
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===== TILT EFFECT ON CARDS =====
    if (window.innerWidth > 768) {
        const tiltCards = document.querySelectorAll('.exp-card, .showcase-card, .project-hero');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    console.log('%c🎮 GOD MODE PORTFOLIO v3.0 LOADED', 'color: #00f0ff; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #00f0ff;');
});
