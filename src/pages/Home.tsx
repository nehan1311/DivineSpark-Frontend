import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring, type Variants } from 'framer-motion';
import Section from '../components/ui/Section';
import Button from '../components/ui/Button';
import styles from './Home.module.css';
import homePageImage from '../assets/home_page_image.jpg';

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
                                    <motion.span className={styles.maskedText} variants={revealVariant}>Transform</motion.span>
                                </span>
                                <span className={styles.mask}>
                                    <motion.span className={styles.maskedText} variants={revealVariant}>Your Body</motion.span>
                                </span>
                                <span className={styles.mask}>
                                    <motion.span className={styles.maskedText} variants={revealVariant}>and Mind</motion.span>
                                </span>
                            </motion.h1>

                            <motion.p
                                className={styles.heroSubtitle}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.8 }}
                            >
                                Join us in transforming your body and mind through our comprehensive yoga and fitness programs.
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
                        <span className={styles.statNumber}>3.2K</span>
                        <span className={styles.statLabel}>World champions</span>
                    </motion.div>
                    <motion.div className={styles.statItem} variants={fadeInUpVariant}>
                        <span className={styles.statNumber}>1.8%</span>
                        <span className={styles.statLabel}>Runner up champions</span>
                    </motion.div>
                    <motion.div className={styles.statItem} variants={fadeInUpVariant}>
                        <span className={styles.statNumber}>4.5M</span>
                        <span className={styles.statLabel}>Sea games participation</span>
                    </motion.div>
                    <motion.div className={styles.statsCta} variants={fadeInUpVariant}>
                        <p>Once we receive your consult request we match you up with a trainer. This is to ensure that your unique goals align.</p>
                        <a href="#" className={styles.linkCta}>Join Member</a>
                    </motion.div>
                </motion.div>
            </Section>

            {/* Services Section */}
            <Section className="section-padding">
                <motion.div
                    className={`flex-between ${styles.sectionHeader}`}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUpVariant}
                >
                    <div style={{ maxWidth: '500px' }}>
                        <h2>Our Services</h2>
                        <p className={styles.sectionDesc}>
                            Whether you're a beginner or an advanced practitioner, our offerings are designed to inspire and support you.
                        </p>
                    </div>
                    <Button variant="primary">Explore the services</Button>
                </motion.div>

                <motion.div
                    className={`grid-cols-2 ${styles.servicesGrid}`}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainerVariant}
                >
                    <motion.div className={styles.serviceCard} variants={fadeInUpVariant}>
                        <div className={styles.iconBox}>🧘</div>
                        <h3>Yoga Classes</h3>
                        <p>Classes for all levels, from beginners to advanced. Enjoy various styles like Hatha, Vinyasa, and Yin Yoga.</p>
                        <a href="#" className={styles.textLink}>View more →</a>
                    </motion.div>
                    <motion.div className={styles.serviceCard} variants={fadeInUpVariant}>
                        <div className={styles.iconBox}>💪</div>
                        <h3>Fitness Training</h3>
                        <p>Our expert trainers offer customized workouts and ongoing support for weight loss, muscle building, and health.</p>
                        <a href="#" className={styles.textLink}>View more →</a>
                    </motion.div>
                    <motion.div className={styles.serviceCard} variants={fadeInUpVariant}>
                        <div className={styles.iconBox}>♡</div>
                        <h3>Wellness Workshops</h3>
                        <p>Workshops on mindfulness, stress management, and holistic health. Gain valuable insights and practical tools.</p>
                        <a href="#" className={styles.textLink}>View more →</a>
                    </motion.div>
                </motion.div>
            </Section>

            {/* Team Section */}
            <Section bg="surface">
                <motion.div
                    className={styles.sectionHeader}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUpVariant}
                >
                    <span className={styles.overline}>OUR TEAM</span>
                    <h2>Meet Our Team</h2>
                </motion.div>

                <motion.div
                    className={styles.teamGrid}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainerVariant}
                >
                    <motion.div className={`${styles.teamCard} ${styles.teamCardLarge}`} variants={fadeInUpVariant}>
                        <div className={styles.teamContent}>
                            <span className={styles.overline}>JOIN THE TEAM</span>
                            <h3>Personalized Coaching</h3>
                            <p>One-on-one sessions with our fitness and yoga experts, get personalized guidance.</p>
                        </div>
                    </motion.div>
                    <motion.img src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=500" alt="Team member" className={styles.teamImg} variants={fadeInUpVariant} />
                    <motion.img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=500" alt="Team member" className={styles.teamImg} variants={fadeInUpVariant} />
                    <motion.img src="https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&w=500" alt="Team member" className={styles.teamImg} variants={fadeInUpVariant} />
                </motion.div>
            </Section>
        </>
    );
};

export default Home;
