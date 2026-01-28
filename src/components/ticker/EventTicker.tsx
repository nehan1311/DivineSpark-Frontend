import React, { useEffect, useState } from 'react';
import styles from './EventTicker.module.css';
import { getPublicEvents } from '../../api/public.api';
import type { PublicEvent } from '../../types/public.types';

const EventTicker: React.FC = () => {
    const [events, setEvents] = useState<PublicEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getPublicEvents();
                if (Array.isArray(data)) {
                    setEvents(data);
                } else {
                    setEvents([]);
                }
            } catch (error) {
                console.error("Failed to fetch ticker events", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const formatDuration = (minutes: number) => {
        if (minutes < 60) {
            return `${minutes} mins`;
        }
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    };

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    };

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();
    };

    if (loading) {
        return <div className={styles.tickerWrapper}></div>;
    }

    if (events.length === 0) {
        return (
            <div className={styles.tickerWrapper}>
                <div className={styles.staticMessage}>
                    ✨ Upcoming workshops & events will be announced here
                </div>
            </div>
        );
    }

    // Ensure enough duplication for seamless scrolling
    const shouldCloneMore = events.length < 5;

    return (
        <div className={styles.tickerWrapper}>
            <div className={styles.tickerTrack}>
                <RenderItems events={events} formatDate={formatDate} formatDuration={formatDuration} formatTime={formatTime} />
                <RenderItems events={events} formatDate={formatDate} formatDuration={formatDuration} formatTime={formatTime} />
                {shouldCloneMore && (
                    <>
                        <RenderItems events={events} formatDate={formatDate} formatDuration={formatDuration} formatTime={formatTime} />
                        <RenderItems events={events} formatDate={formatDate} formatDuration={formatDuration} formatTime={formatTime} />
                    </>
                )}
            </div>
        </div>
    );
};

const RenderItems = ({ events, formatDate, formatDuration, formatTime }: { events: PublicEvent[], formatDate: (d: string) => string, formatDuration: (m: number) => string, formatTime: (d: string) => string }) => (
    <>
        {events.map((event, index) => (
            <div key={`${event.id}-${index}`} className={styles.tickerCard}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardInfo}>📅 {formatDate(event.startTime)}</span>
                    <span className={styles.separator}>•</span>
                    <span className={styles.cardInfo}>⏰ {formatTime(event.startTime)}</span>
                    <span className={styles.separator}>•</span>
                    <span className={styles.cardInfo}>🕒 {formatDuration(event.durationMinutes)}</span>
                </div>
                <div className={styles.cardTitle}>{event.title}</div>
                <div className={styles.cardDescription}>{event.description}</div>
            </div>
        ))}
    </>
);

export default EventTicker;
