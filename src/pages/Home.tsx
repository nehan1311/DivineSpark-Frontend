import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring, type Variants } from 'framer-motion';
import Section from '../components/ui/Section';
import Button from '../components/ui/Button';
import styles from './Home.module.css';
import homePageImage from '../assets/home_page_image.jpg';
import { Flower, Activity, Sparkles, ArrowRight } from 'lucide-react';

// Helper for Magnetic Button
const MagneticWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 150, damping: 15 });
    const springY = useSpring(y, { stiffness: 150, damping: 15 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        // Pull strength - adjust 0.2 for stronger/weaker magnet
        x.set((e.clientX - centerX) * 0.2);
        y.set((e.clientY - centerY) * 0.2);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: springX, y: springY, display: 'inline-block' }}
        >
            {children}
        </motion.div>
    );
};

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { scrollY } = useScroll();

    // Parallax logic for hero image
    const parallaxY = useTransform(scrollY, [0, 500], [0, -50]);
    const parallaxScale = useTransform(scrollY, [0, 500], [1, 1.05]);

    // Text Reveal Variants
    const revealVariant: Variants = {
        hidden: { y: "100%" },
        visible: {
            y: "0%",
            transition: { duration: 0.9, ease: [0.25, 1, 0.5, 1] } // Power4.out approx
        }
    };

    // Stagger parent container for text reveal
    const containerVariants: Variants = {
        visible: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    // General Section Entry Variant
    const fadeInUpVariant: Variants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    // Stagger Container for grids
    const staggerContainerVariant: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.1 }
        }
    };

    return (
        <>
            {/* Hero Section */}
            <section className={styles.hero}>
                {/* Mesh Gradient Background */}
                <div className={styles.meshContainer}></div>

                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div className={`flex-between ${styles.heroWrapper}`}>
                        <div className={styles.heroContent}>
                            <motion.h1
                                className={styles.heroTitle}
                                initial="hidden"
                                animate="visible"
                                variants={containerVariants}
                            >
                                {/* Masked Lines */}
                                <span className={styles.mask}>
                                    <motion.span className={styles.maskedText} variants={revealVariant}>Spritual way</motion.span>
                                </span>
                                <span className={styles.mask}>
                                    <motion.span className={styles.maskedText} variants={revealVariant}>transform</motion.span>
                                </span>
                                <span className={styles.mask}>
                                    <motion.span className={styles.maskedText} variants={revealVariant}>your life</motion.span>
                                </span>
                            </motion.h1>

                            <motion.p
                                className={styles.heroSubtitle}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.8 }}
                            >
                                Discover holistic healing and mindful practices designed to restore balance, build inner strength, and support a healthier, more peaceful life.
                            </motion.p>

                            <motion.div
                                className={styles.heroActions}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.0, duration: 0.8 }}
                            >
                                <MagneticWrapper>
                                    <Button size="lg" variant="primary" onClick={() => navigate('/sessions')}>Explore Workshops</Button>
                                </MagneticWrapper>
                            </motion.div>
                        </div>

                        <div className={styles.heroImageWrapper}>
                            <motion.div style={{ y: parallaxY, scale: parallaxScale, width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                                <img
                                    src={homePageImage}
                                    alt="DivineSpark Yoga"
                                    className={styles.heroImage}
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section - Dark Forest Green */}
            <Section bg="dark" className={styles.statsSection}>
                <motion.div
                    className={styles.statsContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainerVariant}
                >
                    <motion.div className={styles.statItem} variants={fadeInUpVariant}>
                        <span className={styles.statNumber}>5000+</span>
                        <span className={styles.statLabel}>Lives Touched</span>
                    </motion.div>
                    <motion.div className={styles.statItem} variants={fadeInUpVariant}>
                        <span className={styles.statNumber}>90%</span>
                        <span className={styles.statLabel}>Critical Care Support</span>
                    </motion.div>
                    <motion.div className={styles.statItem} variants={fadeInUpVariant}>
                        <span className={styles.statNumber}>Across India & Abroad</span>
                        <span className={styles.statLabel}>Workshops & Outreach</span>
                    </motion.div>
                    <motion.div className={styles.statsCta} variants={fadeInUpVariant}>
                        <p>Over the years, our work has reached individuals and communities through healing sessions, meditation practices, and workshops, both locally and internationally.</p>
                        <a href="/about" className={styles.linkCta} onClick={(e) => { e.preventDefault(); navigate('/about'); }}>Learn More</a>
                    </motion.div>
                </motion.div>
            </Section>

            {/* Services Section */}
            <Section className={`${styles.servicesSection} section-padding`}>
                <motion.div
                    className={`flex-between ${styles.sectionHeader}`}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUpVariant}
                >
                    <div style={{ maxWidth: '600px' }}>
                        <h2>Our Services</h2>
                        <p className={styles.sectionDesc}>
                            Whether you’re just beginning your healing journey or looking to deepen your practice, our offerings are thoughtfully designed to guide, support, and inspire you at every step.
                        </p>
                    </div>

                </motion.div>

                <motion.div
                    className={styles.servicesGrid}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainerVariant}
                >
                    <motion.div
                        className={styles.serviceCard}
                        variants={fadeInUpVariant}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className={styles.cardInner}>
                            <motion.div
                                className={styles.iconBox}
                            >
                                <Flower size={32} strokeWidth={1.5} color="currentColor" />
                            </motion.div>
                            <h3 className={styles.serviceTitle}>Healing & Yoga Sessions</h3>
                            <p className={styles.serviceDesc}>Guided sessions that focus on restoring balance, improving well-being, and supporting inner harmony through mindful healing practices.</p>

                            <div className={styles.cardFooter}>
                                <motion.a
                                    href="/about"
                                    onClick={(e) => { e.preventDefault(); navigate('/about'); }}
                                    className={styles.textLink}
                                >
                                    <span>View more</span>
                                    <ArrowRight size={16} className={styles.linkArrow} />
                                </motion.a>
                            </div>
                        </div>
                        <div className={styles.cardAccent} />
                    </motion.div>

                    <motion.div
                        className={styles.serviceCard}
                        variants={fadeInUpVariant}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className={styles.cardInner}>
                            <motion.div
                                className={styles.iconBox}
                            >
                                <Activity size={32} strokeWidth={1.5} color="currentColor" />
                            </motion.div>
                            <h3 className={styles.serviceTitle}>Workshops & Group Programs</h3>
                            <p className={styles.serviceDesc}>Interactive workshops for individuals, children, and communities that introduce healing awareness, mindfulness, and spiritual growth.</p>

                            <div className={styles.cardFooter}>
                                <motion.a
                                    href="/about"
                                    onClick={(e) => { e.preventDefault(); navigate('/about'); }}
                                    className={styles.textLink}
                                >
                                    <span>View more</span>
                                    <ArrowRight size={16} className={styles.linkArrow} />
                                </motion.a>
                            </div>
                        </div>
                        <div className={styles.cardAccent} />
                    </motion.div>

                    <motion.div
                        className={styles.serviceCard}
                        variants={fadeInUpVariant}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className={styles.cardInner}>
                            <motion.div
                                className={styles.iconBox}
                            >
                                <Sparkles size={32} strokeWidth={1.5} color="currentColor" />
                            </motion.div>
                            <h3 className={styles.serviceTitle}>Meditation Practices</h3>
                            <p className={styles.serviceDesc}>Regular meditation sessions designed to cultivate peace, clarity, emotional stability, and collective well-being.</p>

                            <div className={styles.cardFooter}>
                                <motion.a
                                    href="/about"
                                    onClick={(e) => { e.preventDefault(); navigate('/about'); }}
                                    className={styles.textLink}
                                >
                                    <span>View more</span>
                                    <ArrowRight size={16} className={styles.linkArrow} />
                                </motion.a>
                            </div>
                        </div>
                        <div className={styles.cardAccent} />
                    </motion.div>
                </motion.div>
            </Section>


        </>
    );
};

export default Home;
