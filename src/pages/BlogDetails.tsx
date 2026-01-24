import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogApi, type BlogPost } from '../api/blog.api';
import styles from './BlogDetails.module.css';

const BlogDetails: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlog = async () => {
            if (!slug) return;
            try {
                const data = await blogApi.getBlogBySlug(slug);
                setBlog(data);
            } catch (err) {
                console.error('Failed to fetch blog:', err);
                setError('Could not find the requested article.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [slug]);

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return '';
        }
    };

    if (loading) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.loadingState}>Loading wisdom...</div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.errorState}>
                    <p>{error || 'Article not found.'}</p>
                    <a onClick={() => navigate('/blogs')} className={styles.backLink} style={{ marginTop: '1rem', display: 'inline-block' }}>
                        Return to Blogs
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <div onClick={() => navigate('/blogs')} className={styles.backLink}>
                    ← Back to Blogs
                </div>

                <header className={styles.header}>
                    <h1 className={styles.title}>{blog.title}</h1>
                    <div className={styles.meta}>
                        <span>{blog.authorName}{blog.authorRole && ` (${blog.authorRole})`}</span>
                        <span className={styles.separator}>•</span>
                        <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                    </div>
                </header>

                <div className={styles.content}>
                    {blog.content}
                </div>
            </div>
        </div>
    );
};

export default BlogDetails;
