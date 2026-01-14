import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import styles from './RetreatContentSection.module.css';

const CONTENT = [
    {
        title: "Every Arhatic Yoga Retreat is a Time for Renewal.",
        subtitle: "\"The purpose of the retreat is to purify your vehicles, to recharge your body, and to clarify your mind. It is a sacred time to reconnect with your higher soul and the divine spark within.\"",
        author: "— Grand Master Choa Kok Sui",
        img: "https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=800&q=80",
        alt: "Meditation Retreat"
    },
    {
        title: "Immerse Yourself in Divine Energy.",
        subtitle: "Experience the profound stillness of nature combined with intensive spiritual practice. Our retreats are designed to accelerate your development in a safe, nurturing environment surrounded by like-minded souls.",
        author: null,
        img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
        alt: "Nature Yoga"
    },
    {
        title: "A Journey Back to Your True Self.",
        subtitle: "Leave behind the noise of the daily world. Step into a space of serenity where you can focus entirely on your inner growth, healing, and spiritual realization.",
        author: null,
        img: "https://images.unsplash.com/photo-1599447421405-0c174ac25163?auto=format&fit=crop&w=800&q=80",
        alt: "Peaceful Moment"
    }
];

const RetreatContentSection: React.FC = () => {
    const shouldReduceMotion = useReducedMotion();

    // Section Entrance
    const sectionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    } as const;

    // Text Container (Lateral Motion)
    const textColVariants = {
        hidden: (direction: number) => ({
            opacity: shouldReduceMotion ? 1 : 0,
            x: shouldReduceMotion ? 0 : direction
        }),
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                staggerChildren: 0.15,
                delayChildren: 0.2 // Wait for image slightly
            }
        }
    } as const;

    // Text Items (Vertical Motion + Fade)
    const textItemVariants = {
        hidden: {
            opacity: shouldReduceMotion ? 1 : 0,
            y: shouldReduceMotion ? 0 : 16
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    } as const;

    // Quote (Fade Only)
    const quoteVariants = {
        hidden: { opacity: shouldReduceMotion ? 1 : 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.5, delay: 0.2, ease: "easeOut" }
        }
    } as const;

    // Image (Scale + Lift + Lateral)
    const imageVariants = {
        hidden: (direction: number) => ({
            opacity: shouldReduceMotion ? 1 : 0,
            scale: shouldReduceMotion ? 1 : 0.96,
            y: shouldReduceMotion ? 0 : 12,
            x: shouldReduceMotion ? 0 : direction,
            boxShadow: shouldReduceMotion ? "0 16px 48px rgba(26, 60, 52, 0.12)" : "0 2px 8px rgba(26, 60, 52, 0.04)"
        }),
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            x: 0,
            boxShadow: "0 16px 48px rgba(26, 60, 52, 0.12)",
            transition: {
                duration: 0.7,
                ease: "easeOut"
            }
        }
    } as const;

    return (
        <motion.section
            className={styles.section}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={shouldReduceMotion ? {} : sectionVariants}
        >
            <div className={styles.inner}>
                {CONTENT.map((item, index) => {
                    const isEven = index % 2 !== 0; // Index 1 is even-child (2nd)

                    // Odd Block (Index 0): Text Left (-20), Image Right (20)
                    // Even Block (Index 1): textContent order: 2 (Right), Image order: 1 (Left)
                    // Wait, CSS order changes visual position.
                    // Index 0: Text is Left (Visual). Comes from Left. X = -20.
                    // Index 1: Text is Right (Visual). Comes from Right. X = 20.
                    const textDirection = isEven ? 20 : -20;
                    const imgDirection = isEven ? -20 : 20; // Opposite

                    return (
                        <motion.div
                            key={index}
                            className={styles.pblock}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.4 }}
                        >
                            {/* Text Column */}
                            <motion.div
                                className={styles.textContent}
                                custom={textDirection}
                                variants={textColVariants}
                            >
                                <motion.h2 className={styles.title} variants={textItemVariants}>
                                    {item.title}
                                </motion.h2>
                                <motion.p className={styles.subtitle} variants={textItemVariants}>
                                    {item.subtitle}
                                </motion.p>
                                {item.author && (
                                    <motion.span className={styles.author} variants={quoteVariants}>
                                        {item.author}
                                    </motion.span>
                                )}
                            </motion.div>

                            {/* Image Column */}
                            <motion.div
                                className={styles.imageWrapper}
                                custom={imgDirection}
                                variants={imageVariants}
                            >
                                <img
                                    src={item.img}
                                    alt={item.alt}
                                    className={styles.image}
                                />
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.section>
    );
};

export default RetreatContentSection;
