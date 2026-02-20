/* ============================================
   VASHISTA C V — INTERSTELLAR VFX ENGINE
   Three.js 3D WebGL Effects — Movie Grade
   Galaxy · Nebula · God Rays · Wormhole
   ============================================ */

(function () {
    'use strict';

    // Wait for Three.js to load
    function initVFX3D() {
        if (typeof THREE === 'undefined') {
            setTimeout(initVFX3D, 100);
            return;
        }

        const container = document.getElementById('vfx3d');
        if (!container) return;

        const isMobile = window.innerWidth <= 768;
        let mouseX = 0, mouseY = 0;
        let targetMouseX = 0, targetMouseY = 0;
        const W = window.innerWidth;
        const H = window.innerHeight;

        // ===== SCENE SETUP =====
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0xf0e6ff, 0.0004);

        const camera = new THREE.PerspectiveCamera(60, W / H, 1, 5000);
        camera.position.set(0, 0, 800);

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(W, H);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // ===== GALAXY PARTICLE SYSTEM =====
        const STAR_COUNT = isMobile ? 5000 : 15000;
        const galaxyGeometry = new THREE.BufferGeometry();
        const galaxyPositions = new Float32Array(STAR_COUNT * 3);
        const galaxyColors = new Float32Array(STAR_COUNT * 3);
        const galaxySizes = new Float32Array(STAR_COUNT);
        const galaxySpeeds = new Float32Array(STAR_COUNT);

        const colorPalette = [
            new THREE.Color(0x667eea), // Blue-purple
            new THREE.Color(0xf093fb), // Pink
            new THREE.Color(0xfd79a8), // Hot pink
            new THREE.Color(0xa29bfe), // Lavender
            new THREE.Color(0xfdcb6e), // Gold
            new THREE.Color(0x00cec9), // Teal
            new THREE.Color(0x6c5ce7), // Deep purple
            new THREE.Color(0xffeaa7), // Light gold
        ];

        for (let i = 0; i < STAR_COUNT; i++) {
            const i3 = i * 3;

            // Spiral galaxy distribution
            const radius = Math.random() * 2000;
            const spinAngle = radius * 0.005;
            const branchAngle = (i % 5) * ((2 * Math.PI) / 5);

            const randomX = (Math.random() - 0.5) * radius * 0.4;
            const randomY = (Math.random() - 0.5) * radius * 0.15;
            const randomZ = (Math.random() - 0.5) * radius * 0.4;

            galaxyPositions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
            galaxyPositions[i3 + 1] = randomY;
            galaxyPositions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

            // Colors from palette
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            galaxyColors[i3] = color.r;
            galaxyColors[i3 + 1] = color.g;
            galaxyColors[i3 + 2] = color.b;

            galaxySizes[i] = Math.random() * 3 + 0.5;
            galaxySpeeds[i] = 0.0002 + Math.random() * 0.0008;
        }

        galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(galaxyPositions, 3));
        galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(galaxyColors, 3));
        galaxyGeometry.setAttribute('size', new THREE.BufferAttribute(galaxySizes, 1));

        // Custom shader material for galaxy
        const galaxyMaterial = new THREE.PointsMaterial({
            size: 2.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true,
        });

        const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
        scene.add(galaxy);

        // ===== NEBULA CLOUDS =====
        const nebulaCount = isMobile ? 3 : 8;
        const nebulae = [];

        for (let i = 0; i < nebulaCount; i++) {
            const nebulaGeo = new THREE.SphereGeometry(100 + Math.random() * 200, 16, 16);
            const nebulaMat = new THREE.MeshBasicMaterial({
                color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
                transparent: true,
                opacity: 0.015 + Math.random() * 0.025,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
            });
            const nebula = new THREE.Mesh(nebulaGeo, nebulaMat);
            nebula.position.set(
                (Math.random() - 0.5) * 2000,
                (Math.random() - 0.5) * 600,
                (Math.random() - 0.5) * 2000
            );
            nebula.userData = {
                speedX: (Math.random() - 0.5) * 0.2,
                speedY: (Math.random() - 0.5) * 0.1,
                pulseSpeed: 0.001 + Math.random() * 0.002,
                baseScale: 0.8 + Math.random() * 0.5,
            };
            scene.add(nebula);
            nebulae.push(nebula);
        }

        // ===== FLOATING HOLOGRAPHIC GEOMETRY =====
        const floatingShapes = [];
        const shapeCount = isMobile ? 4 : 10;

        const holographicMaterial = (color) => new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.08,
            wireframe: true,
            blending: THREE.AdditiveBlending,
        });

        const solidHolographic = (color) => new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.03,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
        });

        for (let i = 0; i < shapeCount; i++) {
            let geometry;
            const shapeType = i % 5;
            switch (shapeType) {
                case 0: geometry = new THREE.IcosahedronGeometry(15 + Math.random() * 30, 1); break;
                case 1: geometry = new THREE.OctahedronGeometry(15 + Math.random() * 25, 0); break;
                case 2: geometry = new THREE.TorusKnotGeometry(12 + Math.random() * 15, 3, 64, 8); break;
                case 3: geometry = new THREE.TetrahedronGeometry(15 + Math.random() * 25, 0); break;
                case 4: geometry = new THREE.DodecahedronGeometry(12 + Math.random() * 20, 0); break;
            }

            const color = colorPalette[i % colorPalette.length];

            // Wire version
            const wireMesh = new THREE.Mesh(geometry, holographicMaterial(color));
            // Solid fill version
            const solidMesh = new THREE.Mesh(geometry, solidHolographic(color));

            const group = new THREE.Group();
            group.add(wireMesh);
            group.add(solidMesh);

            group.position.set(
                (Math.random() - 0.5) * 1200,
                (Math.random() - 0.5) * 600,
                (Math.random() - 0.5) * 800
            );

            group.userData = {
                rotSpeedX: (Math.random() - 0.5) * 0.01,
                rotSpeedY: (Math.random() - 0.5) * 0.01,
                rotSpeedZ: (Math.random() - 0.5) * 0.005,
                floatSpeed: 0.0005 + Math.random() * 0.001,
                floatAmp: 30 + Math.random() * 50,
                baseY: group.position.y,
            };

            scene.add(group);
            floatingShapes.push(group);
        }

        // ===== VOLUMETRIC LIGHT RAYS (GOD RAYS) =====
        const rayCount = isMobile ? 3 : 6;
        const godRays = [];

        for (let i = 0; i < rayCount; i++) {
            const rayGeo = new THREE.CylinderGeometry(0.5, 80 + Math.random() * 120, 1500, 8, 1, true);
            const rayMat = new THREE.MeshBasicMaterial({
                color: colorPalette[i % colorPalette.length],
                transparent: true,
                opacity: 0.008 + Math.random() * 0.012,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                side: THREE.DoubleSide,
            });

            const ray = new THREE.Mesh(rayGeo, rayMat);
            ray.position.set(
                (Math.random() - 0.5) * 800,
                -300 + Math.random() * 200,
                -500 + Math.random() * 300
            );
            ray.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.4;
            ray.rotation.z = (Math.random() - 0.5) * 0.5;

            ray.userData = {
                rotSpeed: (Math.random() - 0.5) * 0.001,
                pulseSpeed: 0.001 + Math.random() * 0.002,
                baseOpacity: rayMat.opacity,
            };

            scene.add(ray);
            godRays.push(ray);
        }

        // ===== WORMHOLE TUNNEL RING =====
        const ringCount = isMobile ? 8 : 20;
        const wormholeRings = [];

        for (let i = 0; i < ringCount; i++) {
            const ringGeo = new THREE.TorusGeometry(
                60 + i * 15,  // radius grows
                0.3 + Math.random() * 0.5,  // tube
                16, 100
            );
            const ringMat = new THREE.MeshBasicMaterial({
                color: colorPalette[i % colorPalette.length],
                transparent: true,
                opacity: 0.03 + (1 - i / ringCount) * 0.04,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.position.z = -200 - i * 80;
            ring.userData = {
                rotSpeed: 0.002 + Math.random() * 0.003,
                baseZ: ring.position.z,
                pulsePhase: Math.random() * Math.PI * 2,
            };
            scene.add(ring);
            wormholeRings.push(ring);
        }

        // ===== AMBIENT LIGHT PARTICLES (DUST) =====
        const dustCount = isMobile ? 200 : 800;
        const dustGeo = new THREE.BufferGeometry();
        const dustPositions = new Float32Array(dustCount * 3);
        const dustColors = new Float32Array(dustCount * 3);

        for (let i = 0; i < dustCount; i++) {
            dustPositions[i * 3] = (Math.random() - 0.5) * 3000;
            dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 1500;
            dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 3000;

            const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            dustColors[i * 3] = c.r;
            dustColors[i * 3 + 1] = c.g;
            dustColors[i * 3 + 2] = c.b;
        }

        dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
        dustGeo.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));

        const dustMaterial = new THREE.PointsMaterial({
            size: 1.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        const dust = new THREE.Points(dustGeo, dustMaterial);
        scene.add(dust);

        // ===== ENERGY ORBS =====
        const orbCount = isMobile ? 2 : 5;
        const energyOrbs = [];

        for (let i = 0; i < orbCount; i++) {
            const orbGroup = new THREE.Group();

            // Core glow
            const coreGeo = new THREE.SphereGeometry(5 + Math.random() * 8, 16, 16);
            const coreMat = new THREE.MeshBasicMaterial({
                color: colorPalette[i % colorPalette.length],
                transparent: true,
                opacity: 0.3,
                blending: THREE.AdditiveBlending,
            });
            const core = new THREE.Mesh(coreGeo, coreMat);

            // Outer glow
            const glowGeo = new THREE.SphereGeometry(15 + Math.random() * 20, 16, 16);
            const glowMat = new THREE.MeshBasicMaterial({
                color: colorPalette[i % colorPalette.length],
                transparent: true,
                opacity: 0.04,
                blending: THREE.AdditiveBlending,
            });
            const glow = new THREE.Mesh(glowGeo, glowMat);

            // Orbiting ring
            const orbitGeo = new THREE.TorusGeometry(20 + Math.random() * 10, 0.3, 8, 50);
            const orbitMat = new THREE.MeshBasicMaterial({
                color: colorPalette[(i + 2) % colorPalette.length],
                transparent: true,
                opacity: 0.1,
                blending: THREE.AdditiveBlending,
            });
            const orbit = new THREE.Mesh(orbitGeo, orbitMat);

            orbGroup.add(core);
            orbGroup.add(glow);
            orbGroup.add(orbit);

            orbGroup.position.set(
                (Math.random() - 0.5) * 1500,
                (Math.random() - 0.5) * 600,
                (Math.random() - 0.5) * 800
            );

            orbGroup.userData = {
                orbitMesh: orbit,
                floatSpeed: 0.0003 + Math.random() * 0.0006,
                floatAmp: 50 + Math.random() * 100,
                basePos: orbGroup.position.clone(),
                rotSpeed: 0.005 + Math.random() * 0.01,
            };

            scene.add(orbGroup);
            energyOrbs.push(orbGroup);
        }

        // ===== MOUSE TRACKING =====
        document.addEventListener('mousemove', (e) => {
            targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
            targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        // ===== RESIZE HANDLER =====
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // ===== SCROLL-BASED CAMERA DEPTH =====
        let scrollY = 0;
        window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
        });

        // ===== ANIMATION LOOP =====
        let time = 0;

        function animate() {
            requestAnimationFrame(animate);
            time += 0.005;

            // Smooth mouse follow
            mouseX += (targetMouseX - mouseX) * 0.03;
            mouseY += (targetMouseY - mouseY) * 0.03;

            // Camera follows mouse gently
            camera.position.x += (mouseX * 100 - camera.position.x) * 0.02;
            camera.position.y += (mouseY * 50 - camera.position.y) * 0.02;

            // Camera depth based on scroll
            const scrollDepth = scrollY * 0.15;
            camera.position.z = 800 - scrollDepth * 0.3;
            camera.lookAt(0, 0, -scrollDepth * 0.5);

            // Rotate galaxy slowly
            galaxy.rotation.y += 0.0003;
            galaxy.rotation.x = Math.sin(time * 0.5) * 0.02;

            // Animate nebulae
            nebulae.forEach((n, i) => {
                n.position.x += n.userData.speedX;
                n.position.y += n.userData.speedY;
                const pulse = Math.sin(time * n.userData.pulseSpeed * 200 + i) * 0.15 + n.userData.baseScale;
                n.scale.setScalar(pulse);
                if (Math.abs(n.position.x) > 1500) n.userData.speedX *= -1;
                if (Math.abs(n.position.y) > 500) n.userData.speedY *= -1;
            });

            // Animate floating shapes
            floatingShapes.forEach((shape, i) => {
                shape.rotation.x += shape.userData.rotSpeedX;
                shape.rotation.y += shape.userData.rotSpeedY;
                shape.rotation.z += shape.userData.rotSpeedZ;
                shape.position.y = shape.userData.baseY +
                    Math.sin(time * shape.userData.floatSpeed * 200 + i * 0.7) * shape.userData.floatAmp;
            });

            // Animate god rays
            godRays.forEach((ray, i) => {
                ray.rotation.z += ray.userData.rotSpeed;
                const pulse = Math.sin(time * ray.userData.pulseSpeed * 200 + i) * 0.5 + 0.5;
                ray.material.opacity = ray.userData.baseOpacity * (0.5 + pulse * 0.5);
            });

            // Animate wormhole rings
            wormholeRings.forEach((ring, i) => {
                ring.rotation.z += ring.userData.rotSpeed * (i % 2 === 0 ? 1 : -1);
                ring.rotation.x = Math.sin(time + ring.userData.pulsePhase) * 0.1;
                const pulse = Math.sin(time * 2 + ring.userData.pulsePhase) * 0.3 + 1;
                ring.scale.setScalar(pulse);
            });

            // Animate dust particles drifting
            dust.rotation.y += 0.0001;
            dust.rotation.x = Math.sin(time * 0.3) * 0.001;

            // Animate energy orbs
            energyOrbs.forEach((orb, i) => {
                const t = time * orb.userData.floatSpeed * 200;
                orb.position.x = orb.userData.basePos.x + Math.sin(t + i) * orb.userData.floatAmp;
                orb.position.y = orb.userData.basePos.y + Math.cos(t * 0.8 + i * 2) * orb.userData.floatAmp * 0.5;
                orb.userData.orbitMesh.rotation.x += orb.userData.rotSpeed;
                orb.userData.orbitMesh.rotation.y += orb.userData.rotSpeed * 0.7;
            });

            renderer.render(scene, camera);
        }

        animate();

        // ===== GSAP SCROLL ANIMATIONS =====
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            // Parallax sections
            gsap.utils.toArray('.section').forEach((section) => {
                gsap.fromTo(section, {
                    opacity: 0.3,
                    y: 60,
                }, {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                        end: 'top 30%',
                        toggleActions: 'play none none reverse',
                    }
                });
            });

            // Stagger cards
            gsap.utils.toArray('.exp-card, .showcase-card, .achievement-card').forEach((card, i) => {
                gsap.fromTo(card, {
                    opacity: 0,
                    y: 40,
                    rotateX: 5,
                    scale: 0.95,
                }, {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    scale: 1,
                    duration: 0.8,
                    delay: i * 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse',
                    }
                });
            });

            // Hero cinematic entrance
            gsap.fromTo('.hero-title', {
                opacity: 0, y: 80, scale: 0.9, filter: 'blur(20px)'
            }, {
                opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
                duration: 1.5, delay: 1, ease: 'power3.out'
            });

            gsap.fromTo('.hero-subtitle', {
                opacity: 0, y: 50, filter: 'blur(10px)'
            }, {
                opacity: 1, y: 0, filter: 'blur(0px)',
                duration: 1.2, delay: 1.3, ease: 'power3.out'
            });

            gsap.fromTo('.hero-actions', {
                opacity: 0, y: 40
            }, {
                opacity: 1, y: 0,
                duration: 1, delay: 1.6, ease: 'power3.out'
            });

            gsap.fromTo('.hero-visual', {
                opacity: 0, x: 100, scale: 0.85, filter: 'blur(15px)'
            }, {
                opacity: 1, x: 0, scale: 1, filter: 'blur(0px)',
                duration: 1.5, delay: 1.2, ease: 'power3.out'
            });
        }
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVFX3D);
    } else {
        initVFX3D();
    }
})();
