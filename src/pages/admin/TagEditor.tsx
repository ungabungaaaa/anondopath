
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { getTags, createTag, updateTag, generateSlug } from '@/services/blogService';
import { BlogTag } from '@/types/blog';

const TagEditor = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [tag, setTag] = useState<Partial<BlogTag>>({
    name: '',
    slug: '',
  });
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // If editing, fetch the tag
        if (isEditMode && id) {
          const fetchedTags = await getTags();
          const tagToEdit = fetchedTags.find(t => t.id === id);
          
          if (tagToEdit) {
            setTag(tagToEdit);
          } else {
            toast({
              variant: "destructive",
              title: "Tag not found",
              description: "The tag you're trying to edit doesn't exist.",
            });
            navigate('/admin/tags');
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTag(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug when name changes
    if (name === 'name' && (!isEditMode || !tag.slug)) {
      const generatedSlug = generateSlug(value);
      setTag(prev => ({ ...prev, slug: generatedSlug }));
    }
  };
  
  const handleSave = async () => {
    try {
      if (!tag.name) {
        toast({
          variant: "destructive",
          title: "Validation error",
          description: "Tag name is required.",
        });
        return;
      }
      
      setIsSaving(true);
      
      let success;
      if (isEditMode && id) {
        success = await updateTag(id, tag);
      } else {
        const newTagId = await createTag(tag as Omit<BlogTag, 'id' | 'created_at'>);
        success = !!newTagId;
      }
      
      if (success) {
        toast({
          title: isEditMode ? "Tag updated" : "Tag created",
          description: `The tag has been ${isEditMode ? 'updated' : 'created'} successfully.`,
        });
        navigate('/admin/tags');
      } else {
        throw new Error("Operation failed");
      }
    } catch (error) {
      console.error('Save error:', error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "There was an error saving the tag.",
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
          <Link to="/admin/tags" className="mr-4 text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Tag' : 'Create New Tag'}</h1>
        </div>
        <Button onClick={handleSave} disabled={isLoading || isSaving}>
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>
      
      {isLoading ? (
        <div className="p-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={tag.name || ''}
                  onChange={handleChange}
                  placeholder="Enter tag name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={tag.slug || ''}
                  onChange={handleChange}
                  placeholder="tag-url-slug"
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TagEditor;
