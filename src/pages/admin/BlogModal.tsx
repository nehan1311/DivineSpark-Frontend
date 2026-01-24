import React, { useEffect, useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import styles from './Admin.module.css';
import { adminBlogApi, type AdminBlogPost, type CreateBlogRequest, type UpdateBlogRequest } from '../../api/admin.blog.api';
import { useToast } from '../../context/ToastContext';

interface BlogModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CreateBlogRequest | UpdateBlogRequest) => Promise<void>;
    blog?: AdminBlogPost | null;
}

// Extended interface to include authorRole in state even if not yet in AdminBlogPost
interface BlogFormState extends CreateBlogRequest {
    authorRole: string;
}

const BlogModal: React.FC<BlogModalProps> = ({ isOpen, onClose, onSave, blog }) => {
    const { showToast } = useToast();
    const [formData, setFormData] = useState<BlogFormState>({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        authorName: 'DivineSpark',
        authorRole: 'Editor',
    });
    const [isLoading, setIsLoading] = useState(false);

    // Character limit for excerpt
    const EXCERPT_LIMIT = 200;

    useEffect(() => {
        if (isOpen) {
            if (blog) {
                setFormData({
                    title: blog.title,
                    slug: blog.slug,
                    excerpt: blog.excerpt,
                    content: blog.content,
                    authorName: blog.authorName,
                    authorRole: blog.authorRole || 'Editor',
                });
            } else {
                setFormData({
                    title: '',
                    slug: '',
                    excerpt: '',
                    content: '',
                    authorName: 'DivineSpark',
                    authorRole: 'Editor',
                });
            }
        }
    }, [isOpen, blog]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTitleBlur = () => {
        if (!blog && !formData.slug && formData.title) {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleSaveLoop = async (shouldPublish: boolean = false) => {
        setIsLoading(true);
        try {
            // 1. Create or Update
            await onSave(formData);

            // 2. If Updating existing blog, we can publish immediately
            if (shouldPublish && blog?.id) {
                await adminBlogApi.publishBlog(blog.id);
                showToast('Blog updated and published!', 'success');
            } else if (shouldPublish && !blog) {
                // If creating new blog, we don't have ID because backend returns void
                showToast('Blog created. Please publish it from the list.', 'success');
            } else {
                showToast(blog ? 'Blog updated.' : 'Draft saved.', 'success');
            }

            onClose();
        } catch (error) {
            console.error('Failed to save blog:', error);
            showToast('Failed to save blog.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="" // Hiding default title to use custom header
        >
            <div className={styles.formHeader}>
                <h2 className={styles.formTitle}>{blog ? 'Edit Blog Post' : 'Create New Blog'}</h2>
                <p className={styles.formSubtitle}>
                    {blog ? 'Update your content details below.' : 'Draft your new article and share wisdom with the world.'}
                </p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className={styles.formStack}>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        onBlur={handleTitleBlur}
                        className={styles.formInput}
                        required
                        placeholder="e.g. The Power of Mindfulness"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Slug</label>
                    <div className={styles.inputGroup}>
                        <span className={styles.inputPrefix}>/blogs/</span>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            className={`${styles.formInput} ${styles.inputWithPrefix}`}
                            required
                            placeholder="the-power-of-mindfulness"
                        />
                    </div>
                    <p className={styles.helperText}>Auto-generated from title, editable. Must be unique.</p>
                </div>

                {/* Author Section - Grid Layout */}
                <div className={styles.gridTwoCol}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Author Name</label>
                        <input
                            type="text"
                            name="authorName"
                            value={formData.authorName}
                            onChange={handleChange}
                            className={styles.formInput}
                            required
                            placeholder="e.g. John Doe"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Author Role</label>
                        <input
                            type="text"
                            name="authorRole"
                            value={formData.authorRole}
                            onChange={handleChange}
                            className={styles.formInput}
                            placeholder="e.g. Certified Healer"
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Excerpt</label>
                    <textarea
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleChange}
                        className={styles.formInput}
                        rows={3}
                        required
                        maxLength={EXCERPT_LIMIT}
                        placeholder="A brief summary that appears on the blog list page..."
                    />
                    <div className={`${styles.charCount} ${formData.excerpt.length > EXCERPT_LIMIT * 0.9 ? styles.warning : ''}`}>
                        {formData.excerpt.length}/{EXCERPT_LIMIT} characters
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                        Content <span style={{ fontWeight: 400, color: '#6b7280', fontSize: '0.8rem' }}>(Markdown Supported)</span>
                    </label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        className={`${styles.formInput} ${styles.codeFont}`}
                        rows={12}
                        required
                        placeholder="# Start writing your story here..."
                    />
                </div>

                <div className={styles.modalActions}>
                    <Button variant="secondary" onClick={onClose} type="button">
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : (blog ? 'Update Blog' : 'Create Blog')}
                    </Button>
                </div>
            </form>
        </Modal >
    );
};

export default BlogModal;
