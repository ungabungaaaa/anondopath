
import { authenticateAdmin, getCurrentAdmin, logoutAdmin, getAuthHeaders } from '@/integrations/auth/authClient';
import { 
  BlogPost, 
  BlogCategory, 
  BlogTag, 
  BlogComment, 
  AdminLoginCredentials,
  BlogUser
} from '@/types/blog';

// Admin Authentication
export const loginAdmin = async (credentials: AdminLoginCredentials): Promise<BlogUser | null> => {
  try {
    console.log("Attempting to login admin with credentials:", { username: credentials.username });
    
    const user = await authenticateAdmin(credentials.username, credentials.password);
    
    if (!user) {
      console.error("Authentication failed - invalid credentials");
      throw new Error('Invalid username or password');
    }
    
    console.log("Admin login successful:", user);
    return user;
  } catch (error: any) {
    console.error('Login error:', error.message);
    throw error;
  }
};

export { logoutAdmin, getCurrentAdmin };

// Blog Posts
// For now, we'll return mock data for these functions
export const getPosts = async (
  page = 1, 
  limit = 10, 
  category?: string,
  tag?: string,
  search?: string
): Promise<{ posts: BlogPost[], count: number }> => {
  console.log('Mock getPosts called with:', { page, limit, category, tag, search });
  return { posts: [], count: 0 };
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  console.log('Mock getPostBySlug called with:', slug);
  return null;
};

export const getPostById = async (id: string): Promise<BlogPost | null> => {
  console.log('Mock getPostById called with:', id);
  return null;
};

export const getRelatedPosts = async (postId: string, categoryId: string, limit = 3): Promise<BlogPost[]> => {
  console.log('Mock getRelatedPosts called with:', { postId, categoryId, limit });
  return [];
};

// Categories
export const getCategories = async (): Promise<BlogCategory[]> => {
  console.log('Mock getCategories called');
  return [];
};

// Tags
export const getTags = async (): Promise<BlogTag[]> => {
  console.log('Mock getTags called');
  return [];
};

// Comments
export const getApprovedComments = async (postId: string): Promise<BlogComment[]> => {
  console.log('Mock getApprovedComments called with:', postId);
  return [];
};

export const submitComment = async (comment: Omit<BlogComment, 'id' | 'is_approved' | 'created_at'>): Promise<boolean> => {
  console.log('Mock submitComment called with:', comment);
  return true;
};

// Admin functions
export const getAdminPosts = async (
  page = 1, 
  limit = 10, 
  status?: string,
  search?: string
): Promise<{ posts: BlogPost[], count: number }> => {
  console.log('Mock getAdminPosts called with:', { page, limit, status, search });
  return { posts: [], count: 0 };
};

export const createPost = async (post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> => {
  console.log('Mock createPost called with:', post);
  return "mock-post-id";
};

export const updatePost = async (id: string, post: Partial<BlogPost>): Promise<boolean> => {
  console.log('Mock updatePost called with:', { id, post });
  return true;
};

export const deletePost = async (id: string): Promise<boolean> => {
  console.log('Mock deletePost called with:', id);
  return true;
};

export const createCategory = async (category: Omit<BlogCategory, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> => {
  console.log('Mock createCategory called with:', category);
  return "mock-category-id";
};

export const updateCategory = async (id: string, category: Partial<BlogCategory>): Promise<boolean> => {
  console.log('Mock updateCategory called with:', { id, category });
  return true;
};

export const deleteCategory = async (id: string): Promise<boolean> => {
  console.log('Mock deleteCategory called with:', id);
  return true;
};

export const createTag = async (tag: Omit<BlogTag, 'id' | 'created_at'>): Promise<string | null> => {
  console.log('Mock createTag called with:', tag);
  return "mock-tag-id";
};

export const updateTag = async (id: string, tag: Partial<BlogTag>): Promise<boolean> => {
  console.log('Mock updateTag called with:', { id, tag });
  return true;
};

export const deleteTag = async (id: string): Promise<boolean> => {
  console.log('Mock deleteTag called with:', id);
  return true;
};

export const getAdminComments = async (
  page = 1, 
  limit = 10, 
  isApproved?: boolean
): Promise<{ comments: BlogComment[], count: number }> => {
  console.log('Mock getAdminComments called with:', { page, limit, isApproved });
  return { comments: [], count: 0 };
};

export const approveComment = async (id: string): Promise<boolean> => {
  console.log('Mock approveComment called with:', id);
  return true;
};

export const deleteComment = async (id: string): Promise<boolean> => {
  console.log('Mock deleteComment called with:', id);
  return true;
};

// Image upload - mock implementation
export const uploadImage = async (file: File): Promise<string | null> => {
  console.log('Mock uploadImage called with:', file.name);
  // Return a mock URL
  return `https://mock.imagehost.com/${file.name}`;
};

// Utility for generating slugs
export const generateSlug = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
};

// Calculate reading time
export const calculateReadingTime = (content: string): string => {
  const wordsPerMinute = 225;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  
  return `${minutes} min read`;
};
