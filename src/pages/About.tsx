import React, { useCallback } from 'react';
// Lucide icons replaced with inline SVGs to avoid restart issues
const ChevronLeft = ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 18-6-6 6-6" />
    </svg>
);

const ChevronRight = ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 18 6-6-6-6" />
    </svg>
);
import { motion, type Variants, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Section from '../components/ui/Section';
import styles from './About.module.css';
import founderImg from '../assets/download (4).jpg';
import slide1Img from '../assets/slide-1.png';
import slide2Img from '../assets/slide-2.png';
import slide3Img from '../assets/slide-3.png';
import slide4Img from '../assets/slide-4.png';
import slide5Img from '../assets/slide-5.png';
import slide6Img from '../assets/slide-6.png';
import slide7Img from '../assets/slide-7.png';

// SVGs removed as they are no longer used in the layout

// Carousel Data
const carouselSlides = [
    {
        id: 1,
        image: slide1Img,
    },
    {
        id: 2,
        image: slide2Img,
    },
    {
        id: 3,
        image: slide3Img,
    },
    {
        id: 4,
        image: slide4Img,
    },
    {
        id: 5,
        image: slide5Img,
    },
    {
        id: 6,
        image: slide6Img,
    },
    {
        id: 7,
        image: slide7Img,
    }
];

const About: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev === 0 ? carouselSlides.length - 1 : prev - 1));
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    // Animation Variants
    const fadeUp: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const slideVariants: Variants = {
        enter: { opacity: 0, x: 50 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 }
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
                            alt="DivineSpark Center"
                            className={styles.welcomeImage}
                        />
                    </motion.div>

                    {/* Content Right */}
                    <motion.div className={styles.welcomeContent} variants={fadeUp}>
                        {/* Header with Line */}
                        <div className={styles.sectionHeader}>
                            <div className={styles.headerLine}></div>
                            <span className={styles.overline}>PUNE, INDIA</span>
                            <div className={styles.headerLine}></div>
                        </div>

                        <h2 className={styles.heading}><span className={styles.highlightText}>DivineSpark</span></h2>

                        <p className={styles.bodyText}>
                            Feed The Soul’s is an energy-based healing center focused on holistic wellbeing through ancient healing practices that work with life force energy.
                        </p>
                        <p className={styles.bodyText}>
                            The approach is completely non-invasive, involving no touch and no medication, and aims to improve immunity, health, happiness, and inner balance.
                        </p>
                    </motion.div>
                </motion.div>
            </Section>

            {/* 2. FOUNDER / HEALER INTRODUCTION */}
            <Section>
                <motion.div
                    className={styles.welcomeGrid}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                >
                    {/* Content Left */}
                    <motion.div className={styles.welcomeContent} variants={fadeUp}>
                        {/* Header with Line */}
                        <div className={styles.sectionHeader}>
                            <div className={styles.headerLine}></div>
                            <span className={styles.overline}>FOUNDER & HEALER</span>
                            <div className={styles.headerLine}></div>
                        </div>

                        <h2 className={styles.heading}>Meet <span className={styles.highlightText}>Suvir Sabnis</span></h2>
                        <h4 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', fontWeight: 600 }}>Healer & Trainer</h4>

                        <p className={styles.bodyText}>
                            Practicing energy healing since the age of 24, Suvir has helped thousands of people through healing. Nearly 90% of cases handled were critical (ICU-level), demonstrating the power of these ancient practices.
                        </p>
                        <p className={styles.bodyText}>
                            Committed to the well-being of society, the majority of his healing sessions are offered free of cost.
                        </p>

                        <div className={styles.statsRow}>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>24+</span>
                                <span className={styles.statLabel}>Years Practice</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>3000+</span>
                                <span className={styles.statLabel}>Lives Healed</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>90%</span>
                                <span className={styles.statLabel}>Critical Cases</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Image Right */}
                    <motion.div className={styles.welcomeImageWrapper} variants={fadeUp}>
                        <img
                            src={founderImg}
                            alt="Suvir Sabnis"
                            className={styles.welcomeImage}
                        />
                    </motion.div>
                </motion.div>
            </Section>

            {/* 3. HEALING PHILOSOPHY */}
            <Section bg="surface">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}
                >
                    <div className={styles.sectionHeader} style={{ justifyContent: 'center' }}>
                        <div className={styles.headerLine}></div>
                        <span className={styles.overline}>PHILOSOPHY</span>
                        <div className={styles.headerLine}></div>
                    </div>
                    <h2 className={styles.heading} style={{ marginBottom: '1.5rem' }}>Our Vision</h2>
                    <p className={styles.bodyText} style={{ fontSize: '1.1rem', textAlign: 'center' }}>
                        “Feed The Soul energy healing is an ancient art and science of healing that works with life force energy. It is a no-touch, no-drug therapy designed to help individuals build immunity, maintain good health, and live a happy, peaceful life.”
                    </p>
                </motion.div>
            </Section>

            {/* 4. WORKSHOPS & OUTREACH (Gallery) */}
            <Section className={styles.valuesSection}>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    style={{ textAlign: 'center', marginBottom: '3rem' }}
                >
                    <span className={styles.overline}>GALLERY</span>
                    <h2 className={styles.heading} style={{ marginTop: '0.5rem' }}>Workshops & Outreach</h2>
                </motion.div>

                <motion.div
                    className={styles.carouselContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            className={styles.carouselSlide}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                        >
                            <img
                                src={carouselSlides[currentSlide].image}
                                className={styles.slideImage}
                            />
                            <div className={styles.slideOverlay}>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        style={{
                            position: 'absolute',
                            left: '20px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(4px)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            cursor: 'pointer',
                            zIndex: 10,
                            transition: 'background-color 0.3s'
                        }}
                        className="hover:bg-white/40"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <button
                        onClick={nextSlide}
                        style={{
                            position: 'absolute',
                            right: '20px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(4px)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            cursor: 'pointer',
                            zIndex: 10,
                            transition: 'background-color 0.3s'
                        }}
                        className="hover:bg-white/40"
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Indicators */}
                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        right: '30px',
                        display: 'flex',
                        gap: '8px',
                        zIndex: 10
                    }}>
                        {carouselSlides.map((_slide, index) => (
                            <div
                                key={index}
                                style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    backgroundColor: index === currentSlide ? 'white' : 'rgba(255,255,255,0.4)',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s'
                                }}
                                onClick={() => setCurrentSlide(index)}
                            />
                        ))}
                    </div>
                </motion.div>
            </Section>

            {/* 5. REGULAR MEDITATION ACTIVITY */}
            <Section bg="surface">
                <motion.div
                    className={styles.welcomeGrid}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                >
                    <motion.div className={styles.welcomeContent} variants={fadeUp}>
                        <h2 className={styles.heading}>Meditation on Peace & Illumination</h2>
                        <p className={styles.bodyText}>
                            Every Sunday, we conduct a guided meditation session focused on peace and illumination. This session is open for all and encourages collective healing and inner harmony.
                        </p>
                    </motion.div>
                    <motion.div className={styles.welcomeImageWrapper} variants={fadeUp}>
                        <img
                            src="https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?q=80&w=1000&auto=format&fit=crop"
                            alt="Meditation"
                            className={styles.welcomeImage}
                        />
                    </motion.div>
                </motion.div>
            </Section>

            {/* 6. MISSION / PURPOSE STATEMENT */}
            <Section>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', padding: '2rem 0' }}
                >
                    <div className={styles.sectionHeader} style={{ justifyContent: 'center' }}>
                        <div className={styles.headerLine}></div>
                        <span className={styles.overline}>OUR MISSION</span>
                        <div className={styles.headerLine}></div>
                    </div>
                    <h2 className={styles.heading} style={{ marginBottom: '1.5rem' }}>Spreading Happiness</h2>
                    <p className={styles.bodyText} style={{ fontSize: '1.2rem', textAlign: 'center', fontStyle: 'italic' }}>
                        “The main purpose of our life is to spread happiness. Our mission is to teach energy healing to as many people as possible and contribute to a peaceful, healthy, and joyful society.”
                    </p>
                </motion.div>
            </Section>

        </div>
    );
};

export default About;
