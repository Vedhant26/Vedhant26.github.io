import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Calendar, Code, Palette, Database, Mail, MapPin, Github, Linkedin, Instagram, Twitter, ExternalLink, Briefcase, GraduationCap, Zap } from 'lucide-react';
import HeroSection from "./components/hero-section"
import IntroTextSection from "./components/intro-text-section"
import MasonryGallerySection from "./components/masonry-gallery-section"
import PageWrapper from '../components/PageWrapper';

export default function NewAboutPage() {
  return (
    <PageWrapper>
      <main className="relative bg-[#0a0a0a] text-white min-h-screen" style={{ paddingTop: 0 }}>
        {/* Hero Portrait with hover effect */}
        <HeroSection />

        {/* Intro Text - Below the portrait */}
        <IntroTextSection />

        {/* Photo Gallery - Square grid */}
        <MasonryGallerySection />

        {/* Content Wrapper */}
        <div className="relative z-10" style={{ backgroundColor: '#0a0a0a' }}>

          {/* Bio Section */}
          <section style={{ padding: 'clamp(3rem, 6vw, 6rem) 1.5rem', background: '#0a0a0a' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ textAlign: 'center', marginBottom: '4rem' }}
              >
                <h2 style={{
                  fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  marginBottom: '1rem',
                  background: 'linear-gradient(135deg, #cc5500, #ffbf00)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  About Me
                </h2>
                <div style={{ width: '80px', height: '4px', background: 'linear-gradient(90deg, #cc5500, #ffbf00)', margin: '0 auto' }}></div>
              </motion.div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '3rem', alignItems: 'center' }}>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h3 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem' }}>Hi, I'm Vedhant Bidari! 👋</h3>
                  <p style={{ fontSize: '1.1rem', color: '#ccc', lineHeight: 1.8, marginBottom: '1rem' }}>
                    A passionate <span style={{ fontWeight: 700, color: '#cc5500' }}>Creative Technologist</span> and
                    <span style={{ fontWeight: 700, color: '#ffbf00' }}> Web Developer</span> crafting next-generation
                    interactive digital experiences with momentum and mastery.
                  </p>
                  <p style={{ color: '#999', lineHeight: 1.8 }}>
                    I specialize in building beautiful, functional web applications using modern technologies.
                    My journey in tech is driven by curiosity, innovation, and a desire to solve real-world problems
                    through elegant code.
                  </p>
                  <div style={{ display: 'flex', gap: '1.5rem', paddingTop: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cc5500' }}>
                      <Code style={{ width: 20, height: 20 }} />
                      <span style={{ fontWeight: 600 }}>Full Stack Developer</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffbf00' }}>
                      <Zap style={{ width: 20, height: 20 }} />
                      <span style={{ fontWeight: 600 }}>Tech Enthusiast</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  style={{ position: 'relative' }}
                >
                  <div style={{
                    aspectRatio: '1 / 1',
                    background: 'linear-gradient(135deg, #cc5500, #ffbf00)',
                    borderRadius: '1.5rem',
                    padding: '3px',
                    boxShadow: '0 20px 60px rgba(204, 85, 0, 0.3)',
                  }}>
                    <div style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '1.5rem',
                      overflow: 'hidden',
                    }}>
                      <img
                        src="/images/vedhant-about.jpeg"
                        alt="Vedhant Bidari"
                        loading="eager"
                        decoding="async"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: '-1rem',
                    right: '-1rem',
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '1rem',
                  }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' }}>✓ Available</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Journey Timeline */}
          <section style={{ padding: 'clamp(3rem, 6vw, 6rem) 1.5rem', background: '#0f0f0f' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  marginBottom: '4rem',
                  textAlign: 'center',
                }}
              >
                My Journey
              </motion.h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {[
                  { year: '2025', icon: <Trophy style={{ width: 24, height: 24 }} />, title: 'Hackathon Champion', desc: 'Won multiple hackathons and coding competitions' },
                  { year: '2023', icon: <GraduationCap style={{ width: 24, height: 24 }} />, title: 'Learning & Building', desc: 'Mastered modern web technologies and frameworks' },
                  { year: '2023', icon: <Code style={{ width: 24, height: 24 }} />, title: 'Started Coding Journey', desc: 'Began exploring web development and programming' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}
                  >
                    <div style={{ flexShrink: 0, width: '60px', textAlign: 'right' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#cc5500' }}>{item.year}</span>
                    </div>
                    <div style={{ flexShrink: 0, marginTop: '2px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #cc5500, #ffbf00)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                      }}>
                        {item.icon}
                      </div>
                    </div>
                    <div style={{ flexGrow: 1, paddingBottom: '2rem', borderLeft: '2px solid #222', paddingLeft: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{item.title}</h3>
                      <p style={{ color: '#999' }}>{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Hall of Fame */}
          <section style={{ padding: 'clamp(3rem, 6vw, 6rem) 1.5rem', background: 'linear-gradient(135deg, #0a0a0a, #1a0a00)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ textAlign: 'center', marginBottom: '4rem' }}
              >
                <Trophy style={{ width: 48, height: 48, margin: '0 auto 1rem', color: '#ffbf00' }} />
                <h2 style={{
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  marginBottom: '1rem',
                }}>
                  Hall of Fame
                </h2>
                <p style={{ fontSize: '1.1rem', color: '#999' }}>Hackathons, Interests & Achievements</p>
              </motion.div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '1.5rem' }}>
                {[
                  { title: '🏆 Hackathon Special Recognition', event: 'Postathon Hackathon 25', place: '1st Place' },
                  { title: '🥈 Runner Up', event: 'Vitaura 25 - Hackathon', place: '2nd Place' },
                  { title: '🎯 Best Project', event: ' Nuclear Reactor Anomaly Detection System', place: 'Top 10' },
                  { title: '⭐  Interested in', event: 'Web Dev & Basketball', place: 'Hobby' },
                  { title: '💡 Creative Solution', event: 'Problem Solving Comp', place: 'Top 3' },
                  { title: '🏆 Capture the flag', event: 'Hit the Hitler', place: 'Top 4' },
                  { title: '🚀 Want to Learn', event: 'Hacking ', place: 'Kali Linux' }
                ].map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      backdropFilter: 'blur(10px)',
                      padding: '1.5rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      transition: 'background 0.3s ease',
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{achievement.title.split(' ')[0]}</div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{achievement.title.substring(3)}</h3>
                    <p style={{ color: '#999', marginBottom: '0.75rem', fontSize: '0.9rem' }}>{achievement.event}</p>
                    <div style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      background: 'rgba(255, 191, 0, 0.15)',
                      color: '#ffbf00',
                      borderRadius: '100px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}>
                      {achievement.place}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Skills & Expertise */}
          <section style={{ padding: 'clamp(3rem, 6vw, 6rem) 1.5rem', background: '#0a0a0a' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  marginBottom: '4rem',
                  textAlign: 'center',
                }}
              >
                Skills & Expertise
              </motion.h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '2rem' }}>
                {[
                  {
                    icon: <Code style={{ width: 32, height: 32 }} />,
                    title: 'Frontend Development',
                    color: '#cc5500',
                    skills: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'JavaScript', 'TypeScript']
                  },
                  {
                    icon: <Database style={{ width: 32, height: 32 }} />,
                    title: 'Backend & APIs',
                    color: '#ffbf00',
                    skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST APIs', 'GraphQL']
                  },
                  {
                    icon: <Palette style={{ width: 32, height: 32 }} />,
                    title: 'Crazy Stuff',
                    color: '#ff6b35',
                    skills: ['Basic Level Hacking', 'Kali Linux', 'Cryptography', 'Phishing', 'Github',]
                  }
                ].map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <div style={{
                      background: category.color,
                      padding: '3px',
                      borderRadius: '12px',
                      marginBottom: '1rem',
                      width: 'fit-content',
                    }}>
                      <div style={{ background: '#0a0a0a', padding: '0.75rem', borderRadius: '10px', color: category.color }}>
                        {category.icon}
                      </div>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>{category.title}</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {category.skills.map((skill) => (
                        <span
                          key={skill}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#1a1a1a',
                            border: '1px solid #333',
                            borderRadius: '100px',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            color: '#ccc',
                            transition: 'border-color 0.3s ease',
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Connect */}
          <section style={{ padding: 'clamp(3rem, 6vw, 6rem) 1.5rem', background: '#0f0f0f' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 style={{
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  marginBottom: '1rem',
                }}>
                  Let's Connect
                </h2>
                <p style={{ fontSize: '1.1rem', color: '#999', marginBottom: '3rem' }}>
                  Find me on these platforms or drop me a message!
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(150px, 100%), 1fr))', gap: '1rem', marginBottom: '3rem' }}>
                  {[
                    { icon: <Mail />, label: 'Email', value: 'Vedhant B', link: 'mailto:vedhantvarnika123@gmail.com', color: '#cc5500' },
                    { icon: <Github />, label: 'GitHub', value: '@vedhant26', link: 'https://github.com/Vedhant26', color: '#333' },
                    { icon: <Linkedin />, label: 'LinkedIn', value: 'Vedhant Bidari', link: 'https://www.linkedin.com/in/vedhant-bidari/', color: '#0077b5' },
                    { icon: <Instagram />, label: 'Instagram', value: '@vedhant', link: 'https://instagram.com/vedhant_26', color: '#e4405f' }
                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        background: social.color,
                        padding: '1.5rem',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        color: '#fff',
                        transition: 'box-shadow 0.3s ease',
                      }}
                    >
                      <div style={{ marginBottom: '0.5rem' }}>
                        {React.cloneElement(social.icon, { style: { width: 28, height: 28, margin: '0 auto' } })}
                      </div>
                      <h3 style={{ fontWeight: 700, marginBottom: '0.25rem', fontSize: '0.95rem' }}>{social.label}</h3>
                      <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>{social.value}</p>
                    </motion.a>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a
                    href="mailto:vedhantvarnika123@gmail.com"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '1rem 2rem',
                      background: '#cc5500',
                      color: '#fff',
                      borderRadius: '100px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    <Mail style={{ width: 18, height: 18 }} />
                    Send Me an Email
                  </a>
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '1rem 2rem',
                      background: 'transparent',
                      border: '2px solid #fff',
                      color: '#fff',
                      borderRadius: '100px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <ExternalLink style={{ width: 18, height: 18 }} />
                    View Resume
                  </a>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Footer */}
          <footer style={{ padding: '2rem 1.5rem', background: '#000', textAlign: 'center', borderTop: '1px solid #111' }}>
            <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '1rem' }}>
              © {new Date().getFullYear()} Vedhant Bidari. Built with React, Tailwind CSS & Framer Motion.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
              {[
                { icon: <Github />, link: 'https://github.com/Vedhant26' },
                { icon: <Linkedin />, link: 'https://www.linkedin.com/in/vedhant-bidari/' },
                { icon: <Twitter />, link: 'https://twitter.com/' },
                { icon: <Instagram />, link: 'https://instagram.com/vedhant_26' }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#666', textDecoration: 'none', transition: 'color 0.3s ease' }}
                >
                  {React.cloneElement(social.icon, { style: { width: 20, height: 20 } })}
                </a>
              ))}
            </div>
          </footer>

        </div>
      </main>
    </PageWrapper>
  )
}
