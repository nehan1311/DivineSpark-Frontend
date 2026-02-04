import React from 'react';
import styles from './Admin.module.css';
import type { AdminEvent } from '../../types/admin.events.types';
import { formatFullDateTime } from '../../utils/format';

interface EventsTableProps {
    events: AdminEvent[];
    onEdit: (event: AdminEvent) => void;
    onDelete: (event: AdminEvent) => void;
    isLoading: boolean;
}

const AdminEvents: React.FC<EventsTableProps> = ({ events, onEdit, onDelete, isLoading }) => {

    const getStatus = (event: AdminEvent) => {
        const start = new Date(event.startTime).getTime();
        const end = start + (event.durationMinutes * 60 * 1000);
        const now = Date.now();
        return end > now ? 'UPCOMING' : 'COMPLETED';
    };

    if (isLoading) {
        return <div className={styles.loadingState}>Loading events...</div>;
    }

    if (events.length === 0) {
        return <div className={styles.emptyState}>No events found.</div>;
    }

    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Ticker Events</h3>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th style={{ maxWidth: '300px' }}>Description</th>
                        <th>Start Time</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map(event => {
                        const status = getStatus(event);
                        const durationText = event.durationMinutes < 60
                            ? `${event.durationMinutes} mins`
                            : `${Math.floor(event.durationMinutes / 60)}h ${event.durationMinutes % 60}m`;

                        return (
                            <tr key={event.id}>
                                <td data-label="Title">{event.title}</td>
                                <td data-label="Description" style={{ maxWidth: '300px' }} className={styles.truncateCell} title={event.description}>
                                    {event.description}
                                </td>
                                <td data-label="Start Time">{formatFullDateTime(event.startTime)}</td>
                                <td data-label="Duration">{durationText}</td>
                                <td data-label="Status">
                                    <span className={`${styles.badge} ${status === 'UPCOMING' ? styles.badgeSuccess : styles.badgeNeutral}`}>
                                        {status}
                                    </span>
                                </td>
                                <td data-label="Actions">
                                    <button className={styles.actionBtn} onClick={() => onEdit(event)}>Edit</button>
                                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => onDelete(event)}>Delete</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default AdminEvents;
