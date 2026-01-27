import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogApi, type BlogPost } from '../api/blog.api';
import styles from './Blogs.module.css';
import energyHealingImg from '../assets/energy_healing.jpg';

const Blogs: React.FC = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const data = await blogApi.getAllBlogs();
                // Filter published blogs if backend returns all types, 
                // but prompt says backend /api/v1/blogs returns list of published blogs.
                // Assuming data is array of published blogs.
                setBlogs(data);
            } catch (err) {
                console.error('Failed to fetch blogs:', err);
                setError('Unable to load wisdom at this moment.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const handleBlogClick = (slug: string) => {
        navigate(`/blogs/${slug}`);
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'Coming Soon';
        try {
            // Explicitly handle "Z" UTC time if needed, though standard Date constructor usually works
            const date = new Date(dateString);

            // Check if date is valid
            if (isNaN(date.getTime())) {
                // Try parsing manually if standard fails for some reason (rare for ISO)
                return 'Recently Added';
            }

            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return 'Recently Added';
        }
    };

    if (loading) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.loadingState}>
                    <p>Gathering wisdom...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.errorState}>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Blog</h1>
                    <p className={styles.subtitle}>Thoughts, guidance & wisdom for conscious living</p>
                </header>

                <section className={styles.blogList}>
                    {blogs.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>No articles published yet. Stay tuned for wisdom.</p>
                        </div>
                    ) : (
                        blogs.map((blog) => (
                            <article key={blog.id} className={styles.blogItem}>
                                <div className={styles.heroImageContainer}>
                                    <img
                                        src={energyHealingImg}
                                        alt={blog.title}
                                        className={styles.heroImage}
                                    />
                                </div>
                                <div className={styles.contentWrapper}>
                                    <h1
                                        className={styles.blogTitle}
                                        onClick={() => handleBlogClick(blog.slug)}
                                    >
                                        {blog.title}
                                    </h1>
                                    <hr className={styles.divider} />
                                    <div className={styles.meta}>
                                        <span className={styles.author}>{blog.authorName || 'DivineSpark'}{blog.authorRole && ` (${blog.authorRole})`}</span>
                                        <span className={styles.separator}>•</span>
                                        <span className={styles.date}>
                                            {formatDate(blog.createdAt || blog.publishedAt)}
                                        </span>
                                    </div>
                                    <p className={styles.excerpt}>{blog.excerpt}</p>
                                    <a
                                        className={styles.readMore}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleBlogClick(blog.slug);
                                        }}
                                        href={`/blogs/${blog.slug}`}
                                    >
                                        Read more
                                    </a>
                                </div>
                            </article>
                        ))
                    )}
                </section>
            </div>
        </div>
    );
};

export default Blogs;
