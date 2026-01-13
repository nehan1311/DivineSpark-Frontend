import React from 'react';
import styles from './RetreatContentSection.module.css';

const RetreatContentSection: React.FC = () => {
    return (
        <section className={styles.section}>
            <div className={styles.inner}>

                {/* Block 1 */}
                <div className={styles.pblock}>
                    <div className={styles.textContent}>
                        <h2 className={styles.title}>
                            Every Arhatic Yoga Retreat is a Time for Renewal.
                        </h2>
                        <p className={styles.subtitle}>
                            "The purpose of the retreat is to purify your vehicles, to recharge your body, and to clarify your mind. It is a sacred time to reconnect with your higher soul and the divine spark within."
                        </p>
                        <span className={styles.author}>— Grand Master Choa Kok Sui</span>
                    </div>
                    <div className={styles.imageWrapper}>
                        <img
                            src="https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=800&q=80"
                            alt="Meditation Retreat"
                            className={styles.image}
                        />
                    </div>
                </div>

                {/* Block 2 */}
                <div className={styles.pblock}>
                    <div className={styles.textContent}>
                        <h2 className={styles.title}>
                            Immerse Yourself in Divine Energy.
                        </h2>
                        <p className={styles.subtitle}>
                            Experience the profound stillness of nature combined with intensive spiritual practice. Our retreats are designed to accelerate your development in a safe, nurturing environment surrounded by like-minded souls.
                        </p>
                    </div>
                    <div className={styles.imageWrapper}>
                        <img
                            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"
                            alt="Nature Yoga"
                            className={styles.image}
                        />
                    </div>
                </div>

                {/* Block 3 */}
                <div className={styles.pblock}>
                    <div className={styles.textContent}>
                        <h2 className={styles.title}>
                            A Journey Back to Your True Self.
                        </h2>
                        <p className={styles.subtitle}>
                            Leave behind the noise of the daily world. Step into a space of serenity where you can focus entirely on your inner growth, healing, and spiritual realization.
                        </p>
                    </div>
                    <div className={styles.imageWrapper}>
                        <img
                            src="https://images.unsplash.com/photo-1599447421405-0c174ac25163?auto=format&fit=crop&w=800&q=80"
                            alt="Peaceful Moment"
                            className={styles.image}
                        />
                    </div>
                </div>

            </div>
        </section>
    );
};

export default RetreatContentSection;
