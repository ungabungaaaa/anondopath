
import { authenticateAdmin, getCurrentAdmin, logoutAdmin, getAuthHeaders } from '@/integrations/auth/authClient';
import { 
  BlogPost, 
  BlogCategory, 
  BlogTag, 
  BlogComment, 
  AdminLoginCredentials,
  BlogUser
} from '@/types/blog';
import {
  getStoredPosts,
  saveStoredPosts,
  createStoredPost,
  updateStoredPost,
  deleteStoredPost,
  getStoredCategories,
  saveStoredCategories,
  createStoredCategory,
  updateStoredCategory,
  deleteStoredCategory,
  getStoredTags,
  saveStoredTags,
  createStoredTag,
  updateStoredTag,
  deleteStoredTag,
  getStoredComments,
  saveStoredComments
} from './localStorageService';

// Admin Authentication
export const loginAdmin = async (credentials: AdminLoginCredentials): Promise<BlogUser | null> => {
  try {
    console.log("Attempting to login admin with credentials:", { username: credentials.username });
    
    const user = await authenticateAdmin(credentials.username, credentials.password);
    
    if (!user) {
      console.error("Authentication failed - invalid credentials");
      throw new Error('Invalid username or password');
    }
    
    // Convert AuthUser to BlogUser
    const blogUser: BlogUser = {
      id: user.id,
      username: user.username,
      full_name: user.full_name || null,
      email: user.email,
      is_admin: true,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
    
    console.log("Admin login successful:", blogUser);
    return blogUser;
  } catch (error: any) {
    console.error('Login error:', error.message);
    throw error;
  }
};

// Return the current admin user as BlogUser
export const getCurrentAdminUser = (): BlogUser | null => {
  const user = getCurrentAdmin();
  if (!user) return null;

  return {
    id: user.id,
    username: user.username,
    full_name: user.full_name,
    email: user.email,
    is_admin: true,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
};

export { logoutAdmin, getCurrentAdmin };

// Blog Posts
export const getPosts = async (
  page = 1, 
  limit = 10, 
  category?: string,
  tag?: string,
  search?: string
): Promise<{ posts: BlogPost[], count: number }> => {
  console.log('getPosts called with:', { page, limit, category, tag, search });
  
  let posts = getStoredPosts();
  
  // Filter by category
  if (category) {
    posts = posts.filter(post => post.category_id === category);
  }
  
  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase();
    posts = posts.filter(post => 
      post.title.toLowerCase().includes(searchLower) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchLower))
    );
  }
  
  // Filter published posts only for public API
  posts = posts.filter(post => post.status === 'published');
  
  const count = posts.length;
  const startIndex = (page - 1) * limit;
  const paginatedPosts = posts.slice(startIndex, startIndex + limit);
  
  return { posts: paginatedPosts, count };
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  console.log('getPostBySlug called with:', slug);
  const posts = getStoredPosts();
  return posts.find(post => post.slug === slug && post.status === 'published') || null;
};

export const getPostById = async (id: string): Promise<BlogPost | null> => {
  console.log('getPostById called with:', id);
  const posts = getStoredPosts();
  return posts.find(post => post.id === id) || null;
};

export const getRelatedPosts = async (postId: string, categoryId: string, limit = 3): Promise<BlogPost[]> => {
  console.log('getRelatedPosts called with:', { postId, categoryId, limit });
  const posts = getStoredPosts();
  return posts
    .filter(post => post.id !== postId && post.category_id === categoryId && post.status === 'published')
    .slice(0, limit);
};

// Categories
export const getCategories = async (): Promise<BlogCategory[]> => {
  console.log('getCategories called');
  return getStoredCategories();
};

// Tags
export const getTags = async (): Promise<BlogTag[]> => {
  console.log('getTags called');
  return getStoredTags();
};

// Comments
export const getApprovedComments = async (postId: string): Promise<BlogComment[]> => {
  console.log('getApprovedComments called with:', postId);
  const comments = getStoredComments();
  return comments.filter(comment => comment.post_id === postId && comment.is_approved);
};

export const submitComment = async (comment: Omit<BlogComment, 'id' | 'is_approved' | 'created_at'>): Promise<boolean> => {
  console.log('submitComment called with:', comment);
  const comments = getStoredComments();
  const newComment: BlogComment = {
    ...comment,
    id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    is_approved: false,
    created_at: new Date().toISOString(),
  };
  comments.push(newComment);
  saveStoredComments(comments);
  return true;
};

// Admin functions
export const getAdminPosts = async (
  page = 1, 
  limit = 10, 
  status?: string,
  search?: string
): Promise<{ posts: BlogPost[], count: number }> => {
  console.log('getAdminPosts called with:', { page, limit, status, search });
  
  let posts = getStoredPosts();
  
  // Filter by status
  if (status && status !== 'all') {
    posts = posts.filter(post => post.status === status);
  }
  
  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase();
    posts = posts.filter(post => 
      post.title.toLowerCase().includes(searchLower) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchLower))
    );
  }
  
  const count = posts.length;
  const startIndex = (page - 1) * limit;
  const paginatedPosts = posts.slice(startIndex, startIndex + limit);
  
  return { posts: paginatedPosts, count };
};

export const createPost = async (post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> => {
  console.log('createPost called with:', post);
  return createStoredPost(post);
};

export const updatePost = async (id: string, post: Partial<BlogPost>): Promise<boolean> => {
  console.log('updatePost called with:', { id, post });
  return updateStoredPost(id, post);
};

export const deletePost = async (id: string): Promise<boolean> => {
  console.log('deletePost called with:', id);
  return deleteStoredPost(id);
};

export const createCategory = async (category: Omit<BlogCategory, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> => {
  console.log('createCategory called with:', category);
  return createStoredCategory(category);
};

export const updateCategory = async (id: string, category: Partial<BlogCategory>): Promise<boolean> => {
  console.log('updateCategory called with:', { id, category });
  return updateStoredCategory(id, category);
};

export const deleteCategory = async (id: string): Promise<boolean> => {
  console.log('deleteCategory called with:', id);
  return deleteStoredCategory(id);
};

export const createTag = async (tag: Omit<BlogTag, 'id' | 'created_at'>): Promise<string | null> => {
  console.log('createTag called with:', tag);
  return createStoredTag(tag);
};

export const updateTag = async (id: string, tag: Partial<BlogTag>): Promise<boolean> => {
  console.log('updateTag called with:', { id, tag });
  return updateStoredTag(id, tag);
};

export const deleteTag = async (id: string): Promise<boolean> => {
  console.log('deleteTag called with:', id);
  return deleteStoredTag(id);
};

export const getAdminComments = async (
  page = 1, 
  limit = 10, 
  isApproved?: boolean
): Promise<{ comments: BlogComment[], count: number }> => {
  console.log('getAdminComments called with:', { page, limit, isApproved });
  
  let comments = getStoredComments();
  
  if (isApproved !== undefined) {
    comments = comments.filter(comment => comment.is_approved === isApproved);
  }
  
  const count = comments.length;
  const startIndex = (page - 1) * limit;
  const paginatedComments = comments.slice(startIndex, startIndex + limit);
  
  return { comments: paginatedComments, count };
};

export const approveComment = async (id: string): Promise<boolean> => {
  console.log('approveComment called with:', id);
  const comments = getStoredComments();
  const index = comments.findIndex(c => c.id === id);
  if (index === -1) return false;
  
  comments[index].is_approved = true;
  saveStoredComments(comments);
  return true;
};

export const deleteComment = async (id: string): Promise<boolean> => {
  console.log('deleteComment called with:', id);
  const comments = getStoredComments();
  const filtered = comments.filter(c => c.id !== id);
  saveStoredComments(filtered);
  return filtered.length < comments.length;
};

// Image upload - mock implementation
export const uploadImage = async (file: File): Promise<string | null> => {
  console.log('uploadImage called with:', file.name);
  // Create a mock URL that could be used for display
  return URL.createObjectURL(file);
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
