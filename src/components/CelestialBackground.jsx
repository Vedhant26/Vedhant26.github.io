import React, { useEffect, useRef } from 'react';

const CelestialBackground = () => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        // --- Visibility tracking ---
        let isVisible = true;
        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisible = entry.isIntersecting;
            },
            { threshold: 0 }
        );
        observer.observe(canvas);

        // --- Stars (reduced count for performance) ---
        const STAR_COUNT = 80;
        const stars = [];

        const createStar = (randomT) => {
            const baseY = Math.random() * height;
            const amplitude = Math.random() * 120 + 30;
            return {
                t: randomT ? Math.random() : 0,
                baseY,
                amplitude,
                radius: Math.random() * 1.8 + 0.2,
                baseAlpha: Math.random() * 0.6 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinkleOffset: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.0006 + 0.0002,
            };
        };

        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push(createStar(true));
        }

        const getStarPos = (star) => {
            const x = star.t * (width + 20) - 10;
            const y = star.baseY - star.amplitude * 4 * star.t * (1 - star.t);
            return { x, y };
        };

        // --- Comet (realistic glowing comet) ---
        let comet = null;
        const spawnComet = () => {
            const startY = height * (0.55 + Math.random() * 0.3);
            comet = {
                startX: -60,
                startY,
                apexX: width * (0.35 + Math.random() * 0.3),
                apexY: height * (0.08 + Math.random() * 0.15),
                endX: width + 80,
                endY: height * (0.4 + Math.random() * 0.35),
                t: 0,
                speed: 0.0010 + Math.random() * 0.0008,
                brightness: 1,
            };
        };

        const bezier = (t, p0, p1, p2) =>
            (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;

        const getCometPos = (c, t) => ({
            x: bezier(t, c.startX, c.apexX, c.endX),
            y: bezier(t, c.startY, c.apexY, c.endY),
        });

        // --- Small shooting stars ---
        const shootingStars = [];
        const spawnShootingStar = () => {
            shootingStars.push({
                x: Math.random() * width * 0.8,
                y: Math.random() * height * 0.3,
                length: Math.random() * 80 + 40,
                speed: Math.random() * 8 + 6,
                angle: (Math.random() * 20 + 20) * (Math.PI / 180),
                alpha: 1,
                decay: Math.random() * 0.015 + 0.01,
            });
        };

        let time = 0;
        let lastShootingStar = 0;
        let lastComet = -600;

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);

            // Skip rendering when off-screen
            if (!isVisible) return;

            ctx.clearRect(0, 0, width, height);
            time += 1;

            // --- Draw stars ---
            for (let i = 0; i < stars.length; i++) {
                const star = stars[i];
                star.t += star.speed;
                if (star.t > 1) {
                    star.t = 0;
                    star.baseY = Math.random() * height;
                    star.amplitude = Math.random() * 120 + 30;
                }

                const { x, y } = getStarPos(star);
                const alpha =
                    star.baseAlpha +
                    Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.3;

                let edgeFade = 1;
                if (star.t < 0.05) edgeFade = star.t / 0.05;
                else if (star.t > 0.95) edgeFade = (1 - star.t) / 0.05;

                const finalAlpha = Math.max(0.05, Math.min(1, alpha * edgeFade));
                ctx.beginPath();
                ctx.arc(x, y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${finalAlpha})`;
                ctx.fill();
            }

            // --- Shooting stars ---
            if (time - lastShootingStar > 300 + Math.random() * 400) {
                spawnShootingStar();
                lastShootingStar = time;
            }

            for (let i = shootingStars.length - 1; i >= 0; i--) {
                const s = shootingStars[i];
                s.x += Math.cos(s.angle) * s.speed;
                s.y += Math.sin(s.angle) * s.speed;
                s.alpha -= s.decay;

                if (s.alpha <= 0) {
                    shootingStars.splice(i, 1);
                    continue;
                }

                const tailX = s.x - Math.cos(s.angle) * s.length;
                const tailY = s.y - Math.sin(s.angle) * s.length;

                const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
                grad.addColorStop(0, 'transparent');
                grad.addColorStop(1, `rgba(255, 255, 255, ${s.alpha})`);

                ctx.beginPath();
                ctx.moveTo(tailX, tailY);
                ctx.lineTo(s.x, s.y);
                ctx.strokeStyle = grad;
                ctx.lineWidth = 1.5;
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
                ctx.fill();
            }

            // --- Comet (realistic glowing comet) ---
            if (!comet && time - lastComet > 500 + Math.random() * 400) {
                spawnComet();
                lastComet = time;
            }

            if (comet) {
                comet.t += comet.speed;
                if (comet.t >= 1) {
                    comet = null;
                } else {
                    const head = getCometPos(comet, comet.t);

                    // Calculate direction for the tail
                    const lookAhead = Math.min(comet.t + 0.005, 1);
                    const nextPos = getCometPos(comet, lookAhead);
                    const dx = nextPos.x - head.x;
                    const dy = nextPos.y - head.y;
                    const angle = Math.atan2(dy, dx);

                    // Tail direction (opposite of travel)
                    const tailAngle = angle + Math.PI;

                    // === MAIN TAIL — smooth gradient line ===
                    const tailLength = 120;
                    const tailEndX = head.x + Math.cos(tailAngle) * tailLength;
                    const tailEndY = head.y + Math.sin(tailAngle) * tailLength;

                    const tailGrad = ctx.createLinearGradient(head.x, head.y, tailEndX, tailEndY);
                    tailGrad.addColorStop(0, `rgba(200, 230, 255, ${0.7 * comet.brightness})`);
                    tailGrad.addColorStop(0.15, `rgba(150, 200, 255, ${0.45 * comet.brightness})`);
                    tailGrad.addColorStop(0.4, `rgba(120, 170, 255, ${0.2 * comet.brightness})`);
                    tailGrad.addColorStop(1, 'transparent');

                    ctx.beginPath();
                    ctx.moveTo(head.x, head.y);
                    ctx.lineTo(tailEndX, tailEndY);
                    ctx.strokeStyle = tailGrad;
                    ctx.lineWidth = 4;
                    ctx.lineCap = 'round';
                    ctx.stroke();

                    // === SECONDARY DUST TAIL — slightly offset angle ===
                    const dustAngle = tailAngle + 0.15;
                    const dustLength = 80;
                    const dustEndX = head.x + Math.cos(dustAngle) * dustLength;
                    const dustEndY = head.y + Math.sin(dustAngle) * dustLength;

                    const dustGrad = ctx.createLinearGradient(head.x, head.y, dustEndX, dustEndY);
                    dustGrad.addColorStop(0, `rgba(255, 220, 180, ${0.3 * comet.brightness})`);
                    dustGrad.addColorStop(0.3, `rgba(255, 200, 150, ${0.12 * comet.brightness})`);
                    dustGrad.addColorStop(1, 'transparent');

                    ctx.beginPath();
                    ctx.moveTo(head.x, head.y);
                    ctx.lineTo(dustEndX, dustEndY);
                    ctx.strokeStyle = dustGrad;
                    ctx.lineWidth = 2.5;
                    ctx.lineCap = 'round';
                    ctx.stroke();

                    // === COMA (fuzzy halo around the head) ===
                    // Outer glow - large, faint
                    const outerGlow = ctx.createRadialGradient(
                        head.x, head.y, 0, head.x, head.y, 45
                    );
                    outerGlow.addColorStop(0, `rgba(180, 220, 255, ${0.15 * comet.brightness})`);
                    outerGlow.addColorStop(0.4, `rgba(140, 190, 255, ${0.06 * comet.brightness})`);
                    outerGlow.addColorStop(1, 'transparent');
                    ctx.fillStyle = outerGlow;
                    ctx.fillRect(head.x - 45, head.y - 45, 90, 90);

                    // Middle glow - warm cyan
                    const midGlow = ctx.createRadialGradient(
                        head.x, head.y, 0, head.x, head.y, 22
                    );
                    midGlow.addColorStop(0, `rgba(200, 240, 255, ${0.5 * comet.brightness})`);
                    midGlow.addColorStop(0.5, `rgba(170, 210, 255, ${0.2 * comet.brightness})`);
                    midGlow.addColorStop(1, 'transparent');
                    ctx.fillStyle = midGlow;
                    ctx.fillRect(head.x - 22, head.y - 22, 44, 44);

                    // Inner glow — bright core bloom
                    const innerGlow = ctx.createRadialGradient(
                        head.x, head.y, 0, head.x, head.y, 10
                    );
                    innerGlow.addColorStop(0, `rgba(255, 255, 255, ${0.9 * comet.brightness})`);
                    innerGlow.addColorStop(0.4, `rgba(220, 240, 255, ${0.5 * comet.brightness})`);
                    innerGlow.addColorStop(1, 'transparent');
                    ctx.fillStyle = innerGlow;
                    ctx.fillRect(head.x - 10, head.y - 10, 20, 20);

                    // === NUCLEUS — bright white-hot core ===
                    ctx.beginPath();
                    ctx.arc(head.x, head.y, 3.5, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 255, 255, ${comet.brightness})`;
                    ctx.fill();

                    // Bright center point
                    ctx.beginPath();
                    ctx.arc(head.x, head.y, 1.5, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 255, 255, ${comet.brightness})`;
                    ctx.fill();
                }
            }
        };

        draw();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', handleResize);
            if (animationRef.current)
                cancelAnimationFrame(animationRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 1,
            }}
        />
    );
};

export default CelestialBackground;
