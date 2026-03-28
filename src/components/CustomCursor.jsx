import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './CustomCursor.css';

const CustomCursor = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // "Chasing" physics: Lower stiffness/damping makes it lag more gracefully behind the actual point
    const springConfig = { damping: 20, stiffness: 150, mass: 0.8 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    // Instant follower for the "target" dot
    const dotX = useMotionValue(-100);
    const dotY = useMotionValue(-100);

    useEffect(() => {
        // Detect touch device
        const isTouch = window.matchMedia('(hover: none)').matches || 'ontouchstart' in window;
        setIsTouchDevice(isTouch);
        if (isTouch) return;

        let rafId = null;
        let latestX = -100;
        let latestY = -100;

        const updateCursorPosition = () => {
            cursorX.set(latestX - 24);
            cursorY.set(latestY - 24);
            dotX.set(latestX - 4);
            dotY.set(latestY - 4);
            rafId = null;
        };

        const moveCursor = (e) => {
            latestX = e.clientX;
            latestY = e.clientY;
            if (!rafId) {
                rafId = requestAnimationFrame(updateCursorPosition);
            }
        };

        const handleMouseOver = (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
                setIsHovered(true);
            } else {
                setIsHovered(false);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [cursorX, cursorY, dotX, dotY]);

    // Don't render on touch devices
    if (isTouchDevice) return null;

    return (
        <>
            <motion.div
                className="cursor-dot"
                style={{ translateX: dotX, translateY: dotY }}
            />
            <motion.div
                className={`custom-cursor ${isHovered ? 'hovered' : ''}`}
                style={{
                    translateX: cursorXSpring,
                    translateY: cursorYSpring,
                }}
            >
                <div className="basketball-graphic">
                    <div className="line horizontal"></div>
                    <div className="line vertical"></div>
                    <div className="line curve-1"></div>
                    <div className="line curve-2"></div>
                </div>
            </motion.div>
        </>
    );
};

export default CustomCursor;

