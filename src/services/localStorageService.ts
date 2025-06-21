
import { BlogPost, BlogCategory, BlogTag, BlogComment } from '@/types/blog';

// Posts
export const getStoredPosts = (): BlogPost[] => {
  try {
    return JSON.parse(localStorage.getItem('blogPosts') || '[]');
  } catch {
    return [];
  }
};

export const saveStoredPosts = (posts: BlogPost[]): void => {
  localStorage.setItem('blogPosts', JSON.stringify(posts));
};

export const createStoredPost = (post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): string => {
  const posts = getStoredPosts();
  const newPost: BlogPost = {
    ...post,
    id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  posts.push(newPost);
  saveStoredPosts(posts);
  return newPost.id;
};

export const updateStoredPost = (id: string, updates: Partial<BlogPost>): boolean => {
  const posts = getStoredPosts();
  const index = posts.findIndex(p => p.id === id);
  if (index === -1) return false;
  
  posts[index] = { ...posts[index], ...updates, updated_at: new Date().toISOString() };
  saveStoredPosts(posts);
  return true;
};

export const deleteStoredPost = (id: string): boolean => {
  const posts = getStoredPosts();
  const filtered = posts.filter(p => p.id !== id);
  saveStoredPosts(filtered);
  return filtered.length < posts.length;
};

// Categories
export const getStoredCategories = (): BlogCategory[] => {
  try {
    const stored = JSON.parse(localStorage.getItem('blogCategories') || '[]');
    if (stored.length === 0) {
      // Initialize with default categories
      const defaultCategories = [
        { id: 'cat-1', name: 'Technology', slug: 'technology', description: 'Tech articles', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 'cat-2', name: 'Business', slug: 'business', description: 'Business insights', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 'cat-3', name: 'Design', slug: 'design', description: 'Design tutorials', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      ];
      localStorage.setItem('blogCategories', JSON.stringify(defaultCategories));
      return defaultCategories;
    }
    return stored;
  } catch {
    return [];
  }
};

export const saveStoredCategories = (categories: BlogCategory[]): void => {
  localStorage.setItem('blogCategories', JSON.stringify(categories));
};

export const createStoredCategory = (category: Omit<BlogCategory, 'id' | 'created_at' | 'updated_at'>): string => {
  const categories = getStoredCategories();
  const newCategory: BlogCategory = {
    ...category,
    id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  categories.push(newCategory);
  saveStoredCategories(categories);
  return newCategory.id;
};

export const updateStoredCategory = (id: string, updates: Partial<BlogCategory>): boolean => {
  const categories = getStoredCategories();
  const index = categories.findIndex(c => c.id === id);
  if (index === -1) return false;
  
  categories[index] = { ...categories[index], ...updates, updated_at: new Date().toISOString() };
  saveStoredCategories(categories);
  return true;
};

export const deleteStoredCategory = (id: string): boolean => {
  const categories = getStoredCategories();
  const filtered = categories.filter(c => c.id !== id);
  saveStoredCategories(filtered);
  return filtered.length < categories.length;
};

// Tags
export const getStoredTags = (): BlogTag[] => {
  try {
    const stored = JSON.parse(localStorage.getItem('blogTags') || '[]');
    if (stored.length === 0) {
      // Initialize with default tags
      const defaultTags = [
        { id: 'tag-1', name: 'React', slug: 'react', created_at: new Date().toISOString() },
        { id: 'tag-2', name: 'JavaScript', slug: 'javascript', created_at: new Date().toISOString() },
        { id: 'tag-3', name: 'UI/UX', slug: 'ui-ux', created_at: new Date().toISOString() },
        { id: 'tag-4', name: 'Startup', slug: 'startup', created_at: new Date().toISOString() }
      ];
      localStorage.setItem('blogTags', JSON.stringify(defaultTags));
      return defaultTags;
    }
    return stored;
  } catch {
    return [];
  }
};

export const saveStoredTags = (tags: BlogTag[]): void => {
  localStorage.setItem('blogTags', JSON.stringify(tags));
};

export const createStoredTag = (tag: Omit<BlogTag, 'id' | 'created_at'>): string => {
  const tags = getStoredTags();
  const newTag: BlogTag = {
    ...tag,
    id: `tag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString(),
  };
  tags.push(newTag);
  saveStoredTags(tags);
  return newTag.id;
};

export const updateStoredTag = (id: string, updates: Partial<BlogTag>): boolean => {
  const tags = getStoredTags();
  const index = tags.findIndex(t => t.id === id);
  if (index === -1) return false;
  
  tags[index] = { ...tags[index], ...updates };
  saveStoredTags(tags);
  return true;
};

export const deleteStoredTag = (id: string): boolean => {
  const tags = getStoredTags();
  const filtered = tags.filter(t => t.id !== id);
  saveStoredTags(filtered);
  return filtered.length < tags.length;
};

// Comments
export const getStoredComments = (): BlogComment[] => {
  try {
    return JSON.parse(localStorage.getItem('blogComments') || '[]');
  } catch {
    return [];
  }
};

export const saveStoredComments = (comments: BlogComment[]): void => {
  localStorage.setItem('blogComments', JSON.stringify(comments));
};
