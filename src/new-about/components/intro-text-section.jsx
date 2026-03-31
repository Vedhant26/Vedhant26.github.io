import React from 'react'
import { motion } from 'framer-motion'

export default function IntroTextSection() {
    return (
        <section style={{
            position: 'relative',
            background: '#0a0a0a',
            color: '#fff',
            padding: '5rem 1.5rem',
            zIndex: 20,
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    style={{ textAlign: 'left' }}
                >
                    <h2 style={{
                        fontSize: 'clamp(3rem, 10vw, 8rem)',
                        fontWeight: 900,
                        lineHeight: 0.95,
                        letterSpacing: '-0.02em',
                        marginBottom: '2.5rem',
                    }}>
                        <span style={{ color: '#fff' }}>Hello,</span>
                        <br />
                        <span style={{ color: '#fff' }}>this is </span>
                        <span style={{ color: '#ffbf00' }}>Vedhant</span>
                        <br />
                        <span style={{ color: '#ffbf00' }}>Bidari</span>
                    </h2>
                    <p style={{
                        fontSize: 'clamp(1.1rem, 2.5vw, 1.75rem)',
                        color: '#ccc',
                        lineHeight: 1.6,
                        fontWeight: 300,
                        maxWidth: '800px',
                    }}>
                        I am a B.Tech Computer Science student from VIT-AP University passionate about building
                        <span style={{ color: '#ffbf00', fontWeight: 500 }}> digital experiences </span>
                        that matter. Blending creativity with code to craft seamless, interactive, and
                        <span style={{ color: '#ffbf00', fontWeight: 500 }}> impactful web solutions.</span>
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
