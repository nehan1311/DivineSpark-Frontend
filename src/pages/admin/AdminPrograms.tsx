
import React, { useState, useEffect } from 'react';
import { getAdminPrograms, createProgram, updateProgram, deleteProgram } from '../../api/admin.api';
import type { AdminProgram, ProgramRequest } from '../../types/admin.types';
import styles from './Admin.module.css'; // Reusing Admin styles
import ProgramModal from './ProgramModal';
import { ConfirmationModal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';

const AdminPrograms: React.FC = () => {
    const { showToast } = useToast();
    const [programs, setPrograms] = useState<AdminProgram[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProgram, setEditingProgram] = useState<AdminProgram | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [programToDelete, setProgramToDelete] = useState<AdminProgram | null>(null);

    const fetchPrograms = async () => {
        setIsLoading(true);
        try {
            const data = await getAdminPrograms();
            setPrograms(data);
        } catch (error) {
            showToast('Failed to fetch programs', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPrograms();
    }, []);

    const handleCreate = () => {
        setEditingProgram(null);
        setIsModalOpen(true);
    };

    const handleEdit = (program: AdminProgram) => {
        setEditingProgram(program);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (program: AdminProgram) => {
        setProgramToDelete(program);
        setDeleteModalOpen(true);
    };

    const handleSave = async (programData: ProgramRequest) => {
        try {
            if (editingProgram) {
                await updateProgram(editingProgram.id, programData);
                showToast('Program updated successfully', 'success');
            } else {
                await createProgram(programData);
                showToast('Program created successfully', 'success');
            }
            fetchPrograms();
            setIsModalOpen(false);
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Failed to save program';
            // This error will be caught by the modal to show inline, but we re-throw to let modal know
            throw new Error(msg);
        }
    };

    const handleConfirmDelete = async () => {
        if (!programToDelete) return;

        try {
            await deleteProgram(programToDelete.id);
            showToast('Program deleted successfully', 'success');
            fetchPrograms();
        } catch (error) {
            showToast('Failed to delete program', 'error');
        } finally {
            setDeleteModalOpen(false);
            setProgramToDelete(null);
        }
    };

    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Programs</h3>
                <button className={styles.actionBtn} onClick={handleCreate}>
                    + Add Program
                </button>
            </div>

            {isLoading ? (
                <div className={styles.loadingState}>Loading programs...</div>
            ) : programs.length > 0 ? (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {programs.map(program => (
                            <tr key={program.id}>
                                <td data-label="Title">{program.title}</td>
                                <td data-label="Category">
                                    <span className={`${styles.badge} ${program.category === 'ENERGY_WORKSHOPS' ? styles.badgeSuccess : styles.badgeWarning}`}>
                                        {program.category === 'ENERGY_WORKSHOPS' ? 'Energy Workshop' : 'Spiritual Trip'}
                                    </span>
                                </td>
                                <td data-label="Description" style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {program.description}
                                </td>
                                <td data-label="Actions">
                                    <button className={styles.actionBtn} onClick={() => handleEdit(program)}>Edit</button>
                                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDeleteClick(program)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className={styles.emptyState}>No programs found.</div>
            )}

            <ProgramModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                program={editingProgram}
            />

            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Program"
                message={`Are you sure you want to delete "${programToDelete?.title}"?`}
                confirmText="Delete"
                variant="danger"
            />
        </div>
    );
};

export default AdminPrograms;
