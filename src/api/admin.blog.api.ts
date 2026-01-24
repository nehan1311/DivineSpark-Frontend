import axiosInstance from './axios';
import { ADMIN_ENDPOINTS } from './endpoints';

export interface AdminBlogPost {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    authorName: string;
    isPublished: boolean;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
    authorRole?: string;
}

export interface CreateBlogRequest {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    authorName: string;
    authorRole: string;
}

export interface UpdateBlogRequest {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    authorName?: string;
    authorRole?: string;
}

export const adminBlogApi = {
    getAllBlogs: async (): Promise<AdminBlogPost[]> => {
        const response = await axiosInstance.get(ADMIN_ENDPOINTS.BLOGS);
        return response.data;
    },

    getBlog: async (id: number): Promise<AdminBlogPost> => {
        const response = await axiosInstance.get(ADMIN_ENDPOINTS.BLOG_DETAILS(id));
        return response.data;
    },

    createBlog: async (data: CreateBlogRequest): Promise<void> => {
        await axiosInstance.post(ADMIN_ENDPOINTS.BLOGS, data);
    },

    updateBlog: async (id: number, data: UpdateBlogRequest): Promise<void> => {
        await axiosInstance.put(ADMIN_ENDPOINTS.BLOG_DETAILS(id), data);
    },

    publishBlog: async (id: number): Promise<void> => {
        await axiosInstance.patch(ADMIN_ENDPOINTS.PUBLISH_BLOG(id));
    },

    deleteBlog: async (id: number): Promise<void> => {
        await axiosInstance.delete(ADMIN_ENDPOINTS.BLOG_DETAILS(id));
    }
};
