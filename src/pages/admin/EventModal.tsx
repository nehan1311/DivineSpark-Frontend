import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import styles from './Admin.module.css'; // Reusing admin styles
import type { AdminEvent, EventRequest } from '../../types/admin.events.types';
import DateTimeInput from './DateTimeInput'; // Assuming this exists as seen in file list

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: EventRequest) => Promise<void>;
    event: AdminEvent | null;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, event }) => {
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<EventRequest>({
        title: '',
        description: '',
        startTime: '',
        durationMinutes: 90
    });

    useEffect(() => {
        if (event) {
            setFormData({
                title: event.title,
                description: event.description,
                startTime: event.startTime,
                durationMinutes: event.durationMinutes
            });
        } else {
            // Reset for new event
            setFormData({
                title: '',
                description: '',
                startTime: '',
                durationMinutes: 90
            });
        }
    }, [event, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.startTime) {
            showToast('Please fill in all required fields.', 'error');
            return;
        }

        // Validate Date Time Format (YYYY-MM-DDTHH:mm)
        const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
        if (!dateTimeRegex.test(formData.startTime)) {
            showToast('Invalid Date or Time format.', 'error');
            return;
        }

        const selectedDate = new Date(formData.startTime);
        const now = new Date();

        if (isNaN(selectedDate.getTime())) {
            showToast('Invalid Date value.', 'error');
            return;
        }

        // Prevent creating events in the past
        if (!event && selectedDate < now) {
            showToast('Cannot create an event in the past.', 'error');
            return;
        }

        if (formData.description.length > 300) {
            showToast('Description must be less than 300 characters.', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            // Default to 1 minute to satisfy potential backend @Min(1) validation
            // while effectively ending the event "immediately" after start for the ticker.
            const durationToSend = (formData.durationMinutes && formData.durationMinutes > 0)
                ? typeof formData.durationMinutes === 'string' ? parseInt(formData.durationMinutes, 10) : formData.durationMinutes
                : 1;

            const payload: EventRequest = {
                title: formData.title,
                description: formData.description,
                // Send standard ISO 8601 with Z (UTC) for OffsetDateTime
                // Removing milliseconds to be safe: "2024-05-10T15:30:00Z"
                startTime: selectedDate.toISOString().split('.')[0] + 'Z',
                durationMinutes: durationToSend
            };

            await onSave(payload);
            onClose();
        } catch (error) {
            // Error handling is done in parent or onSave
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={event ? 'Edit Event' : 'Create Event'}
        >
            <form onSubmit={handleSubmit} className={styles.modalForm}>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Title <span className={styles.required}>*</span></label>
                    <input
                        type="text"
                        className={styles.formInput}
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        maxLength={120}
                        placeholder="e.g. Sound Healing Workshop"
                        required
                    />
                    <small className={styles.helperText}>{formData.title.length}/120</small>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Description</label>
                    <textarea
                        className={styles.formInput}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        maxLength={300}
                        rows={3}
                        placeholder="A guided sound healing experience..."
                        style={{ resize: 'vertical', minHeight: '100px' }}
                    />
                    <small className={styles.helperText}>{formData.description.length}/300</small>
                </div>

                <div className={styles.formRow} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                        <DateTimeInput
                            label="Start Time"
                            name="startTime"
                            value={formData.startTime}
                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            min={new Date().toISOString()}
                            styles={styles}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Duration (mins)</label>
                        <input
                            type="number"
                            className={styles.formInput}
                            value={formData.durationMinutes || ''}
                            onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 0 })}
                            min={0}
                            placeholder="Optional"
                        />
                        <small className={styles.helperText}>e.g. 90 = 1h 30m</small>
                    </div>
                </div>

                <div className={styles.modalActions}>
                    <Button variant="secondary" onClick={onClose} type="button" disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : (event ? 'Update Event' : 'Create Event')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default EventModal;
