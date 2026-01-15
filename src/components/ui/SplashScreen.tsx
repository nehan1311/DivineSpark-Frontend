import React, { useEffect, useState } from 'react';
import styles from './SplashScreen.module.css';
// @ts-ignore
import logo from '../../assets/divinespark logo.jpeg';

interface SplashScreenProps {
    onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        // Keep the splash screen for 2.5 seconds
        const timer = setTimeout(() => {
            setIsFading(true);
        }, 2500);

        // Unmount after fade transition (1s) is complete
        const cleanupTimer = setTimeout(() => {
            onComplete();
        }, 3500);

        return () => {
            clearTimeout(timer);
            clearTimeout(cleanupTimer);
        };
    }, [onComplete]);

    return (
        <div className={`${styles.container} ${isFading ? styles.hidden : ''}`}>
            <div className={styles.content}>
                <img src={logo} alt="DivineSpark Logo" className={styles.logo} />
            </div>
        </div>
    );
};

export default SplashScreen;
