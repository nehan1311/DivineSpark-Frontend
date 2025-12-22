import React from 'react';
import Section from '../components/ui/Section';
import Button from '../components/ui/Button';
import styles from './Home.module.css';

const Home: React.FC = () => {
    return (
        <>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className="container">
                    <div className={`flex-between ${styles.heroWrapper}`}>
                        <div className={styles.heroContent}>
                            <h1 className={styles.heroTitle}>
                                Transform <em>Your Body</em> and Mind
                            </h1>
                            <p className={styles.heroSubtitle}>
                                Join us in transforming your body and mind through our comprehensive yoga and fitness programs.
                            </p>
                            <div className={styles.heroActions}>
                                <Button size="lg" variant="primary">Join Member</Button>
                                <Button size="lg" variant="outline">Start for free</Button>
                            </div>
                        </div>

                        <div className={styles.heroImageWrapper}>
                            {/* Using a placeholder image or a generated asset if available. Using a nice calming yoga image for now. */}
                            <img
                                src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=1000&auto=format&fit=crop"
                                alt="DivineSpark Yoga"
                                className={styles.heroImage}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section - Dark Forest Green */}
            <Section bg="dark" className={styles.statsSection}>
                <div className={styles.statsContainer}>
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>3.2K</span>
                        <span className={styles.statLabel}>World champions</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>1.8%</span>
                        <span className={styles.statLabel}>Runner up champions</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>4.5M</span>
                        <span className={styles.statLabel}>Sea games participation</span>
                    </div>
                    <div className={styles.statsCta}>
                        <p>Once we receive your consult request we match you up with a trainer. This is to ensure that your unique goals align.</p>
                        <a href="#" className={styles.linkCta}>Join Member</a>
                    </div>
                </div>
            </Section>

            {/* Services Section */}
            <Section className="section-padding">
                <div className={`flex-between ${styles.sectionHeader}`}>
                    <div style={{ maxWidth: '500px' }}>
                        <h2>Our Services</h2>
                        <p className={styles.sectionDesc}>
                            Whether you're a beginner or an advanced practitioner, our offerings are designed to inspire and support you.
                        </p>
                    </div>
                    <Button variant="primary">Explore the services</Button>
                </div>

                <div className={`grid-cols-2 ${styles.servicesGrid}`}>
                    <div className={styles.serviceCard}>
                        <div className={styles.iconBox}>🧘</div>
                        <h3>Yoga Classes</h3>
                        <p>Classes for all levels, from beginners to advanced. Enjoy various styles like Hatha, Vinyasa, and Yin Yoga.</p>
                        <a href="#" className={styles.textLink}>View more →</a>
                    </div>
                    <div className={styles.serviceCard}>
                        <div className={styles.iconBox}>💪</div>
                        <h3>Fitness Training</h3>
                        <p>Our expert trainers offer customized workouts and ongoing support for weight loss, muscle building, and health.</p>
                        <a href="#" className={styles.textLink}>View more →</a>
                    </div>
                    <div className={styles.serviceCard}>
                        <div className={styles.iconBox}>♡</div>
                        <h3>Wellness Workshops</h3>
                        <p>Workshops on mindfulness, stress management, and holistic health. Gain valuable insights and practical tools.</p>
                        <a href="#" className={styles.textLink}>View more →</a>
                    </div>
                </div>
            </Section>

            {/* Team Section */}
            <Section bg="surface">
                <div className={styles.sectionHeader}>
                    <span className={styles.overline}>OUR TEAM</span>
                    <h2>Meet Our Team</h2>
                </div>

                <div className={styles.teamGrid}>
                    <div className={`${styles.teamCard} ${styles.teamCardLarge}`}>
                        <div className={styles.teamContent}>
                            <span className={styles.overline}>JOIN THE TEAM</span>
                            <h3>Personalized Coaching</h3>
                            <p>One-on-one sessions with our fitness and yoga experts, get personalized guidance.</p>
                        </div>
                    </div>
                    <img src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=500" alt="Team member" className={styles.teamImg} />
                    <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=500" alt="Team member" className={styles.teamImg} />
                    <img src="https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&w=500" alt="Team member" className={styles.teamImg} />
                </div>
            </Section>
        </>
    );
};

export default Home;
