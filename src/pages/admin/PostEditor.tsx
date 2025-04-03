import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Eye, Upload, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPostById, getCategories, getTags, createPost, updatePost, uploadImage, generateSlug, calculateReadingTime } from '@/services/blogService';
import { BlogPost, BlogCategory, BlogTag } from '@/types/blog';
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const PostEditor = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAdminAuth();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [post, setPost] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category_id: '',
    status: 'draft',
    tags: []
  });
  
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [availableTags, setAvailableTags] = useState<BlogTag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch categories and tags
        const fetchedCategories = await getCategories();
        const fetchedTags = await getTags();
        
        setCategories(fetchedCategories);
        setAvailableTags(fetchedTags);
        
        // If editing, fetch the post
        if (isEditMode && id) {
          const fetchedPost = await getPostById(id);
          if (fetchedPost) {
            setPost(fetchedPost);
            setSelectedTagIds(fetchedPost.tags?.map(tag => tag.id) || []);
          } else {
            toast({
              variant: "destructive",
              title: "Post not found",
              description: "The post you're trying to edit doesn't exist.",
            });
            navigate('/admin/posts');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load data. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditMode, isAuthenticated, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug when title changes
    if (name === 'title' && (!isEditMode || !post.slug)) {
      const generatedSlug = generateSlug(value);
      setPost(prev => ({ ...prev, slug: generatedSlug }));
    }
  };
  
  const handleCategoryChange = (value: string) => {
    setPost(prev => ({ ...prev, category_id: value }));
  };
  
  const handleStatusChange = (value: string) => {
    setPost(prev => ({ ...prev, status: value as 'draft' | 'published' }));
  };
  
  const handleTagsChange = (tagId: string) => {
    setSelectedTagIds(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      const imageUrl = await uploadImage(file);
      
      if (imageUrl) {
        setPost(prev => ({ ...prev, featured_image: imageUrl }));
        toast({
          title: "Image uploaded",
          description: "Featured image has been uploaded successfully.",
        });
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading the image.",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRemoveImage = () => {
    setPost(prev => ({ ...prev, featured_image: '' }));
  };
  
  const handleSave = async (publishImmediately = false) => {
    try {
      if (!post.title) {
        toast({
          variant: "destructive",
          title: "Validation error",
          description: "Post title is required.",
        });
        return;
      }
      
      setIsSaving(true);
      
      // Set the status if publishing immediately
      const postToSave = {
        ...post,
        status: publishImmediately ? 'published' : post.status,
        read_time: post.content ? calculateReadingTime(post.content) : null,
        tags: selectedTagIds.map(id => ({ id })) as BlogTag[]
      };
      
      let success;
      if (isEditMode && id) {
        success = await updatePost(id, postToSave);
      } else {
        const newPostId = await createPost(postToSave as Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>);
        success = !!newPostId;
      }
      
      if (success) {
        toast({
          title: isEditMode ? "Post updated" : "Post created",
          description: publishImmediately
            ? "The post has been published successfully."
            : "The post has been saved as a draft.",
        });
        navigate('/admin/posts');
      } else {
        throw new Error("Operation failed");
      }
    } catch (error) {
      console.error('Save error:', error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "There was an error saving the post.",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link to="/admin/posts" className="mr-4 text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Post' : 'Create New Post'}</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleSave(false)} disabled={isLoading || isSaving}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button onClick={() => handleSave(true)} disabled={isLoading || isSaving}>
            <Eye className="mr-2 h-4 w-4" />
            {post.status === 'published' ? 'Update' : 'Publish'}
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="p-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={post.title || ''}
                      onChange={handleChange}
                      placeholder="Enter post title"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      name="slug"
                      value={post.slug || ''}
                      onChange={handleChange}
                      placeholder="post-url-slug"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      name="excerpt"
                      value={post.excerpt || ''}
                      onChange={handleChange}
                      placeholder="Brief description (shown in post listings)"
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <Tabs defaultValue="write" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="write">Write</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  <TabsContent value="write">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      name="content"
                      value={post.content || ''}
                      onChange={handleChange}
                      placeholder="Write your post content here..."
                      className="mt-1"
                      rows={20}
                    />
                  </TabsContent>
                  <TabsContent value="preview">
                    <div className="border rounded-md p-4 min-h-[400px] prose max-w-none">
                      {post.content ? (
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                      ) : (
                        <p className="text-gray-400">No content to preview</p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Post Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={post.status || 'draft'} 
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={post.category_id || 'uncategorized'} 
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="uncategorized">Uncategorized</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Featured Image</h3>
                
                {post.featured_image ? (
                  <div className="space-y-3">
                    <img 
                      src={post.featured_image} 
                      alt="Featured" 
                      className="w-full h-auto rounded-md border border-gray-200"
                    />
                    <Button variant="destructive" onClick={handleRemoveImage} className="w-full">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center relative">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Click to upload an image</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button 
                      variant="secondary" 
                      className="mt-2" 
                      disabled={isUploading}
                    >
                      {isUploading ? 'Uploading...' : 'Upload Image'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Tags</h3>
                
                <div className="space-y-2">
                  {availableTags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map(tag => (
                        <div
                          key={tag.id}
                          className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                            selectedTagIds.includes(tag.id)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                          onClick={() => handleTagsChange(tag.id)}
                        >
                          {tag.name}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No tags available. Create some tags first.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostEditor;
