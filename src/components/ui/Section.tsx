import React from 'react';
import type { ReactNode } from 'react';
import styles from './Section.module.css';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    children: ReactNode;
    bg?: 'default' | 'surface' | 'accent' | 'dark';
    // className and id are included in HTMLAttributes
}

const Section: React.FC<SectionProps> = ({
    children,
    className = '',
    bg = 'default',
    ...props
}) => {
    return (
        <section
            className={`${styles.section} ${styles[bg]} ${className}`}
            {...props}
        >
            <div className="container">
                {children}
            </div>
        </section>
    );
};

export default Section;
