import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import Section from '../components/ui/Section';
import styles from './About.module.css';

// SVGs
const LotusIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21c-2.8 0-5.1-2.3-5.1-5.1 0-2.8 5.1-9.9 5.1-9.9s5.1 7.1 5.1 9.9c0 2.8-2.3 5.1-5.1 5.1z" /><path d="M12 21c4.2 0 7.6-3.4 7.6-7.6 0-4.2-7.6-11.4-7.6-11.4S4.4 9.2 4.4 13.4c0 4.2 3.4 7.6 7.6 7.6z" /><path d="M12 8c2.1 0 3.8-1.7 3.8-3.8 0-2.1-1.7-3.8-3.8-3.8S8.2 2.1 8.2 4.2 9.9 8 12 8z" /></svg>
);
const SunIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2" /><path d="M12 21v2" /><path d="M4.22 4.22l1.42 1.42" /><path d="M18.36 18.36l1.42 1.42" /><path d="M1 12h2" /><path d="M21 12h2" /><path d="M4.22 19.78l1.42-1.42" /><path d="M18.36 5.64l1.42-1.42" /></svg>
);
const HeartIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
);
const LeafIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.77 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
);

const About: React.FC = () => {
    // Animation Variants
    const fadeUp: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.meshContainer}></div>

            {/* 1. HERO BANNER - Reference Style */}
            <div className={styles.heroSection}>
                <div className={styles.heroBackground}>
                    <div className={styles.heroOverlay}></div>
                </div>

                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>About Us</h1>
                    <div className={styles.breadcrumbs}>
                        <Link to="/" className={styles.breadcrumbLink}>Home</Link>
                        <span className={styles.breadcrumbSeparator}>/</span>
                        <Link to="/contact" className={styles.breadcrumbLink}>Contact</Link>
                    </div>
                </div>
            </div>

            {/* 2. WELCOME / STORY - Split Layout */}
            <Section className={styles.welcomeSection}>
                <motion.div
                    className={styles.welcomeGrid}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                >
                    {/* Image Left */}
                    <motion.div className={styles.welcomeImageWrapper} variants={fadeUp}>
                        <img
                            src="https://images.unsplash.com/photo-1599447291135-26038df8df43?q=80&w=1000&auto=format&fit=crop"
                            alt="Welcome to DivineSpark"
                            className={styles.welcomeImage}
                        />
                    </motion.div>

                    {/* Content Right */}
                    <motion.div className={styles.welcomeContent} variants={fadeUp}>
                        {/* Header with Line */}
                        <div className={styles.sectionHeader}>
                            <div className={styles.headerLine}></div>
                            <span className={styles.overline}>ABOUT US</span>
                            <div className={styles.headerLine}></div>
                        </div>

                        <h2 className={styles.heading}>Welcome to <span className={styles.highlightText}>DivineSpark</span></h2>

                        <p className={styles.bodyText}>
                            At DivineSpark — Holistic Healing, we believe that true healing begins from within.
                            In today's fast-paced world, finding a moment of peace can feel impossible.
                            We created this sanctuary to be that pause—a space where you can reconnect with your breath, your body, and your spirit.
                        </p>
                        <p className={styles.bodyText}>
                            Founded in 2020 by XYZ, our community has grown from a small meditation circle into a comprehensive holistic center offering yoga, energy work, and spiritual guidance.
                        </p>

                        <div className={styles.statsRow}>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>10+</span>
                                <span className={styles.statLabel}>Years Exp.</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>3K+</span>
                                <span className={styles.statLabel}>Happy Clients</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>25+</span>
                                <span className={styles.statLabel}>Expert Guides</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </Section>

            {/* 3. CORE VALUES - 4 Cards Grid */}
            <Section bg="surface" className={styles.valuesSection}>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    style={{ textAlign: 'center', marginBottom: '3rem' }}
                >
                    <span className={styles.overline}>OUR PHILOSOPHY</span>
                    <h2 className={styles.heading} style={{ marginTop: '0.5rem' }}>Why Choose Us?</h2>
                </motion.div>

                <motion.div
                    className={styles.valuesGrid}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                >
                    <motion.div className={styles.valueCard} variants={fadeUp}>
                        <div className={styles.iconBox}><LotusIcon /></div>
                        <h4>Holistic Approach</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-body)' }}>Integrating mind, body, and spirit for complete wellness.</p>
                    </motion.div>

                    <motion.div className={styles.valueCard} variants={fadeUp}>
                        <div className={styles.iconBox}><HeartIcon /></div>
                        <h4>Compassionate Care</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-body)' }}>Every session is held with deep empathy and non-judgment.</p>
                    </motion.div>

                    <motion.div className={styles.valueCard} variants={fadeUp}>
                        <div className={styles.iconBox}><SunIcon /></div>
                        <h4>Experienced Guides</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-body)' }}>Certified practitioners with decades of combined experience.</p>
                    </motion.div>

                    <motion.div className={styles.valueCard} variants={fadeUp}>
                        <div className={styles.iconBox}><LeafIcon /></div>
                        <h4>Natural Healing</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-body)' }}>Using the power of nature and energy to restore balance.</p>
                    </motion.div>
                </motion.div>
            </Section>

        </div>
    );
};

export default About;
