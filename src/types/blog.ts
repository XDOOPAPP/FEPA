export interface Blog {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    author: string;
    status: 'draft' | 'published' | 'archived';
    category: string;
    featuredImage?: string;
    tags?: string[];
    viewCount?: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBlogDto {
    title: string;
    content: string;
    excerpt?: string;
    author?: string;
    status: 'draft' | 'published' | 'archived';
    category: string;
    featuredImage?: string;
    tags?: string[];
}

export interface UpdateBlogDto {
    title?: string;
    content?: string;
    excerpt?: string;
    author?: string;
    status?: 'draft' | 'published' | 'archived';
    category?: string;
    featuredImage?: string;
    tags?: string[];
}

export interface BlogQueryParams {
    status?: string;
    category?: string;
    page?: number;
    limit?: number;
    search?: string;
}
