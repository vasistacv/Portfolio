/* ============================================
   VASHISTA C V — INTERSTELLAR VFX ENGINE v10.0
   Three.js 3D WebGL — Beyond Cinema Grade
   Galaxy · Wormhole · God Rays · Black Hole
   DNA Helix · Asteroid Belt · Shooting Stars
   Plasma Fields · Energy Orbs · Nebula Storms
   ============================================ */

(function () {
    'use strict';

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
        let W = window.innerWidth;
        let H = window.innerHeight;

        // ===== RENDERER =====
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0xf0e6ff, 0.00025);

        const camera = new THREE.PerspectiveCamera(65, W / H, 1, 8000);
        camera.position.set(0, 0, 1000);

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: !isMobile,
            powerPreference: 'high-performance'
        });
        renderer.setSize(W, H);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // ===== COLOR PALETTE =====
        const colors = {
            purple: new THREE.Color(0x6c5ce7),
            pink: new THREE.Color(0xfd79a8),
            lavender: new THREE.Color(0xa29bfe),
            gold: new THREE.Color(0xfdcb6e),
            teal: new THREE.Color(0x00cec9),
            deepPurple: new THREE.Color(0x764ba2),
            rose: new THREE.Color(0xe84393),
            blue: new THREE.Color(0x667eea),
            peach: new THREE.Color(0xfda085),
            mint: new THREE.Color(0x55efc4),
            coral: new THREE.Color(0xf093fb),
            white: new THREE.Color(0xffffff),
        };
        const colorArray = Object.values(colors);
        const pickColor = () => colorArray[Math.floor(Math.random() * colorArray.length)];

        // =============================================
        // 1. MEGA SPIRAL GALAXY — 30,000 STARS
        // =============================================
        const STAR_COUNT = isMobile ? 8000 : 30000;
        const galaxyGeo = new THREE.BufferGeometry();
        const gPos = new Float32Array(STAR_COUNT * 3);
        const gCol = new Float32Array(STAR_COUNT * 3);
        const gSize = new Float32Array(STAR_COUNT);

        for (let i = 0; i < STAR_COUNT; i++) {
            const i3 = i * 3;
            const radius = Math.random() * 2500;
            const spinAngle = radius * 0.004;
            const branchAngle = (i % 6) * ((2 * Math.PI) / 6);
            const scatter = radius * 0.3;

            gPos[i3] = Math.cos(branchAngle + spinAngle) * radius + (Math.random() - 0.5) * scatter;
            gPos[i3 + 1] = (Math.random() - 0.5) * radius * 0.1;
            gPos[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + (Math.random() - 0.5) * scatter;

            const c = pickColor();
            gCol[i3] = c.r;
            gCol[i3 + 1] = c.g;
            gCol[i3 + 2] = c.b;

            gSize[i] = Math.random() * 3 + 0.5;
        }

        galaxyGeo.setAttribute('position', new THREE.BufferAttribute(gPos, 3));
        galaxyGeo.setAttribute('color', new THREE.BufferAttribute(gCol, 3));

        const galaxy = new THREE.Points(galaxyGeo, new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true,
        }));
        scene.add(galaxy);

        // =============================================
        // 2. WORMHOLE TUNNEL — 30 RINGS
        // =============================================
        const ringCount = isMobile ? 12 : 30;
        const wormholeRings = [];

        for (let i = 0; i < ringCount; i++) {
            const ring = new THREE.Mesh(
                new THREE.TorusGeometry(50 + i * 18, 0.3 + Math.random() * 0.4, 16, 120),
                new THREE.MeshBasicMaterial({
                    color: colorArray[i % colorArray.length],
                    transparent: true,
                    opacity: 0.04 + (1 - i / ringCount) * 0.05,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                })
            );
            ring.position.z = -200 - i * 100;
            ring.userData = {
                rotSpeed: 0.002 + Math.random() * 0.004,
                phase: Math.random() * Math.PI * 2,
            };
            scene.add(ring);
            wormholeRings.push(ring);
        }

        // =============================================
        // 3. DNA DOUBLE HELIX
        // =============================================
        const dnaGroup = new THREE.Group();
        const helixPoints = isMobile ? 60 : 150;
        const helixRadius = 80;
        const helixHeight = 1500;

        for (let strand = 0; strand < 2; strand++) {
            const offset = strand * Math.PI;
            for (let i = 0; i < helixPoints; i++) {
                const t = i / helixPoints;
                const angle = t * Math.PI * 8 + offset;
                const y = t * helixHeight - helixHeight / 2;

                const sphere = new THREE.Mesh(
                    new THREE.SphereGeometry(2 + Math.random() * 2, 8, 8),
                    new THREE.MeshBasicMaterial({
                        color: strand === 0 ? colors.purple : colors.pink,
                        transparent: true,
                        opacity: 0.2,
                        blending: THREE.AdditiveBlending,
                    })
                );
                sphere.position.set(
                    Math.cos(angle) * helixRadius,
                    y,
                    Math.sin(angle) * helixRadius
                );
                dnaGroup.add(sphere);

                // Cross-links
                if (strand === 0 && i % 5 === 0) {
                    const angle2 = angle + Math.PI;
                    const lineGeo = new THREE.BufferGeometry().setFromPoints([
                        new THREE.Vector3(Math.cos(angle) * helixRadius, y, Math.sin(angle) * helixRadius),
                        new THREE.Vector3(Math.cos(angle2) * helixRadius, y, Math.sin(angle2) * helixRadius),
                    ]);
                    const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({
                        color: colors.gold,
                        transparent: true,
                        opacity: 0.08,
                        blending: THREE.AdditiveBlending,
                    }));
                    dnaGroup.add(line);
                }
            }
        }

        dnaGroup.position.set(600, 0, -400);
        scene.add(dnaGroup);

        // =============================================
        // 4. ASTEROID BELT
        // =============================================
        const asteroidCount = isMobile ? 100 : 400;
        const asteroids = [];

        for (let i = 0; i < asteroidCount; i++) {
            const size = 1 + Math.random() * 4;
            const geo = Math.random() > 0.5
                ? new THREE.IcosahedronGeometry(size, 0)
                : new THREE.OctahedronGeometry(size, 0);

            const asteroid = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
                color: pickColor(),
                transparent: true,
                opacity: 0.15 + Math.random() * 0.15,
                blending: THREE.AdditiveBlending,
                wireframe: Math.random() > 0.5,
            }));

            const beltRadius = 800 + Math.random() * 600;
            const angle = Math.random() * Math.PI * 2;
            asteroid.position.set(
                Math.cos(angle) * beltRadius,
                (Math.random() - 0.5) * 80,
                Math.sin(angle) * beltRadius
            );
            asteroid.userData = {
                angle: angle,
                radius: beltRadius,
                speed: 0.0001 + Math.random() * 0.0003,
                rotSpeed: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02
                ),
            };
            scene.add(asteroid);
            asteroids.push(asteroid);
        }

        // =============================================
        // 5. NEBULA PLASMA CLOUDS
        // =============================================
        const nebulaCount = isMobile ? 4 : 12;
        const nebulae = [];

        for (let i = 0; i < nebulaCount; i++) {
            const size = 120 + Math.random() * 300;
            const nebula = new THREE.Mesh(
                new THREE.SphereGeometry(size, 16, 16),
                new THREE.MeshBasicMaterial({
                    color: pickColor(),
                    transparent: true,
                    opacity: 0.01 + Math.random() * 0.02,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                })
            );
            nebula.position.set(
                (Math.random() - 0.5) * 3000,
                (Math.random() - 0.5) * 1000,
                (Math.random() - 0.5) * 3000
            );
            nebula.userData = {
                speed: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.15,
                    (Math.random() - 0.5) * 0.08,
                    (Math.random() - 0.5) * 0.12
                ),
                pulseSpeed: 0.001 + Math.random() * 0.003,
                baseScale: 0.7 + Math.random() * 0.6,
            };
            scene.add(nebula);
            nebulae.push(nebula);
        }

        // =============================================
        // 6. VOLUMETRIC GOD RAYS
        // =============================================
        const godRayCount = isMobile ? 3 : 8;
        const godRays = [];

        for (let i = 0; i < godRayCount; i++) {
            const ray = new THREE.Mesh(
                new THREE.CylinderGeometry(0.5, 100 + Math.random() * 150, 2000, 8, 1, true),
                new THREE.MeshBasicMaterial({
                    color: colorArray[i % colorArray.length],
                    transparent: true,
                    opacity: 0.006 + Math.random() * 0.01,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                    side: THREE.DoubleSide,
                })
            );
            ray.position.set(
                (Math.random() - 0.5) * 1000,
                -400 + Math.random() * 300,
                -800 + Math.random() * 400
            );
            ray.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.5;
            ray.rotation.z = (Math.random() - 0.5) * 0.6;
            ray.userData = {
                rotSpeed: (Math.random() - 0.5) * 0.0008,
                pulseSpeed: 0.001 + Math.random() * 0.002,
                baseOpacity: ray.material.opacity,
            };
            scene.add(ray);
            godRays.push(ray);
        }

        // =============================================
        // 7. FLOATING HOLOGRAPHIC GEOMETRY
        // =============================================
        const shapeCount = isMobile ? 5 : 15;
        const floatingShapes = [];

        for (let i = 0; i < shapeCount; i++) {
            let geo;
            switch (i % 7) {
                case 0: geo = new THREE.IcosahedronGeometry(15 + Math.random() * 25, 1); break;
                case 1: geo = new THREE.OctahedronGeometry(12 + Math.random() * 20, 0); break;
                case 2: geo = new THREE.TorusKnotGeometry(10 + Math.random() * 15, 3, 80, 12); break;
                case 3: geo = new THREE.TetrahedronGeometry(15 + Math.random() * 20, 0); break;
                case 4: geo = new THREE.DodecahedronGeometry(12 + Math.random() * 18, 0); break;
                case 5: geo = new THREE.TorusGeometry(12 + Math.random() * 15, 3, 12, 40); break;
                case 6: geo = new THREE.ConeGeometry(10 + Math.random() * 12, 25, 6); break;
            }

            const color = pickColor();
            const group = new THREE.Group();

            // Wireframe
            group.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
                color, transparent: true, opacity: 0.08, wireframe: true,
                blending: THREE.AdditiveBlending,
            })));
            // Solid fill
            group.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
                color, transparent: true, opacity: 0.02,
                blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
            })));

            group.position.set(
                (Math.random() - 0.5) * 1800,
                (Math.random() - 0.5) * 800,
                (Math.random() - 0.5) * 1200
            );
            group.userData = {
                rot: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.008,
                    (Math.random() - 0.5) * 0.008,
                    (Math.random() - 0.5) * 0.004
                ),
                floatSpeed: 0.0004 + Math.random() * 0.001,
                floatAmp: 30 + Math.random() * 60,
                baseY: group.position.y,
            };
            scene.add(group);
            floatingShapes.push(group);
        }

        // =============================================
        // 8. ENERGY ORBS WITH ORBITING RINGS
        // =============================================
        const orbCount = isMobile ? 3 : 7;
        const energyOrbs = [];

        for (let i = 0; i < orbCount; i++) {
            const group = new THREE.Group();
            const color = pickColor();
            const color2 = pickColor();

            // Core
            group.add(new THREE.Mesh(
                new THREE.SphereGeometry(4 + Math.random() * 6, 16, 16),
                new THREE.MeshBasicMaterial({
                    color, transparent: true, opacity: 0.3,
                    blending: THREE.AdditiveBlending,
                })
            ));
            // Glow
            group.add(new THREE.Mesh(
                new THREE.SphereGeometry(15 + Math.random() * 20, 12, 12),
                new THREE.MeshBasicMaterial({
                    color, transparent: true, opacity: 0.03,
                    blending: THREE.AdditiveBlending,
                })
            ));
            // Ring 1
            const ring1 = new THREE.Mesh(
                new THREE.TorusGeometry(18 + Math.random() * 10, 0.3, 8, 50),
                new THREE.MeshBasicMaterial({
                    color: color2, transparent: true, opacity: 0.1,
                    blending: THREE.AdditiveBlending,
                })
            );
            group.add(ring1);
            // Ring 2
            const ring2 = new THREE.Mesh(
                new THREE.TorusGeometry(25 + Math.random() * 8, 0.2, 8, 50),
                new THREE.MeshBasicMaterial({
                    color: pickColor(), transparent: true, opacity: 0.06,
                    blending: THREE.AdditiveBlending,
                })
            );
            ring2.rotation.x = Math.PI / 3;
            group.add(ring2);

            group.position.set(
                (Math.random() - 0.5) * 2000,
                (Math.random() - 0.5) * 800,
                (Math.random() - 0.5) * 1200
            );
            group.userData = {
                ring1, ring2,
                floatSpeed: 0.0003 + Math.random() * 0.0006,
                floatAmp: 60 + Math.random() * 120,
                basePos: group.position.clone(),
                rotSpeed: 0.003 + Math.random() * 0.008,
            };
            scene.add(group);
            energyOrbs.push(group);
        }

        // =============================================
        // 9. SHOOTING STARS / COMETS
        // =============================================
        const cometCount = isMobile ? 3 : 8;
        const comets = [];

        for (let i = 0; i < cometCount; i++) {
            const cometGroup = new THREE.Group();

            // Comet head
            const head = new THREE.Mesh(
                new THREE.SphereGeometry(2 + Math.random() * 3, 8, 8),
                new THREE.MeshBasicMaterial({
                    color: pickColor(),
                    transparent: true,
                    opacity: 0.6,
                    blending: THREE.AdditiveBlending,
                })
            );
            cometGroup.add(head);

            // Tail trail particles
            const tailCount = 20 + Math.floor(Math.random() * 20);
            for (let t = 0; t < tailCount; t++) {
                const tailParticle = new THREE.Mesh(
                    new THREE.SphereGeometry(0.5 + (1 - t / tailCount) * 2, 4, 4),
                    new THREE.MeshBasicMaterial({
                        color: head.material.color,
                        transparent: true,
                        opacity: 0.3 * (1 - t / tailCount),
                        blending: THREE.AdditiveBlending,
                    })
                );
                tailParticle.position.x = -t * 5;
                tailParticle.position.y = t * 2;
                cometGroup.add(tailParticle);
            }

            cometGroup.position.set(
                (Math.random() - 0.5) * 4000,
                (Math.random() - 0.5) * 2000,
                (Math.random() - 0.5) * 2000
            );

            cometGroup.userData = {
                speed: 1 + Math.random() * 3,
                dirX: -0.5 - Math.random(),
                dirY: -0.3 - Math.random() * 0.5,
                dirZ: (Math.random() - 0.5),
                resetTimeout: Math.random() * 600 + 200,
                timer: 0,
            };

            scene.add(cometGroup);
            comets.push(cometGroup);
        }

        // =============================================
        // 10. COSMIC DUST FIELD
        // =============================================
        const dustCount = isMobile ? 400 : 2000;
        const dustGeo = new THREE.BufferGeometry();
        const dPos = new Float32Array(dustCount * 3);
        const dCol = new Float32Array(dustCount * 3);

        for (let i = 0; i < dustCount; i++) {
            dPos[i * 3] = (Math.random() - 0.5) * 4000;
            dPos[i * 3 + 1] = (Math.random() - 0.5) * 2000;
            dPos[i * 3 + 2] = (Math.random() - 0.5) * 4000;
            const c = pickColor();
            dCol[i * 3] = c.r; dCol[i * 3 + 1] = c.g; dCol[i * 3 + 2] = c.b;
        }

        dustGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
        dustGeo.setAttribute('color', new THREE.BufferAttribute(dCol, 3));
        const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
            size: 1.2, vertexColors: true, transparent: true, opacity: 0.25,
            blending: THREE.AdditiveBlending, depthWrite: false,
        }));
        scene.add(dust);

        // =============================================
        // 11. PLASMA ENERGY FIELD
        // =============================================
        const plasmaCount = isMobile ? 2 : 5;
        const plasmaFields = [];

        for (let i = 0; i < plasmaCount; i++) {
            const plasmaGeo = new THREE.PlaneGeometry(400 + Math.random() * 300, 400 + Math.random() * 300, 1, 1);
            const plasma = new THREE.Mesh(plasmaGeo, new THREE.MeshBasicMaterial({
                color: pickColor(),
                transparent: true,
                opacity: 0.008 + Math.random() * 0.01,
                blending: THREE.AdditiveBlending,
                side: THREE.DoubleSide,
                depthWrite: false,
            }));
            plasma.position.set(
                (Math.random() - 0.5) * 2000,
                (Math.random() - 0.5) * 800,
                (Math.random() - 0.5) * 1500
            );
            plasma.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            plasma.userData = {
                rotSpeed: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.002,
                    (Math.random() - 0.5) * 0.002,
                    (Math.random() - 0.5) * 0.001
                ),
                pulseSpeed: 0.002 + Math.random() * 0.003,
                baseOpacity: plasma.material.opacity,
            };
            scene.add(plasma);
            plasmaFields.push(plasma);
        }

        // =============================================
        // 12. GRAVITATIONAL LENS (Black Hole Core)
        // =============================================
        const blackHoleGroup = new THREE.Group();

        // Event horizon
        const eventHorizon = new THREE.Mesh(
            new THREE.SphereGeometry(30, 32, 32),
            new THREE.MeshBasicMaterial({
                color: 0x0f0c29,
                transparent: true,
                opacity: 0.15,
            })
        );
        blackHoleGroup.add(eventHorizon);

        // Accretion disk
        const accretionGeo = new THREE.TorusGeometry(60, 15, 4, 100);
        const accretion = new THREE.Mesh(accretionGeo, new THREE.MeshBasicMaterial({
            color: colors.gold,
            transparent: true,
            opacity: 0.06,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
        }));
        accretion.rotation.x = Math.PI / 2.5;
        blackHoleGroup.add(accretion);

        // Inner glow ring
        const innerRing = new THREE.Mesh(
            new THREE.TorusGeometry(40, 2, 8, 100),
            new THREE.MeshBasicMaterial({
                color: colors.coral,
                transparent: true,
                opacity: 0.08,
                blending: THREE.AdditiveBlending,
            })
        );
        innerRing.rotation.x = Math.PI / 2.5;
        blackHoleGroup.add(innerRing);

        // Gravitational glow
        const gravGlow = new THREE.Mesh(
            new THREE.SphereGeometry(80, 16, 16),
            new THREE.MeshBasicMaterial({
                color: colors.purple,
                transparent: true,
                opacity: 0.02,
                blending: THREE.AdditiveBlending,
            })
        );
        blackHoleGroup.add(gravGlow);

        blackHoleGroup.position.set(-500, 100, -600);
        scene.add(blackHoleGroup);

        // =============================================
        // 13. LIGHT STREAKS / SPEED LINES
        // =============================================
        const streakCount = isMobile ? 20 : 60;
        const streaks = [];

        for (let i = 0; i < streakCount; i++) {
            const length = 50 + Math.random() * 200;
            const streakGeo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 0, -length),
            ]);
            const streak = new THREE.Line(streakGeo, new THREE.LineBasicMaterial({
                color: pickColor(),
                transparent: true,
                opacity: 0.05 + Math.random() * 0.08,
                blending: THREE.AdditiveBlending,
            }));
            streak.position.set(
                (Math.random() - 0.5) * 2000,
                (Math.random() - 0.5) * 1000,
                (Math.random() - 0.5) * 3000
            );
            streak.userData = { speed: 0.5 + Math.random() * 2 };
            scene.add(streak);
            streaks.push(streak);
        }

        // =============================================
        // MOUSE & SCROLL TRACKING
        // =============================================
        document.addEventListener('mousemove', (e) => {
            targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
            targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        let scrollY = 0;
        window.addEventListener('scroll', () => { scrollY = window.scrollY; });

        window.addEventListener('resize', () => {
            W = window.innerWidth;
            H = window.innerHeight;
            camera.aspect = W / H;
            camera.updateProjectionMatrix();
            renderer.setSize(W, H);
        });

        // =============================================
        // ANIMATION LOOP
        // =============================================
        let time = 0;

        function animate() {
            requestAnimationFrame(animate);
            time += 0.004;

            // Smooth mouse
            mouseX += (targetMouseX - mouseX) * 0.025;
            mouseY += (targetMouseY - mouseY) * 0.025;

            // Camera
            camera.position.x += (mouseX * 120 - camera.position.x) * 0.015;
            camera.position.y += (mouseY * 60 - camera.position.y) * 0.015;
            const depth = scrollY * 0.12;
            camera.position.z = 1000 - depth * 0.2;
            camera.lookAt(0, 0, -depth * 0.4);

            // 1. Galaxy rotation
            galaxy.rotation.y += 0.0002;
            galaxy.rotation.x = Math.sin(time * 0.3) * 0.015;

            // 2. Wormhole
            wormholeRings.forEach((r, i) => {
                r.rotation.z += r.userData.rotSpeed * (i % 2 === 0 ? 1 : -1);
                r.rotation.x = Math.sin(time + r.userData.phase) * 0.08;
                r.scale.setScalar(Math.sin(time * 1.5 + r.userData.phase) * 0.25 + 1);
            });

            // 3. DNA helix
            dnaGroup.rotation.y += 0.002;
            dnaGroup.position.y = Math.sin(time * 0.5) * 50;

            // 4. Asteroids
            asteroids.forEach(a => {
                a.userData.angle += a.userData.speed;
                a.position.x = Math.cos(a.userData.angle) * a.userData.radius;
                a.position.z = Math.sin(a.userData.angle) * a.userData.radius;
                a.rotation.x += a.userData.rotSpeed.x;
                a.rotation.y += a.userData.rotSpeed.y;
            });

            // 5. Nebulae
            nebulae.forEach((n, i) => {
                n.position.add(n.userData.speed);
                const s = Math.sin(time * n.userData.pulseSpeed * 100 + i) * 0.2 + n.userData.baseScale;
                n.scale.setScalar(s);
                if (Math.abs(n.position.x) > 2000) n.userData.speed.x *= -1;
                if (Math.abs(n.position.y) > 800) n.userData.speed.y *= -1;
                if (Math.abs(n.position.z) > 2000) n.userData.speed.z *= -1;
            });

            // 6. God rays
            godRays.forEach((r, i) => {
                r.rotation.z += r.userData.rotSpeed;
                const p = Math.sin(time * r.userData.pulseSpeed * 150 + i) * 0.5 + 0.5;
                r.material.opacity = r.userData.baseOpacity * (0.4 + p * 0.6);
            });

            // 7. Floating shapes
            floatingShapes.forEach((s, i) => {
                s.rotation.x += s.userData.rot.x;
                s.rotation.y += s.userData.rot.y;
                s.rotation.z += s.userData.rot.z;
                s.position.y = s.userData.baseY + Math.sin(time * s.userData.floatSpeed * 150 + i) * s.userData.floatAmp;
            });

            // 8. Energy orbs
            energyOrbs.forEach((o, i) => {
                const t2 = time * o.userData.floatSpeed * 150;
                o.position.x = o.userData.basePos.x + Math.sin(t2 + i) * o.userData.floatAmp;
                o.position.y = o.userData.basePos.y + Math.cos(t2 * 0.7 + i * 2) * o.userData.floatAmp * 0.4;
                o.userData.ring1.rotation.x += o.userData.rotSpeed;
                o.userData.ring1.rotation.y += o.userData.rotSpeed * 0.6;
                o.userData.ring2.rotation.y += o.userData.rotSpeed * 0.8;
                o.userData.ring2.rotation.z += o.userData.rotSpeed * 0.4;
            });

            // 9. Comets
            comets.forEach(c => {
                c.position.x += c.userData.dirX * c.userData.speed;
                c.position.y += c.userData.dirY * c.userData.speed;
                c.position.z += c.userData.dirZ * c.userData.speed;
                c.userData.timer++;
                if (c.userData.timer > c.userData.resetTimeout) {
                    c.position.set(
                        (Math.random() - 0.5) * 4000,
                        800 + Math.random() * 500,
                        (Math.random() - 0.5) * 2000
                    );
                    c.userData.timer = 0;
                    c.userData.resetTimeout = Math.random() * 600 + 200;
                }
            });

            // 10. Dust drift
            dust.rotation.y += 0.00005;
            dust.rotation.x = Math.sin(time * 0.2) * 0.0005;

            // 11. Plasma fields
            plasmaFields.forEach((p, i) => {
                p.rotation.x += p.userData.rotSpeed.x;
                p.rotation.y += p.userData.rotSpeed.y;
                p.rotation.z += p.userData.rotSpeed.z;
                const pulse = Math.sin(time * p.userData.pulseSpeed * 100 + i * 1.5) * 0.5 + 0.5;
                p.material.opacity = p.userData.baseOpacity * (0.5 + pulse);
            });

            // 12. Black hole
            blackHoleGroup.rotation.y += 0.001;
            accretion.rotation.z += 0.003;
            innerRing.rotation.z -= 0.005;
            const bhPulse = Math.sin(time * 2) * 0.1 + 1;
            gravGlow.scale.setScalar(bhPulse);

            // 13. Light streaks
            streaks.forEach(s => {
                s.position.z += s.userData.speed;
                if (s.position.z > 2000) s.position.z = -2000;
            });

            renderer.render(scene, camera);
        }

        animate();

        // =============================================
        // GSAP CINEMATIC SCROLL ANIMATIONS
        // =============================================
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            // Sections fade in
            gsap.utils.toArray('.section').forEach(s => {
                gsap.fromTo(s, { opacity: 0.2, y: 80 }, {
                    opacity: 1, y: 0, duration: 1.4, ease: 'power3.out',
                    scrollTrigger: { trigger: s, start: 'top 85%', end: 'top 25%', toggleActions: 'play none none reverse' }
                });
            });

            // Cards stagger
            gsap.utils.toArray('.exp-card, .showcase-card, .achievement-card').forEach((c, i) => {
                gsap.fromTo(c, { opacity: 0, y: 50, rotateX: 8, scale: 0.93 }, {
                    opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 0.9, delay: i * 0.08,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: c, start: 'top 92%', toggleActions: 'play none none reverse' }
                });
            });

            // Hero cinematic
            gsap.fromTo('.hero-title', { opacity: 0, y: 100, scale: 0.85, filter: 'blur(25px)' },
                { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.8, delay: 1, ease: 'power3.out' });

            gsap.fromTo('.hero-subtitle', { opacity: 0, y: 60, filter: 'blur(15px)' },
                { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, delay: 1.4, ease: 'power3.out' });

            gsap.fromTo('.hero-actions', { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1.2, delay: 1.7, ease: 'power3.out' });

            gsap.fromTo('.hero-visual', { opacity: 0, x: 120, scale: 0.8, filter: 'blur(20px)' },
                { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)', duration: 1.8, delay: 1.3, ease: 'power3.out' });

            // Skill bars with scroll
            gsap.utils.toArray('.skill-bar-fill').forEach(bar => {
                const w = bar.style.getPropertyValue('--width');
                gsap.fromTo(bar, { width: '0%' }, {
                    width: w, duration: 2, ease: 'power2.out',
                    scrollTrigger: { trigger: bar, start: 'top 90%' }
                });
            });

            // Section labels
            gsap.utils.toArray('.section-label').forEach(l => {
                gsap.fromTo(l, { opacity: 0, x: -30, letterSpacing: '0px' }, {
                    opacity: 1, x: 0, letterSpacing: '3px', duration: 0.8,
                    scrollTrigger: { trigger: l, start: 'top 90%' }
                });
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVFX3D);
    } else {
        initVFX3D();
    }
})();
