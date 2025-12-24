import React, { useEffect } from 'react';
import styles from './Toast.module.css';

export interface ToastMessage {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
}

interface ToastProps extends ToastMessage {
    onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, duration = 3000, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, duration);

        return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    return (
        <div className={`${styles.toast} ${styles[type]}`}>
            <span>{message}</span>
            <button className={styles.closeButton} onClick={() => onClose(id)}>
                &times;
            </button>
        </div>
    );
};

export default Toast;
