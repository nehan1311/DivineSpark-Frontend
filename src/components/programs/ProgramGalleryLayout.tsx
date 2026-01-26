import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ProgramGallery.module.css';
import type { Program } from '../../types/program.types';

// Inline Icons to match About.tsx style
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

interface ProgramSectionProps {
    program: Program;
    images: string[];
    isReversed: boolean;
}

const ProgramSection: React.FC<ProgramSectionProps> = ({ program, images, isReversed }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleDotClick = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <div className={styles.splitSection}>
            <div className={`${styles.splitGrid} ${isReversed ? styles.reversed : ''}`}>
                {/* Left Panel (Content) */}
                <motion.div
                    className={styles.contentPanel}
                    initial={{ opacity: 0, x: isReversed ? 30 : -30 }} // Animate from right if reversed (text is on right desktop)
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className={styles.textWrapper}>
                        <div className={styles.eyebrow}>EXPLORE OUR PROGRAMS</div>
                        <h2 className={styles.programTitle}>{program.title}</h2>
                        <div className={styles.programDescription}>
                            <p>{program.description}</p>
                        </div>
                        <div className={styles.closingLine}>
                            A journey inward, guided with care and intention.
                        </div>
                    </div>
                </motion.div>

                {/* Right Carousel */}
                <motion.div
                    className={styles.carouselWrapper}
                    initial={{ opacity: 0, x: isReversed ? -30 : 30 }} // Animate from left if reversed (image is on left desktop)
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                >
                    <AnimatePresence mode='wait'>
                        <motion.img
                            key={currentIndex}
                            src={images[currentIndex]}
                            alt={`Slide ${currentIndex + 1}`}
                            className={styles.slideImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                    </AnimatePresence>

                    {/* Navigation */}
                    {images.length > 1 && (
                        <>
                            <button onClick={prevSlide} className={`${styles.navButton} ${styles.prevButton}`} aria-label="Previous Slide">
                                <ChevronLeft size={24} />
                            </button>
                            <button onClick={nextSlide} className={`${styles.navButton} ${styles.nextButton}`} aria-label="Next Slide">
                                <ChevronRight size={24} />
                            </button>

                            {/* Indicators */}
                            <div className={styles.indicators}>
                                {images.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`${styles.indicator} ${idx === currentIndex ? styles.indicatorActive : ''}`}
                                        onClick={() => handleDotClick(idx)}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

interface ProgramGalleryLayoutProps {
    label: string;
    pageTitle: string;
    programs: Program[];
    defaultImages: string[];
    isLoading?: boolean;
}

const ProgramGalleryLayout: React.FC<ProgramGalleryLayoutProps> = ({
    label,
    pageTitle,
    programs,
    defaultImages,
    isLoading = false
}) => {
    if (isLoading) {
        return (
            <div className={styles.galleryWrapper}>
                <div className={styles.loadingContainer}>
                    Loading Program Details...
                </div>
            </div>
        );
    }

    return (
        <div className={styles.galleryWrapper}>
            <div className={styles.meshContainer}></div>

            {/* Header */}
            <motion.div
                className={styles.sectionHeader}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className={styles.overline}>{label}</div>
                <h1 className={styles.mainTitle}>{pageTitle}</h1>
            </motion.div>

            {/* Programs List */}
            <div className={styles.programsContainer}>
                {programs.map((program, index) => {
                    const isReversed = index % 2 !== 0; // Even: Left-Right, Odd: Right-Left (Reverse)
                    // Logic to use program.imageUrl if available, or defaultImages array
                    // Since defaultImages is array and imageUrl is string, we'll use defaultImages or specific logic.
                    // For now, adhere to requirement: "Uses placeholder / random images for now"
                    // We can rotate through defaultImages based on index or just pass them all.
                    // Let's pass the whole set for carousel.
                    return (
                        <ProgramSection
                            key={program.id}
                            program={program}
                            images={defaultImages}
                            isReversed={isReversed}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default ProgramGalleryLayout;
