import axios from './axios';
import { BLOG_ENDPOINTS } from './endpoints';

export interface BlogPost {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    authorName: string;
    authorRole?: string;
    publishedAt: string;
    createdAt: string;
}

export const blogApi = {
    // Get all published blogs
    getAllBlogs: async (): Promise<BlogPost[]> => {
        const response = await axios.get(BLOG_ENDPOINTS.GET_ALL);
        return response.data;
    },

    // Get a single blog by slug
    getBlogBySlug: async (slug: string): Promise<BlogPost> => {
        const response = await axios.get(BLOG_ENDPOINTS.GET_BY_SLUG(slug));
        return response.data;
    },
};
