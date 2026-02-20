import React, { useEffect, useState } from 'react';
import styles from './Admin.module.css';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { adminBlogApi, type AdminBlogPost, type CreateBlogRequest, type UpdateBlogRequest } from '../../api/admin.blog.api';
import { formatFullDateTime } from '../../utils/format';
import Button from '../../components/ui/Button';
import BlogModal from './BlogModal';
import { ConfirmationModal } from '../../components/ui/Modal';

const AdminBlogs: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const [blogs, setBlogs] = useState<AdminBlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<AdminBlogPost | null>(null);

    // Delete Confirmation
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; blogId: number | null }>({
        isOpen: false,
        blogId: null
    });

    const fetchBlogs = async () => {
        setIsLoading(true);
        try {
            const data = await adminBlogApi.getAllBlogs();
            console.log('✅ API RESPONSE (All Blogs):', data); // Debugging Log
            setBlogs(data);
        } catch (error) {
            console.error(error);
            showToast('Failed to load blogs', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchBlogs();
        } else {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    const handleCreate = () => {
        setEditingBlog(null);
        setIsModalOpen(true);
    };

    const handleEdit = (blog: AdminBlogPost) => {
        setEditingBlog(blog);
        setIsModalOpen(true);
    };

    const handleSave = async (data: CreateBlogRequest | UpdateBlogRequest): Promise<void> => {
        try {
            if (editingBlog) {
                await adminBlogApi.updateBlog(editingBlog.id, data);
            } else {
                await adminBlogApi.createBlog(data as CreateBlogRequest);
            }
            fetchBlogs();
        } catch (error) {
            throw error; // Let modal handle error logging
        }
    };

    const handlePublishToggle = async (id: number) => {
        if (!id) return;
        try {
            await adminBlogApi.publishBlog(id);

            // Update local state immediately for instant UI feedback
            // Set all potential "published" flags to true so the UI updates correctly
            setBlogs(prevBlogs => prevBlogs.map(blog =>
                blog.id === id ? { ...blog, isPublished: true, published: true, status: 'PUBLISHED', publishedAt: new Date().toISOString() } : blog
            ));

            showToast('Blog published successfully', 'success');
        } catch (error) {
            showToast('Failed to publish blog', 'error');
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeleteModal({ isOpen: true, blogId: id });
    };

    const confirmDelete = async () => {
        if (deleteModal.blogId) {
            try {
                await adminBlogApi.deleteBlog(deleteModal.blogId);
                showToast('Blog deleted successfully', 'success');
                fetchBlogs();
            } catch (error) {
                showToast('Failed to delete blog', 'error');
            } finally {
                setDeleteModal({ isOpen: false, blogId: null });
            }
        }
    };

    if (isLoading) {
        return <div className={styles.loadingState}>Loading blogs...</div>;
    }

    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Manage Blogs</h3>
                <Button onClick={handleCreate} size="sm">
                    + Create Blog
                </Button>
            </div>

            {blogs.length === 0 ? (
                <div className={styles.emptyState}>No blogs found. Create one to get started.</div>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.map((blog) => {
                            // Aggressive check for published status
                            const isPublished = ((b: any) => {
                                // Check standard booleans and their string/number variants
                                if (b.isPublished === true || String(b.isPublished) === 'true' || b.isPublished === 1) return true;
                                if (b.published === true || String(b.published) === 'true' || b.published === 1) return true;

                                // Check snake_case common in databases
                                if (b.is_published === true || String(b.is_published) === 'true' || b.is_published === 1) return true;

                                // Check status strings
                                if (b.status && typeof b.status === 'string' && ['PUBLISHED', 'LIVE', 'ACTIVE'].includes(b.status.toUpperCase())) return true;

                                // Check existence of published date
                                if (b.publishedAt && b.publishedAt !== '') return true;

                                return false;
                            })(blog);

                            return (
                                <tr key={blog.id}>
                                    <td data-label="Title">
                                        <div style={{ fontWeight: 500 }}>{blog.title}</div>
                                        <small style={{ color: '#888' }}>/{blog.slug}</small>
                                    </td>
                                    <td data-label="Author">{blog.authorName}</td>
                                    <td data-label="Status">
                                        <span className={`${styles.badge} ${isPublished ? styles.badgeSuccess : styles.badgeWarning}`}>
                                            {isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td data-label="Created At">{formatFullDateTime(blog.createdAt)}</td>
                                    <td data-label="Actions">
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className={styles.actionBtn}
                                                onClick={() => handleEdit(blog)}
                                                title="Edit"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className={styles.actionBtn}
                                                onClick={() => handlePublishToggle(blog.id)}
                                                disabled={isPublished}
                                                style={isPublished ? { opacity: 0.5, cursor: 'not-allowed', borderColor: 'transparent' } : {}}
                                                title={isPublished ? 'Already Published' : 'Publish Blog'}
                                            >
                                                {isPublished ? 'Published' : 'Publish'}
                                            </button>
                                            <button
                                                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                                onClick={() => handleDeleteClick(blog.id)}
                                                title="Delete"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}

            <BlogModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                blog={editingBlog}
            />

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, blogId: null })}
                onConfirm={confirmDelete}
                title="Delete Blog"
                message="Are you sure you want to delete this blog? This action cannot be undone."
                confirmText="Delete"
            />
        </div>
    );
};

export default AdminBlogs;
