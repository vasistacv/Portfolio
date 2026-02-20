/* ============================================
   VASHISTA C V - ULTIMATE VFX GAMING PORTFOLIO
   Next-Gen Visual Effects Engine v5.0
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
    const isMobile = window.innerWidth <= 768;

    // ===== PAGE LOADER WITH CINEMATIC BOOT =====
    const pageLoader = document.querySelector('.page-loader');
    const loaderProgress = document.querySelector('.loader-progress');
    const loaderPercentage = document.querySelector('.loader-percentage');
    let progress = 0;

    const loadInterval = setInterval(() => {
        progress += Math.random() * 12 + 3;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadInterval);
            setTimeout(() => {
                if (pageLoader) {
                    pageLoader.classList.add('hidden');
                    // Trigger entrance animations after loader
                    document.body.classList.add('loaded');
                }
            }, 600);
        }
        if (loaderProgress) loaderProgress.style.width = progress + '%';
        if (loaderPercentage) loaderPercentage.textContent = Math.floor(progress) + '%';
    }, 120);

    window.addEventListener('load', () => {
        setTimeout(() => {
            progress = 100;
            if (loaderProgress) loaderProgress.style.width = '100%';
            if (loaderPercentage) loaderPercentage.textContent = '100%';
            setTimeout(() => {
                if (pageLoader) {
                    pageLoader.classList.add('hidden');
                    document.body.classList.add('loaded');
                }
            }, 600);
        }, 800);
    });

    // ===== MOUSE TRACKING SYSTEM =====
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let prevMouseX = mouseX;
    let prevMouseY = mouseY;
    let mouseSpeed = 0;

    document.addEventListener('mousemove', (e) => {
        prevMouseX = mouseX;
        prevMouseY = mouseY;
        mouseX = e.clientX;
        mouseY = e.clientY;
        const dx = mouseX - prevMouseX;
        const dy = mouseY - prevMouseY;
        mouseSpeed = Math.sqrt(dx * dx + dy * dy);
    });

    // ===== CUSTOM GAMING CURSOR WITH TRAIL =====
    const cursorFollower = document.querySelector('.cursor-follower');
    const cursorDot = document.querySelector('.cursor-dot');

    if (cursorFollower && cursorDot && !isMobile) {
        let followerX = mouseX, followerY = mouseY;

        function animateCursor() {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';

            // Scale cursor based on speed
            const scale = Math.min(1 + mouseSpeed * 0.008, 1.8);
            cursorFollower.style.transform = `translate(-50%, -50%) scale(${scale})`;

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effects on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, .btn, .exp-card, .showcase-card, .tool-chip, .achievement-card, .social-link, .navbar-menu a, .navbar-cta');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorFollower.classList.add('hover');
                cursorDot.style.transform = 'translate(-50%, -50%) scale(2)';
            });
            el.addEventListener('mouseleave', () => {
                cursorFollower.classList.remove('hover');
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });

        document.addEventListener('mousedown', () => {
            cursorDot.classList.add('click');
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(0.7)';
            spawnClickExplosion(mouseX, mouseY);
        });
        document.addEventListener('mouseup', () => {
            cursorDot.classList.remove('click');
        });
    }

    // ===== NAVBAR =====
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
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

    // ===== ACTIVE NAV TRACKING =====
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
        let phraseIndex = 0, charIndex = 0, isDeleting = false, typingSpeed = 60;
        function typeText() {
            const currentPhrase = phrases[phraseIndex];
            if (isDeleting) {
                typingText.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 25;
            } else {
                typingText.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 55;
            }
            if (!isDeleting && charIndex === currentPhrase.length) {
                typingSpeed = 2200;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 400;
            }
            setTimeout(typeText, typingSpeed);
        }
        setTimeout(typeText, 1500);
    }

    // ===== SCROLL REVEAL =====
    const revealElements = document.querySelectorAll('.reveal, .section-header, .exp-card, .showcase-card, .skill-category, .achievement-card, .contact-card');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(35px)';
        el.style.transition = 'opacity 0.7s cubic-bezier(0.23, 1, 0.32, 1), transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)';
        revealObserver.observe(el);
    });

    // ===== ANIMATED COUNTERS =====
    const statValues = document.querySelectorAll('.stat-value[data-target]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) { current = target; clearInterval(timer); }
                    entry.target.textContent = Math.floor(current);
                }, 30);
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
                fill.style.transition = 'width 1.8s cubic-bezier(0.23, 1, 0.32, 1)';
                skillObserver.unobserve(fill);
            }
        });
    }, { threshold: 0.3 });
    skillBars.forEach(bar => { bar.style.width = '0%'; skillObserver.observe(bar); });

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ===== 3D TILT ON CARDS =====
    if (!isMobile) {
        const tiltCards = document.querySelectorAll('.exp-card, .showcase-card, .project-hero, .achievement-card');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                const rotateX = (y - 0.5) * 12;
                const rotateY = (0.5 - x) * 12;
                card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale(1.02)`;
                // Dynamic light reflection
                card.style.background = `radial-gradient(600px circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(0,240,255,0.06), transparent 40%)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.background = '';
            });
        });
    }

    // =============================================
    //  âš¡ ULTIMATE VFX ENGINE - MULTI-LAYER CANVAS
    // =============================================

    const particleCanvas = document.getElementById('particleCanvas');
    const matrixCanvas = document.getElementById('matrixCanvas');

    if (particleCanvas) {
        const ctx = particleCanvas.getContext('2d');
        let W, H;

        function resizeVFX() {
            W = particleCanvas.width = window.innerWidth;
            H = particleCanvas.height = window.innerHeight;
        }
        resizeVFX();
        window.addEventListener('resize', resizeVFX);

        // ---- CONFIG ----
        const PARTICLE_COUNT = isMobile ? 30 : 80;
        const FIREFLY_COUNT = isMobile ? 15 : 40;
        const AURORA_WAVES = isMobile ? 3 : 6;
        const NEBULA_BLOBS = isMobile ? 2 : 4;

        // ---- AURORA / NORTHERN LIGHTS ----
        class AuroraWave {
            constructor(i) {
                this.baseY = H * (0.15 + Math.random() * 0.5);
                this.amplitude = 30 + Math.random() * 60;
                this.wavelength = 300 + Math.random() * 400;
                this.speed = 0.0003 + Math.random() * 0.0005;
                this.phase = Math.random() * Math.PI * 2;
                this.hue = [260, 290, 330, 45, 200, 180][i % 6];
                this.thickness = 80 + Math.random() * 120;
                this.opacity = 0.015 + Math.random() * 0.025;
            }
            draw(t) {
                ctx.beginPath();
                for (let x = 0; x <= W; x += 3) {
                    const y = this.baseY +
                        Math.sin((x / this.wavelength) + t * this.speed * 1000 + this.phase) * this.amplitude +
                        Math.sin((x / (this.wavelength * 0.5)) + t * this.speed * 500) * (this.amplitude * 0.4);
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.lineTo(W, H);
                ctx.lineTo(0, H);
                ctx.closePath();

                const grad = ctx.createLinearGradient(0, this.baseY - this.thickness, 0, this.baseY + this.thickness);
                grad.addColorStop(0, `hsla(${this.hue}, 100%, 65%, 0)`);
                grad.addColorStop(0.3, `hsla(${this.hue}, 100%, 65%, ${this.opacity})`);
                grad.addColorStop(0.5, `hsla(${this.hue}, 80%, 55%, ${this.opacity * 1.5})`);
                grad.addColorStop(0.7, `hsla(${this.hue}, 100%, 65%, ${this.opacity * 0.5})`);
                grad.addColorStop(1, `hsla(${this.hue}, 100%, 65%, 0)`);
                ctx.fillStyle = grad;
                ctx.fill();
            }
        }

        // ---- NEBULA BLOBS ----
        class NebulaBlob {
            constructor() {
                this.x = Math.random() * W;
                this.y = Math.random() * H;
                this.radius = 150 + Math.random() * 250;
                this.hue = [260, 310, 45, 200][Math.floor(Math.random() * 4)];
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.2;
                this.pulseSpeed = 0.001 + Math.random() * 0.002;
                this.opacity = 0.02 + Math.random() * 0.03;
            }
            update(t) {
                this.x += this.speedX + Math.sin(t * this.pulseSpeed) * 0.5;
                this.y += this.speedY + Math.cos(t * this.pulseSpeed * 0.7) * 0.3;
                if (this.x < -this.radius) this.x = W + this.radius;
                if (this.x > W + this.radius) this.x = -this.radius;
                if (this.y < -this.radius) this.y = H + this.radius;
                if (this.y > H + this.radius) this.y = -this.radius;
            }
            draw(t) {
                const pulsing = Math.sin(t * this.pulseSpeed) * 0.3 + 1;
                const r = this.radius * pulsing;
                const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r);
                grad.addColorStop(0, `hsla(${this.hue}, 80%, 55%, ${this.opacity * 1.5})`);
                grad.addColorStop(0.4, `hsla(${this.hue}, 70%, 45%, ${this.opacity})`);
                grad.addColorStop(1, `hsla(${this.hue}, 60%, 35%, 0)`);
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // ---- FIREFLY PARTICLES WITH TRAILS ----
        class Firefly {
            constructor() {
                this.reset();
                this.trail = [];
                this.trailLength = 8 + Math.floor(Math.random() * 12);
            }
            reset() {
                this.x = Math.random() * W;
                this.y = Math.random() * H;
                this.size = 1 + Math.random() * 2.5;
                this.speedX = (Math.random() - 0.5) * 1.2;
                this.speedY = (Math.random() - 0.5) * 1.2;
                this.hue = [260, 310, 45, 200, 330][Math.floor(Math.random() * 5)];
                this.life = 1;
                this.decay = 0.0005 + Math.random() * 0.001;
                this.wobbleSpeed = 0.02 + Math.random() * 0.03;
                this.wobbleAmp = 0.5 + Math.random() * 1.5;
                this.glowIntensity = 0.4 + Math.random() * 0.6;
            }
            update(t) {
                this.trail.push({ x: this.x, y: this.y, size: this.size, life: this.life });
                if (this.trail.length > this.trailLength) this.trail.shift();

                this.x += this.speedX + Math.sin(t * this.wobbleSpeed) * this.wobbleAmp;
                this.y += this.speedY + Math.cos(t * this.wobbleSpeed * 0.8) * this.wobbleAmp;
                this.life -= this.decay;

                // Mouse interaction â€” flee from cursor
                if (!isMobile) {
                    const dx = this.x - mouseX;
                    const dy = this.y - mouseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 200) {
                        const force = (200 - dist) / 200;
                        this.x += (dx / dist) * force * 2;
                        this.y += (dy / dist) * force * 2;
                    }
                }

                if (this.life <= 0 || this.x < -50 || this.x > W + 50 || this.y < -50 || this.y > H + 50) {
                    this.reset();
                    this.trail = [];
                }
            }
            draw() {
                // Draw trail
                for (let i = 0; i < this.trail.length; i++) {
                    const t = this.trail[i];
                    const alpha = (i / this.trail.length) * 0.3 * t.life;
                    ctx.beginPath();
                    ctx.arc(t.x, t.y, t.size * (i / this.trail.length), 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${alpha})`;
                    ctx.fill();
                }
                // Draw main particle with glow
                const glowRadius = this.size * 4 * this.glowIntensity;
                const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowRadius);
                grad.addColorStop(0, `hsla(${this.hue}, 100%, 80%, ${0.8 * this.life})`);
                grad.addColorStop(0.3, `hsla(${this.hue}, 100%, 60%, ${0.3 * this.life})`);
                grad.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`);
                ctx.beginPath();
                ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();

                // Bright core
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 100%, 95%, ${this.life})`;
                ctx.fill();
            }
        }

        // ---- CONSTELLATION NETWORK ----
        class NetworkNode {
            constructor() {
                this.x = Math.random() * W;
                this.y = Math.random() * H;
                this.size = 0.8 + Math.random() * 1.5;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.4;
                this.hue = [260, 310, 45, 180, 200][Math.floor(Math.random() * 5)];
                this.opacity = 0.15 + Math.random() * 0.35;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > W) this.speedX *= -1;
                if (this.y < 0 || this.y > H) this.speedY *= -1;

                // Mouse attraction
                if (!isMobile) {
                    const dx = mouseX - this.x;
                    const dy = mouseY - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 250) {
                        this.x += dx * 0.002;
                        this.y += dy * 0.002;
                    }
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 100%, 65%, ${this.opacity})`;
                ctx.fill();
            }
        }

        // ---- CLICK EXPLOSION PARTICLES ----
        let explosionParticles = [];
        class ExplosionParticle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                const angle = Math.random() * Math.PI * 2;
                const speed = 2 + Math.random() * 8;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.size = 1 + Math.random() * 3;
                this.life = 1;
                this.decay = 0.015 + Math.random() * 0.025;
                this.hue = [260, 310, 45, 200, 330][Math.floor(Math.random() * 5)];
                this.gravity = 0.05;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += this.gravity;
                this.vx *= 0.98;
                this.vy *= 0.98;
                this.life -= this.decay;
            }
            draw() {
                if (this.life <= 0) return;
                const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
                grad.addColorStop(0, `hsla(${this.hue}, 100%, 80%, ${this.life})`);
                grad.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`);
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
            }
        }

        window.spawnClickExplosion = function (x, y) {
            for (let i = 0; i < 25; i++) {
                explosionParticles.push(new ExplosionParticle(x, y));
            }
            // Shockwave ring
            spawnShockwave(x, y);
        };

        // ---- SHOCKWAVE RINGS ----
        let shockwaves = [];
        class Shockwave {
            constructor(x, y) {
                this.x = x; this.y = y;
                this.radius = 5; this.maxRadius = 120;
                this.life = 1; this.speed = 4;
                this.hue = [260, 310, 45][Math.floor(Math.random() * 3)];
            }
            update() {
                this.radius += this.speed;
                this.life = 1 - (this.radius / this.maxRadius);
                this.speed *= 0.97;
            }
            draw() {
                if (this.life <= 0) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `hsla(${this.hue}, 100%, 65%, ${this.life * 0.5})`;
                ctx.lineWidth = 2 * this.life;
                ctx.stroke();
            }
        }
        function spawnShockwave(x, y) {
            shockwaves.push(new Shockwave(x, y));
        }

        // ---- LIGHTNING BOLT ON FAST MOUSE ----
        let lightningBolts = [];
        class LightningBolt {
            constructor(x1, y1, x2, y2) {
                this.segments = [];
                this.life = 1;
                this.decay = 0.04;
                this.hue = Math.random() > 0.5 ? 185 : 270;
                this.generateSegments(x1, y1, x2, y2, 4);
            }
            generateSegments(x1, y1, x2, y2, depth) {
                if (depth <= 0) {
                    this.segments.push({ x1, y1, x2, y2 });
                    return;
                }
                const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * 30;
                const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * 30;
                this.generateSegments(x1, y1, midX, midY, depth - 1);
                this.generateSegments(midX, midY, x2, y2, depth - 1);
            }
            update() { this.life -= this.decay; }
            draw() {
                if (this.life <= 0) return;
                ctx.beginPath();
                ctx.strokeStyle = `hsla(${this.hue}, 100%, 75%, ${this.life * 0.7})`;
                ctx.lineWidth = 1.5 * this.life;
                ctx.shadowColor = `hsla(${this.hue}, 100%, 60%, ${this.life})`;
                ctx.shadowBlur = 15;
                this.segments.forEach(seg => {
                    ctx.moveTo(seg.x1, seg.y1);
                    ctx.lineTo(seg.x2, seg.y2);
                });
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
        }

        // ---- INITIALIZE ALL SYSTEMS ----
        const auroraWaves = Array.from({ length: AURORA_WAVES }, (_, i) => new AuroraWave(i));
        const nebulaBlobs = Array.from({ length: NEBULA_BLOBS }, () => new NebulaBlob());
        const fireflies = Array.from({ length: FIREFLY_COUNT }, () => new Firefly());
        const networkNodes = Array.from({ length: PARTICLE_COUNT }, () => new NetworkNode());

        // ---- CONNECT NEARBY NETWORK NODES ----
        function drawNetwork() {
            for (let i = 0; i < networkNodes.length; i++) {
                for (let j = i + 1; j < networkNodes.length; j++) {
                    const dx = networkNodes[i].x - networkNodes[j].x;
                    const dy = networkNodes[i].y - networkNodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 160) {
                        const alpha = 0.06 * (1 - dist / 160);
                        ctx.beginPath();
                        ctx.strokeStyle = `hsla(270, 100%, 60%, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(networkNodes[i].x, networkNodes[i].y);
                        ctx.lineTo(networkNodes[j].x, networkNodes[j].y);
                        ctx.stroke();
                    }
                }
                // Connect to mouse
                if (!isMobile) {
                    const dx = networkNodes[i].x - mouseX;
                    const dy = networkNodes[i].y - mouseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 200) {
                        const alpha = 0.12 * (1 - dist / 200);
                        ctx.beginPath();
                        ctx.strokeStyle = `hsla(310, 100%, 70%, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(networkNodes[i].x, networkNodes[i].y);
                        ctx.lineTo(mouseX, mouseY);
                        ctx.stroke();
                    }
                }
            }
        }

        // ---- LIGHTNING ON FAST MOUSE MOVE ----
        let lightningTimer = 0;
        function checkLightning() {
            if (mouseSpeed > 25 && lightningTimer <= 0 && !isMobile) {
                lightningBolts.push(new LightningBolt(
                    prevMouseX, prevMouseY, mouseX, mouseY
                ));
                lightningTimer = 3;
            }
            lightningTimer--;
        }

        // ---- MAIN RENDER LOOP ----
        let time = 0;
        function render() {
            time++;
            ctx.clearRect(0, 0, W, H);

            // Layer 1: Aurora waves
            auroraWaves.forEach(w => w.draw(time));

            // Layer 2: Nebula blobs
            nebulaBlobs.forEach(n => { n.update(time); n.draw(time); });

            // Layer 3: Network constellation
            networkNodes.forEach(n => { n.update(); n.draw(); });
            drawNetwork();

            // Layer 4: Fireflies
            fireflies.forEach(f => { f.update(time); f.draw(); });

            // Layer 5: Lightning
            checkLightning();
            lightningBolts = lightningBolts.filter(l => l.life > 0);
            lightningBolts.forEach(l => { l.update(); l.draw(); });

            // Layer 6: Explosions
            explosionParticles = explosionParticles.filter(p => p.life > 0);
            explosionParticles.forEach(p => { p.update(); p.draw(); });

            // Layer 7: Shockwaves
            shockwaves = shockwaves.filter(s => s.life > 0);
            shockwaves.forEach(s => { s.update(); s.draw(); });

            requestAnimationFrame(render);
        }
        render();
    }

    // ===== MATRIX RAIN (SUBTLE) =====
    if (matrixCanvas && !isMobile) {
        const mctx = matrixCanvas.getContext('2d');
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
        const chars = '01ã‚¢ã‚¤ã‚¦ã‚¨ã‚ªVASHISTAÎ©Î”Î£âˆž';
        const fontSize = 13;
        const columns = Math.floor(matrixCanvas.width / fontSize);
        const drops = Array(columns).fill(1);

        function drawMatrix() {
            mctx.fillStyle = 'rgba(15, 12, 41, 0.06)';
            mctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
            mctx.font = fontSize + 'px monospace';
            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                const hue = 175 + Math.sin(i * 0.1) * 40;
                mctx.fillStyle = `hsla(${hue}, 100%, 60%, 0.5)`;
                mctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.98) drops[i] = 0;
                drops[i]++;
            }
        }
        setInterval(drawMatrix, 70);
        window.addEventListener('resize', () => {
            matrixCanvas.width = window.innerWidth;
            matrixCanvas.height = window.innerHeight;
        });
    }

    // ===== MAGNETIC BUTTONS =====
    if (!isMobile) {
        const magneticElements = document.querySelectorAll('.navbar-cta, .btn-primary, .projects-github-btn, .showcase-btn.primary');
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
                el.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            });
            el.addEventListener('mouseenter', () => {
                el.style.transition = 'none';
            });
        });
    }

    // ===== PARALLAX ON SCROLL =====
    const heroVisual = document.querySelector('.hero-visual');
    const heroContent = document.querySelector('.hero-content');
    if (!isMobile && heroVisual && heroContent) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const rate = scrollY * 0.3;
            heroVisual.style.transform = `translateY(${rate * 0.5}px)`;
            heroContent.style.transform = `translateY(${rate * 0.2}px)`;
        });
    }

    // ===== RIPPLE EFFECT ON CLICK =====
    document.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.className = 'vfx-ripple';
        ripple.style.left = e.clientX + 'px';
        ripple.style.top = e.clientY + 'px';
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 800);
    });

    // ===== GAMING CONSOLE LOG =====
    console.log('%cðŸŽ® ULTIMATE VFX PORTFOLIO v5.0', 'color: #6c5ce7; font-size: 24px; font-weight: 900; text-shadow: 0 0 30px #6c5ce7, 0 0 60px #7b2fff;');
    console.log('%câš¡ Aurora + Nebula + Fireflies + Lightning + Explosions + Constellation Network', 'color: #ff2d75; font-size: 12px;');
});


