import React, { useState, useEffect } from 'react';
import type { AdminSession } from '../../types/admin.types';
import Button from '../../components/ui/Button';
import styles from './SessionModal.module.css';

interface SessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (session: Partial<AdminSession>) => Promise<void>;
    session: AdminSession | null; // If null, create mode
}

const SessionModal: React.FC<SessionModalProps> = ({ isOpen, onClose, onSave, session }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    // Form State
    const [formData, setFormData] = useState<Partial<AdminSession>>({
        title: '',
        description: '',
        type: 'FREE',
        price: 0,
        guideName: '',
        startTime: '',
        endTime: '',
        maxSeats: 50,
        availableSeats: 50,
        zoomLink: '',
    });

    useEffect(() => {
        setError(null);
        setFieldErrors({}); // Clear field errors on modal open/close or session change
        if (session) {
            // Edit Mode
            setFormData({
                ...session,
                startTime: session.startTime ? new Date(session.startTime).toISOString().slice(0, 16) : '',
                endTime: session.endTime ? new Date(session.endTime).toISOString().slice(0, 16) : '',
            });
        } else {
            // Reset for Create Mode
            setFormData({
                title: '',
                description: '',
                type: 'FREE',
                price: 0,
                guideName: '',
                startTime: '',
                endTime: '',
                maxSeats: 50,
                availableSeats: 50,
                zoomLink: '',
            });
        }
    }, [session, isOpen]);

    // Helpers
    const getLocalNow = () => {
        const now = new Date();
        // Adjust for local timezone offset to get a "local" ISO string
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    const getMinEndTime = (startStr: string) => {
        if (!startStr) return '';
        const date = new Date(startStr); // This will parse startStr as local time
        if (isNaN(date.getTime())) return '';

        // Add 30 minutes
        date.setMinutes(date.getMinutes() + 30);

        // The `datetime-local` input expects a string in the format "YYYY-MM-DDTHH:mm"
        // which represents local time. `toISOString()` converts to UTC.
        // To get the local time string from the adjusted date object, we need to
        // manually adjust for the timezone offset before slicing.
        const offset = date.getTimezoneOffset() * 60000; // offset in milliseconds
        const localDate = new Date(date.getTime() - offset);
        return localDate.toISOString().slice(0, 16);
    };

    const minStartTime = getLocalNow();
    const minEndTime = getMinEndTime(formData.startTime || '');

    const validateField = (name: string, value: any, currentFormData: Partial<AdminSession>) => {
        let err = '';
        const now = new Date();

        if (name === 'startTime') {
            const start = new Date(value);
            if (value && start < now) {
                err = "Start time cannot be in the past.";
            } else if (value && currentFormData.endTime) {
                // If start time changes, re-validate end time against new start time
                const end = new Date(currentFormData.endTime);
                if (end <= start) {
                    setFieldErrors(prev => ({ ...prev, endTime: "End time must be after start time." }));
                } else if ((end.getTime() - start.getTime()) / (1000 * 60) < 30) {
                    setFieldErrors(prev => ({ ...prev, endTime: "Duration must be at least 30 min." }));
                } else {
                    // Check if start and end are on the same local date
                    if (start.getDate() !== end.getDate() || start.getMonth() !== end.getMonth() || start.getFullYear() !== end.getFullYear()) {
                        setFieldErrors(prev => ({ ...prev, endTime: "Must be same date as start." }));
                    } else {
                        // If all good, clear end time error
                        setFieldErrors(prev => { const { endTime, ...rest } = prev; return rest; });
                    }
                }
            } else if (!value && currentFormData.endTime) {
                // If start time is cleared but end time exists, end time is invalid
                setFieldErrors(prev => ({ ...prev, endTime: "Start time is required for end time validation." }));
            }
        }

        if (name === 'endTime') {
            const end = new Date(value);
            const startStr = currentFormData.startTime;
            if (value && startStr) {
                const start = new Date(startStr);
                if (end <= start) {
                    err = "End time must be after start time.";
                } else {
                    const duration = (end.getTime() - start.getTime()) / (1000 * 60);
                    if (duration < 30) {
                        err = "Duration must be at least 30 min.";
                    } else {
                        // Same date check for local dates
                        if (start.getDate() !== end.getDate() || start.getMonth() !== end.getMonth() || start.getFullYear() !== end.getFullYear()) {
                            err = "Must be same date as start.";
                        }
                    }
                }
            } else if (value && !startStr) {
                err = "Start time must be set before end time.";
            }
        }

        return err;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        const newFormData = {
            ...formData,
            [name]: name === 'price' || name === 'maxSeats' || name === 'availableSeats' ? Number(value) : value
        };
        setFormData(newFormData);

        // Immediate validation for date/time fields
        if (name === 'startTime' || name === 'endTime') {
            const err = validateField(name, value, newFormData);
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                if (err) newErrors[name] = err;
                else delete newErrors[name];
                return newErrors;
            });
            // If updating start, we already implicitly triggered end validation structure in validateField, 
            // but we might need to clear start error if it was "past"
            if (name === 'startTime' && !err) {
                // Clear start error if it was previously set and now valid
                setFieldErrors(prev => { const { startTime, ...rest } = prev; return rest; });
            }
        }

        if (error) setError(null); // Clear general error on user interaction
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Perform a final validation check before submission
        // This is important for fields that might not have been touched by handleChange
        // For now, we only have specific field validation for startTime/endTime
        // If other fields need validation, they should be added here or in validateField
        const finalErrors: { [key: string]: string } = {};
        if (formData.startTime) {
            const startErr = validateField('startTime', formData.startTime, formData);
            if (startErr) finalErrors.startTime = startErr;
        } else {
            finalErrors.startTime = "Start time is required.";
        }
        if (formData.endTime) {
            const endErr = validateField('endTime', formData.endTime, formData);
            if (endErr) finalErrors.endTime = endErr;
        } else {
            finalErrors.endTime = "End time is required.";
        }

        if (Object.keys(finalErrors).length > 0) {
            setFieldErrors(finalErrors);
            setError("Please correct the errors in the form.");
            return;
        }

        setIsLoading(true);
        setError(null); // Clear any previous general errors before submission
        try {
            // Ensure ISO strings for dates
            const payload = {
                ...formData,
                startTime: new Date(formData.startTime!).toISOString(),
                endTime: new Date(formData.endTime!).toISOString(),
            };

            // If creating, ensure availableSeats matches maxSeats (since input is hidden)
            if (!session) {
                payload.availableSeats = payload.maxSeats;
            }

            await onSave(payload);
            onClose();
        } catch (error) {
            console.error(error);
            // Parent handles error toast usually, but we can set local error too
            setError("Failed to save session. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    // Determine if the form is generally valid for submission
    const isFormValuesValid =
        formData.title &&
        formData.description &&
        formData.guideName &&
        formData.startTime &&
        formData.endTime &&
        Object.keys(fieldErrors).length === 0;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{session ? 'Edit Session' : 'Create New Session'}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} className={styles.content}>
                    {error && (
                        <div style={{
                            backgroundColor: '#fee2e2',
                            color: '#991b1b',
                            padding: '0.75rem',
                            borderRadius: '4px',
                            fontSize: '0.875rem',
                            marginBottom: '1rem',
                            border: '1px solid #fecaca'
                        }}>
                            {error}
                        </div>
                    )}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Title</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={styles.input}
                            required
                            placeholder="Session Title"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={styles.textarea}
                            required
                            placeholder="Brief description of the session..."
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className={styles.select}
                            >
                                <option value="FREE">FREE</option>
                                <option value="PAID">PAID</option>
                            </select>
                        </div>
                        {formData.type === 'PAID' && (
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Price</label>
                                <div className={styles.inputWrapper}>
                                    <span className={styles.currencySymbol}>₹</span>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className={`${styles.input} ${styles.inputWithIcon}`}
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Guide Name</label>
                        <input
                            name="guideName"
                            value={formData.guideName}
                            onChange={handleChange}
                            className={styles.input}
                            required
                            placeholder="Instructor Name"
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Start Time</label>
                            <input
                                type="datetime-local"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                                className={styles.input}
                                min={minStartTime}
                                required
                            />
                            {fieldErrors.startTime && <span className={styles.errorText}>{fieldErrors.startTime}</span>}
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>End Time</label>
                            <input
                                type="datetime-local"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleChange}
                                className={styles.input}
                                min={minEndTime}
                                disabled={!formData.startTime}
                                required
                            />
                            {fieldErrors.endTime && <span className={styles.errorText}>{fieldErrors.endTime}</span>}
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Seats</label>
                            <input
                                type="number"
                                name="maxSeats"
                                value={formData.maxSeats}
                                onChange={handleChange}
                                className={styles.input}
                                min="1"
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Zoom Link (Optional)</label>
                        <input
                            type="url"
                            name="zoomLink"
                            value={formData.zoomLink || ''}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="https://zoom.us/j/..."
                        />
                    </div>

                    <div className={styles.footer}>
                        <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" disabled={isLoading || !isFormValuesValid}>
                            {isLoading ? 'Saving...' : session ? 'Update Session' : 'Create Session'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SessionModal;
