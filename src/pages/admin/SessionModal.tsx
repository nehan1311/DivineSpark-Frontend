import React, { useState, useEffect } from 'react';
import type { AdminSession } from '../../types/admin.types';
import Button from '../../components/ui/Button';
import styles from './SessionModal.module.css';
import { formatForInput, getNowInIST } from '../../utils/format';
import dayjs from 'dayjs';
import { ADMIN_ENDPOINTS } from '../../api/endpoints';
import DateTimeInput from './DateTimeInput';


interface SessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (session: Partial<AdminSession>, thumbnailFile?: File | null) => Promise<void>;
    session: AdminSession | null; // If null, create mode
}

const SessionModal: React.FC<SessionModalProps> = ({ isOpen, onClose, onSave, session }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    // Thumbnail State
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<AdminSession>>({
        title: '',
        description: '',
        type: 'FREE',
        price: undefined,
        guideName: '',
        startTime: '',
        endTime: '',
        maxSeats: undefined,
        availableSeats: undefined,
        whatsappGroupLink: '',
        imageUrl: '',
    });

    useEffect(() => {
        setError(null);
        setFieldErrors({}); // Clear field errors on modal open/close or session change
        if (session) {
            // Edit Mode
            setFormData({
                ...session,
                startTime: session.startTime ? formatForInput(session.startTime) : '',
                endTime: session.endTime ? formatForInput(session.endTime) : '',
                imageUrl: session.imageUrl || '',
            });
            // Use the dedicated thumbnail endpoint for preview
            setPreviewUrl(ADMIN_ENDPOINTS.THUMBNAIL(session.id));
        } else {
            // Reset for Create Mode
            setFormData({
                title: '',
                description: '',
                type: 'FREE',
                price: undefined,
                guideName: '',
                startTime: '',
                endTime: '',
                maxSeats: undefined,
                availableSeats: undefined,
                whatsappGroupLink: '',
                imageUrl: '',
            });
            setPreviewUrl(null);
        }
        setThumbnailFile(null);
    }, [session, isOpen]);

    // Helpers
    const getMinEndTime = (startStr: string) => {
        if (!startStr) return '';
        const start = dayjs.tz(startStr, 'Asia/Kolkata');
        if (!start.isValid()) return '';

        // Add 30 minutes
        return start.add(30, 'minute').format('YYYY-MM-DDTHH:mm');
    };

    const minStartTime = getNowInIST().format('YYYY-MM-DDTHH:mm');
    const minEndTime = getMinEndTime(formData.startTime || '');

    const validateField = (name: string, value: any, currentFormData: Partial<AdminSession>) => {
        let err = '';
        if (!value) return '';
        const now = getNowInIST();

        if (name === 'startTime') {
            const start = dayjs.tz(value, 'Asia/Kolkata');
            if (value && start.isBefore(now)) {
                err = "Start time cannot be in the past.";
            } else if (value && currentFormData.endTime) {
                // If start time changes, re-validate end time against new start time
                const end = dayjs.tz(currentFormData.endTime, 'Asia/Kolkata');
                if (end.isBefore(start) || end.isSame(start)) {
                    setFieldErrors(prev => ({ ...prev, endTime: "End time must be after start time." }));
                } else if (end.diff(start, 'minute') < 30) {
                    setFieldErrors(prev => ({ ...prev, endTime: "Duration must be at least 30 min." }));
                } else {
                    // All good — clear end time error
                    setFieldErrors(prev => { const { endTime, ...rest } = prev; return rest; });
                }
            } else if (!value && currentFormData.endTime) {
                // If start time is cleared but end time exists, end time is invalid
                setFieldErrors(prev => ({ ...prev, endTime: "Start time is required for end time validation." }));
            }
        }

        if (name === 'endTime') {
            const end = dayjs.tz(value, 'Asia/Kolkata');
            const startStr = currentFormData.startTime;
            if (value && startStr) {
                const start = dayjs.tz(startStr, 'Asia/Kolkata');
                if (end.isBefore(start) || end.isSame(start)) {
                    err = "End time must be after start time.";
                } else {
                    const duration = end.diff(start, 'minute');
                    if (duration < 30) {
                        err = "Duration must be at least 30 min.";
                    }
                }
            } else if (value && !startStr) {
                err = "Start time must be set before end time.";
            }
        }

        return err;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | { target: { name: string; value: any } }) => {
        const { name, value } = e.target;

        const newFormData = {
            ...formData,
            [name]: name === 'price' || name === 'maxSeats' || name === 'availableSeats'
                ? (value === '' ? undefined : Number(value))
                : value
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Basic validation (optional)
            if (file.size > 5 * 1024 * 1024) { // 5MB limit example
                setError("Image size should be less than 5MB");
                return;
            }

            setThumbnailFile(file);
            // Create object URL for preview
            setPreviewUrl(URL.createObjectURL(file));
            setError(null);
        }
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

        // Validate File Size on Submit
        if (thumbnailFile && thumbnailFile.size > 5 * 1024 * 1024) {
            setError("Image size cannot exceed 5MB.");
            return;
        }

        setIsLoading(true);
        setError(null); // Clear any previous general errors before submission
        try {
            const payload = {
                ...formData,
                // We keep existing imageUrl if available, or it might be updated by parent after upload
                // If creating, this might be empty initially
                startTime: new Date(formData.startTime!).toISOString(),
                endTime: new Date(formData.endTime!).toISOString(),
                status: session ? session.status : 'UPCOMING', // Ensure default status is UPCOMING for new sessions
            };

            // If creating, ensure availableSeats matches maxSeats (since input is hidden)
            if (!session) {
                payload.availableSeats = payload.maxSeats;
            }

            await onSave(payload, thumbnailFile);
            onClose();


        } catch (error) {

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
        formData.whatsappGroupLink &&
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
                        <label className={styles.label}>Thumbnail Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className={styles.input} // Reusing input class might look okay, or customize
                        />
                        {previewUrl && (
                            <div style={{ marginTop: '0.5rem' }}>
                                <img
                                    src={previewUrl}
                                    alt="Thumbnail Preview"
                                    style={{
                                        width: '100%',
                                        maxHeight: '200px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        border: '1px solid #ccc'
                                    }}
                                />
                            </div>
                        )}
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
                                        value={formData.price ?? ''}
                                        onChange={handleChange}
                                        className={`${styles.input} ${styles.inputWithIcon}`}
                                        min="0"
                                        step="0.01"
                                        onWheel={(e) => e.currentTarget.blur()}
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
                        <DateTimeInput
                            name="startTime"
                            label="Start Time"
                            value={formData.startTime || ''}
                            onChange={handleChange}
                            min={minStartTime}
                            error={fieldErrors.startTime}
                            styles={styles}
                        />
                        <DateTimeInput
                            name="endTime"
                            label="End Time"
                            value={formData.endTime || ''}
                            onChange={handleChange}
                            min={minEndTime}
                            error={fieldErrors.endTime}
                            disabled={!formData.startTime}
                            styles={styles}
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Seats</label>
                            <input
                                type="number"
                                name="maxSeats"
                                value={formData.maxSeats ?? ''}
                                onChange={handleChange}
                                className={styles.input}
                                min="1"
                                onWheel={(e) => e.currentTarget.blur()}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>WhatsApp Group Link</label>
                        <input
                            type="url"
                            name="whatsappGroupLink"
                            value={formData.whatsappGroupLink}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="https://chat.whatsapp.com/..."
                            required
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
