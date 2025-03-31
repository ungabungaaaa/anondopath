
export interface BlogUser {
  id: string;
  username: string;
  email: string | null;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  author_id: string | null;
  category_id: string | null;
  status: 'draft' | 'published';
  read_time: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author?: BlogUser;
  category?: BlogCategory;
  tags?: BlogTag[];
}

export interface BlogComment {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string;
  content: string;
  is_approved: boolean;
  created_at: string;
}

export interface AdminLoginCredentials {
  username: string;
  password: string;
}

export interface AdminAuthState {
  user: BlogUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Add TypeScript helper types for the Supabase database
export type Database = {
  public: {
    Tables: {
      blog_users: {
        Row: BlogUser;
        Insert: Omit<BlogUser, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<BlogUser, 'id' | 'created_at' | 'updated_at'>>;
      };
      blog_categories: {
        Row: BlogCategory;
        Insert: Omit<BlogCategory, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<BlogCategory, 'id' | 'created_at' | 'updated_at'>>;
      };
      blog_tags: {
        Row: BlogTag;
        Insert: Omit<BlogTag, 'id' | 'created_at'>;
        Update: Partial<Omit<BlogTag, 'id' | 'created_at'>>;
      };
      blog_posts: {
        Row: Omit<BlogPost, 'author' | 'category' | 'tags'>;
        Insert: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'author' | 'category' | 'tags'>;
        Update: Partial<Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'author' | 'category' | 'tags'>>;
      };
      blog_posts_tags: {
        Row: {
          post_id: string;
          tag_id: string;
        };
        Insert: {
          post_id: string;
          tag_id: string;
        };
        Update: {
          post_id?: string;
          tag_id?: string;
        };
      };
      blog_comments: {
        Row: BlogComment;
        Insert: Omit<BlogComment, 'id' | 'created_at'>;
        Update: Partial<Omit<BlogComment, 'id' | 'created_at'>>;
      };
    };
  };
};
