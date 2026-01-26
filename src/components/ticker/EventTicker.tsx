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
                setEvents(data);
            } catch (error) {
                console.error("Failed to fetch ticker events", error);
                // On error, we can just show empty or previous state, or handle gracefully.
                // For now, if error, it likely stays empty array -> shows static message.
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

    if (loading) {
        // Can render empty or nothing while loading
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

    // Duplicate logic for seamless loop: We need at least 2 full sets for the translateX(-50%) logic to work seamlessly.
    // We will render 2 sets. If the list is short, we might need more clones.
    // For simplicity, we just use 4 clones if < 5 events, otherwise 2.
    const shouldCloneMore = events.length < 5;

    return (
        <div className={styles.tickerWrapper}>
            <div className={styles.tickerTrack}>
                <RenderItems events={events} formatDate={formatDate} formatDuration={formatDuration} />
                <RenderItems events={events} formatDate={formatDate} formatDuration={formatDuration} />
                {shouldCloneMore && (
                    <>
                        <RenderItems events={events} formatDate={formatDate} formatDuration={formatDuration} />
                        <RenderItems events={events} formatDate={formatDate} formatDuration={formatDuration} />
                    </>
                )}
            </div>
        </div>
    );
};

const RenderItems = ({ events, formatDate, formatDuration }: { events: PublicEvent[], formatDate: (d: string) => string, formatDuration: (m: number) => string }) => (
    <>
        {events.map((event, index) => (
            <div key={`${event.id}-${index}`} className={styles.tickerItem}>
                <span className={styles.date}>📅 {formatDate(event.startTime)}</span>
                <span className={styles.separator}>·</span>
                <span>{event.title}</span>
                <span className={styles.separator}>·</span>
                <span>{formatDuration(event.durationMinutes)}</span>
            </div>
        ))}
    </>
);

export default EventTicker;
