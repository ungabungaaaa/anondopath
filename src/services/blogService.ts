import { supabase } from '@/integrations/supabase/client';
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
    
    // Call our admin-login edge function with proper error handling
    const { data, error } = await supabase.functions.invoke('admin-login', {
      body: credentials,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (error) {
      console.error("Edge function error:", error);
      throw new Error(error.message || 'Failed to authenticate');
    }
    
    if (!data || !data.user) {
      console.error("No user data returned from edge function");
      throw new Error('Invalid username or password');
    }
    
    console.log("Admin login successful:", data.user);
    
    // Store admin session in localStorage for persistence
    localStorage.setItem('blogAdminUser', JSON.stringify(data.user));
    return data.user;
  } catch (error: any) {
    console.error('Login error:', error.message);
    throw error;
  }
};

export const logoutAdmin = (): void => {
  localStorage.removeItem('blogAdminUser');
};

export const getCurrentAdmin = (): BlogUser | null => {
  const userJson = localStorage.getItem('blogAdminUser');
  if (userJson) {
    return JSON.parse(userJson);
  }
  return null;
};

// Blog Posts
export const getPosts = async (
  page = 1, 
  limit = 10, 
  category?: string,
  tag?: string,
  search?: string
): Promise<{ posts: BlogPost[], count: number }> => {
  try {
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        author:author_id(*),
        category:category_id(*)
      `, { count: 'exact' })
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    
    if (category) {
      query = query.eq('category.slug', category);
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`);
    }
    
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    let { data: posts, count, error } = await query.range(from, to);
    
    if (error) throw error;

    // If tag filtering is requested, we need to do it differently since it's a many-to-many relationship
    if (tag && posts) {
      // Get all post IDs that have the specified tag
      const { data: taggedPosts } = await supabase
        .from('blog_posts_tags')
        .select('post_id')
        .eq('tag_id', (await supabase.from('blog_tags').select('id').eq('slug', tag).single()).data?.id);
      
      if (taggedPosts) {
        const taggedPostIds = taggedPosts.map(tp => tp.post_id);
        posts = posts.filter(post => taggedPostIds.includes(post.id));
      }
    }
    
    // Get tags for each post
    if (posts && posts.length > 0) {
      for (const post of posts) {
        const { data: postTags } = await supabase
          .from('blog_posts_tags')
          .select('tag_id')
          .eq('post_id', post.id);
        
        if (postTags && postTags.length > 0) {
          const tagIds = postTags.map(pt => pt.tag_id);
          const { data: tags } = await supabase
            .from('blog_tags')
            .select('*')
            .in('id', tagIds);
          
          post.tags = tags || [];
        } else {
          post.tags = [];
        }
      }
    }
    
    return { 
      posts: posts || [], 
      count: count || 0 
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], count: 0 };
  }
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        author:author_id(*),
        category:category_id(*)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();
    
    if (error || !post) return null;
    
    // Get tags for the post
    const { data: postTags } = await supabase
      .from('blog_posts_tags')
      .select('tag_id')
      .eq('post_id', post.id);
    
    if (postTags && postTags.length > 0) {
      const tagIds = postTags.map(pt => pt.tag_id);
      const { data: tags } = await supabase
        .from('blog_tags')
        .select('*')
        .in('id', tagIds);
      
      post.tags = tags || [];
    } else {
      post.tags = [];
    }
    
    return post;
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
};

export const getPostById = async (id: string): Promise<BlogPost | null> => {
  try {
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        author:author_id(*),
        category:category_id(*)
      `)
      .eq('id', id)
      .single();
    
    if (error || !post) return null;
    
    // Get tags for the post
    const { data: postTags } = await supabase
      .from('blog_posts_tags')
      .select('tag_id')
      .eq('post_id', post.id);
    
    if (postTags && postTags.length > 0) {
      const tagIds = postTags.map(pt => pt.tag_id);
      const { data: tags } = await supabase
        .from('blog_tags')
        .select('*')
        .in('id', tagIds);
      
      post.tags = tags || [];
    } else {
      post.tags = [];
    }
    
    return post;
  } catch (error) {
    console.error('Error fetching post by id:', error);
    return null;
  }
};

export const getRelatedPosts = async (postId: string, categoryId: string, limit = 3): Promise<BlogPost[]> => {
  try {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        author:author_id(*),
        category:category_id(*)
      `)
      .eq('status', 'published')
      .eq('category_id', categoryId)
      .neq('id', postId)
      .order('published_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return posts || [];
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
};

// Categories
export const getCategories = async (): Promise<BlogCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Tags
export const getTags = async (): Promise<BlogTag[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_tags')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
};

// Comments
export const getApprovedComments = async (postId: string): Promise<BlogComment[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_comments')
      .select('*')
      .eq('post_id', postId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching approved comments:', error);
    return [];
  }
};

export const submitComment = async (comment: Omit<BlogComment, 'id' | 'is_approved' | 'created_at'>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('blog_comments')
      .insert([{ ...comment, is_approved: false }]);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error submitting comment:', error);
    return false;
  }
};

// Admin functions
export const getAdminPosts = async (
  page = 1, 
  limit = 10, 
  status?: string,
  search?: string
): Promise<{ posts: BlogPost[], count: number }> => {
  try {
    const admin = getCurrentAdmin();
    if (!admin) throw new Error('Not authenticated as admin');
    
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        author:author_id(*),
        category:category_id(*)
      `, { count: 'exact' })
      .order('created_at', { ascending: false });
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }
    
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data: posts, count, error } = await query.range(from, to);
    
    if (error) throw error;
    
    return { 
      posts: posts || [], 
      count: count || 0 
    };
  } catch (error) {
    console.error('Error fetching admin posts:', error);
    return { posts: [], count: 0 };
  }
};

export const createPost = async (post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> => {
  try {
    const admin = getCurrentAdmin();
    if (!admin) throw new Error('Not authenticated as admin');
    
    // Extract tags from post object and create a clean post object without tags
    const { tags, ...postDataRaw } = {
      ...post,
      author_id: admin.id,
      published_at: post.status === 'published' ? new Date().toISOString() : null,
    };
    
    // Process the data to handle empty strings for UUID columns
    const postData = Object.entries(postDataRaw).reduce((acc, [key, value]) => {
      // If the value is an empty string and the key looks like an ID field, set it to null
      if (value === '' && (key.endsWith('_id') || key === 'id')) {
        acc[key] = null;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
    
    // Insert the post without tags
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([postData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating post:', error);
      throw error;
    }
    
    // Handle tags if provided
    if (tags && tags.length > 0 && data) {
      const postTagsData = tags.map(tag => ({
        post_id: data.id,
        tag_id: tag.id,
      }));
      
      const { error: tagsError } = await supabase
        .from('blog_posts_tags')
        .insert(postTagsData);
      
      if (tagsError) {
        console.error('Error adding post tags:', tagsError);
        throw tagsError;
      }
    }
    
    return data?.id || null;
  } catch (error) {
    console.error('Error creating post:', error);
    return null;
  }
};

export const updatePost = async (id: string, post: Partial<BlogPost>): Promise<boolean> => {
  try {
    const admin = getCurrentAdmin();
    if (!admin) throw new Error('Not authenticated as admin');
    
    // Extract tags from post object
    const { tags, ...postDataRaw } = post;
    
    // Process the data to handle empty strings for UUID columns
    const postData = Object.entries(postDataRaw).reduce((acc, [key, value]) => {
      // If the value is an empty string and the key looks like an ID field, set it to null
      if (value === '' && (key.endsWith('_id') || key === 'id')) {
        acc[key] = null;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
    
    // If changing status to published, set the published_at date
    if (post.status === 'published') {
      const currentPost = await getPostById(id);
      if (currentPost && currentPost.status !== 'published') {
        postData.published_at = new Date().toISOString();
      }
    }
    
    const { error } = await supabase
      .from('blog_posts')
      .update(postData)
      .eq('id', id);
    
    if (error) throw error;
    
    // Handle tags if provided
    if (tags) {
      // First, remove all existing tag relationships
      const { error: deleteError } = await supabase
        .from('blog_posts_tags')
        .delete()
        .eq('post_id', id);
      
      if (deleteError) throw deleteError;
      
      // Then add the new ones
      if (tags.length > 0) {
        const postTagsData = tags.map(tag => ({
          post_id: id,
          tag_id: tag.id,
        }));
        
        const { error: tagsError } = await supabase
          .from('blog_posts_tags')
          .insert(postTagsData);
        
        if (tagsError) throw tagsError;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error updating post:', error);
    return false;
  }
};

export const deletePost = async (id: string): Promise<boolean> => {
  try {
    const admin = getCurrentAdmin();
    if (!admin) throw new Error('Not authenticated as admin');
    
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
};

export const createCategory = async (category: Omit<BlogCategory, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> => {
  try {
    const admin = getCurrentAdmin();
    if (!admin) throw new Error('Not authenticated as admin');
    
    const { data, error } = await supabase
      .from('blog_categories')
      .insert([category])
      .select()
      .single();
    
    if (error) throw error;
    
    return data?.id || null;
  } catch (error) {
    console.error('Error creating category:', error);
    return null;
  }
};

export const updateCategory = async (id: string, category: Partial<BlogCategory>): Promise<boolean> => {
  try {
    const admin = getCurrentAdmin();
    if (!admin) throw new Error('Not authenticated as admin');
    
    const { error } = await supabase
      .from('blog_categories')
      .update(category)
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating category:', error);
    return false;
  }
};

export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    const admin = getCurrentAdmin();
    if (!admin) throw new Error('Not authenticated as admin');
    
    const { error } = await supabase
      .from('blog_categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    return false;
  }
};

export const createTag = async (tag: Omit<BlogTag, 'id' | 'created_at'>): Promise<string | null> => {
  try {
    const admin = getCurrentAdmin();
    if (!admin) throw new Error('Not authenticated as admin');
    
    const { data, error } = await supabase
      .from('blog_tags')
      .insert([tag])
      .select()
      .single();
    
    if (error) throw error;
    
    return data?.id || null;
  } catch (error) {
    console.error('Error creating tag:', error);
    return null;
  }
};

export const updateTag = async (id: string, tag: Partial<BlogTag>): Promise<boolean> => {
  try {
    const admin = getCurrentAdmin();
    if (!admin) throw new Error('Not authenticated as admin');
    
    const { error } = await supabase
      .from('blog_tags')
      .update(tag)
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating tag:', error);
    return false;
  }
};

export const deleteTag = async (id: string): Promise<boolean> => {
  try {
    const admin = getCurrentAdmin();
    if (!admin) throw new Error('Not authenticated as admin');
    
    const { error } = await supabase
      .from('blog_tags')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting tag:', error);
    return false;
  }
};

export const getAdminComments = async (
  page = 1, 
  limit = 10, 
  isApproved?: boolean
): Promise<{ comments: BlogComment[], count: number }> => {
  try {
    const admin = getCurrentAdmin();
    if (!admin) throw new Error('Not authenticated as admin');
    
    let query = supabase
      .from('blog_comments')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });
    
    if (isApproved !== undefined) {
      query = query.eq('is_approved', isApproved);
    }
    
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data: comments, count, error } = await query.range(from, to);
    
    if (error) throw error;
    
    return { 
      comments: comments || [], 
      count: count || 0 
    };
  } catch (error) {
    console.error('Error fetching admin comments:', error);
    return { comments: [], count: 0 };
  }
};

export const approveComment = async (id: string): Promise<boolean> => {
  try {
    const admin = getCurrentAdmin();
    if (!admin) throw new Error('Not authenticated as admin');
    
    const { error } = await supabase
      .from('blog_comments')
      .update({ is_approved: true })
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error approving comment:', error);
    return false;
  }
};

export const deleteComment = async (id: string): Promise<boolean> => {
  try {
    const admin = getCurrentAdmin();
    if (!admin) throw new Error('Not authenticated as admin');
    
    const { error } = await supabase
      .from('blog_comments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    return false;
  }
};

// Image upload
export const uploadImage = async (file: File): Promise<string | null> => {
  try {
    const admin = getCurrentAdmin();
    if (!admin) throw new Error('Not authenticated as admin');
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${fileName}`;
    
    const { error } = await supabase.storage
      .from('blog')
      .upload(filePath, file);
    
    if (error) throw error;
    
    const { data } = supabase.storage
      .from('blog')
      .getPublicUrl(filePath);
    
    return data.publicUrl || null;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
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
