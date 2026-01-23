import React, { useState, useEffect, useCallback } from 'react';
import styles from './Admin.module.css';
import { useToast } from '../../context/ToastContext';
import { adminReviewApi, type AdminReview } from '../../api/adminReview.api';
import { ConfirmationModal, Modal } from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { formatFullDateTime } from '../../utils/format';

const AdminReviews: React.FC = () => {
    const { showToast } = useToast();
    const [reviews, setReviews] = useState<AdminReview[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Edit State
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingReview, setEditingReview] = useState<AdminReview | null>(null);
    const [editContent, setEditContent] = useState('');
    const [editRating, setEditRating] = useState(5);

    // Reject State
    const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; id: null | number }>({ isOpen: false, id: null });

    const fetchReviews = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await adminReviewApi.getPendingReviews();
            setReviews(data);
        } catch (error) {
            showToast('Failed to load pending reviews', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    // Helper to extract ID robustly
    const getReviewId = (r: any): number | undefined => r.id || r.reviewId;

    const handleApprove = async (review: AdminReview) => {
        const id = getReviewId(review);
        if (!id) {
            showToast("Error: Review ID not found", "error");
            console.error("Missing ID for review:", review);
            return;
        }

        try {
            await adminReviewApi.approveReview(id);
            showToast('Review approved', 'success');
            setReviews(prev => prev.filter(r => getReviewId(r) !== id));
        } catch (error) {
            showToast('Failed to approve review', 'error');
        }
    };

    const handleRejectClick = (review: AdminReview) => {
        const id = getReviewId(review);
        if (!id) {
            showToast("Error: Review ID not found", "error");
            return;
        }
        setRejectModal({ isOpen: true, id });
    };

    const confirmReject = async () => {
        if (!rejectModal.id) return;
        try {
            await adminReviewApi.rejectReview(rejectModal.id);
            showToast('Review rejected', 'success');
            setReviews(prev => prev.filter(r => getReviewId(r) !== rejectModal.id));
            setRejectModal({ isOpen: false, id: null });
        } catch (error) {
            showToast('Failed to reject review', 'error');
        }
    };

    const handleEditClick = (review: AdminReview) => {
        const id = getReviewId(review);
        if (!id) {
            showToast("Error: Review ID not found", "error");
            console.error("Missing ID for review:", review);
            return;
        }
        setEditingReview(review);
        setEditContent(review.comment);
        setEditRating(review.rating);
        setIsEditOpen(true);
    };

    const saveEdit = async () => {
        const id = editingReview ? getReviewId(editingReview) : undefined;
        if (!id) return;

        try {
            const updated = await adminReviewApi.editReview(id, {
                comment: editContent,
                rating: editRating
            });

            // Update local state without removing it (Review stays pending after edit)
            setReviews(prev => prev.map(r => getReviewId(r) === id ? { ...r, ...updated } : r));

            showToast('Review updated', 'success');
            setIsEditOpen(false);
            setEditingReview(null);
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Failed to update review';
            showToast(msg, 'error');
        }
    };

    if (isLoading) {
        return <div className={styles.loadingState}>Loading pending reviews...</div>;
    }

    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <div>
                    <h3 className={styles.sectionTitle}>Pending Reviews</h3>
                    <p className={styles.headerSubtitle} style={{ marginTop: '0.5rem' }}>Approve or reject user-submitted reviews</p>
                </div>
            </div>

            {reviews.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {reviews.map(review => {
                        const id = getReviewId(review);
                        return (
                            <div key={id || Math.random()} className={styles.sessionCard} style={{ maxWidth: '100%', cursor: 'default' }}>
                                <div className={styles.cardHeader}>
                                    <div style={{ fontWeight: 600 }}>{review.userName}</div>
                                    <div className={styles.cardDateTime}>{review.submittedDate ? formatFullDateTime(review.submittedDate) : formatFullDateTime(review.createdAt)}</div>
                                </div>
                                {review.sessionTitle && (
                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-primary)', marginTop: '0.25rem' }}>
                                        Session: {review.sessionTitle}
                                    </div>
                                )}
                                <div style={{ margin: '0.5rem 0' }}>
                                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                </div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-body)', lineHeight: 1.5 }}>
                                    {review.comment}
                                </p>

                                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                    <button
                                        className={styles.actionBtn}
                                        onClick={() => handleEditClick(review)}
                                        disabled={!id}
                                        style={!id ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className={`${styles.actionBtn} ${styles.badgeSuccess}`}
                                        style={{ border: 'none', cursor: !id ? 'not-allowed' : 'pointer', opacity: !id ? 0.5 : 1 }}
                                        onClick={() => handleApprove(review)}
                                        disabled={!id}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className={`${styles.actionBtn} ${styles.badgeError}`}
                                        style={{ border: 'none', cursor: !id ? 'not-allowed' : 'pointer', opacity: !id ? 0.5 : 1 }}
                                        onClick={() => handleRejectClick(review)}
                                        disabled={!id}
                                    >
                                        Reject
                                    </button>
                                </div>
                                {!id && (
                                    <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem', textAlign: 'right' }}>
                                        ⚠️ Backend Error: Review ID missing
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className={styles.emptyState}>No pending reviews</div>
            )}

            {/* Edit Modal */}
            <Modal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title="Edit Review"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={saveEdit}>Save Changes</Button>
                    </>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Rating</label>
                        <select
                            value={editRating}
                            onChange={(e) => setEditRating(Number(e.target.value))}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                        >
                            <option value="1">1 Star</option>
                            <option value="2">2 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="5">5 Stars</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Content</label>
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={5}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
                        />
                    </div>
                </div>
            </Modal>

            {/* Reject Confirmation */}
            <ConfirmationModal
                isOpen={rejectModal.isOpen}
                onClose={() => setRejectModal({ isOpen: false, id: null })}
                onConfirm={confirmReject}
                title="Reject Review"
                message="Are you sure you want to reject this review? This will remove it from the pending list."
                confirmText="Reject"
                variant="danger"
            />
        </div>
    );
};

export default AdminReviews;
