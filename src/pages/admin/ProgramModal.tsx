
import React, { useState, useEffect } from 'react';
import type { AdminProgram, ProgramRequest } from '../../types/admin.types';
import Button from '../../components/ui/Button';
import styles from './SessionModal.module.css'; // Reusing SessionModal styles

interface ProgramModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (program: ProgramRequest) => Promise<void>;
    program: AdminProgram | null;
}

const ProgramModal: React.FC<ProgramModalProps> = ({ isOpen, onClose, onSave, program }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<ProgramRequest>({
        title: '',
        description: '',
        category: 'ENERGY_WORKSHOPS', // Default
        imageUrl: '',
    });

    useEffect(() => {
        setError(null);
        if (program) {
            setFormData({
                title: program.title,
                description: program.description,
                category: program.category,
                imageUrl: program.imageUrl,
            });
        } else {
            setFormData({
                title: '',
                description: '',
                category: 'ENERGY_WORKSHOPS',
                imageUrl: '',
            });
        }
    }, [program, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await onSave(formData);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to save program');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{program ? 'Edit Program' : 'Create New Program'}</h2>
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
                            placeholder="e.g. Sound Healing Workshop"
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
                            placeholder="Brief description..."
                            maxLength={300}
                        />
                        <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem', textAlign: 'right' }}>
                            {formData.description.length}/300
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={styles.select}
                        >
                            <option value="ENERGY_WORKSHOPS">Energy Workshops</option>
                            <option value="SPIRITUAL_TRIPS">Spiritual Trips</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Image URL (Placeholder)</label>
                        <input
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            className={styles.input}
                            required
                            placeholder="/placeholder/program1.jpg"
                        />
                    </div>

                    <div className={styles.footer}>
                        <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" disabled={isLoading}>
                            {isLoading ? 'Saving...' : program ? 'Update Program' : 'Create Program'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProgramModal;
