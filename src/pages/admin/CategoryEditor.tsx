
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { getCategories, createCategory, updateCategory, generateSlug } from '@/services/blogService';
import { BlogCategory } from '@/types/blog';

const CategoryEditor = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [category, setCategory] = useState<Partial<BlogCategory>>({
    name: '',
    slug: '',
    description: ''
  });
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // If editing, fetch the category
        if (isEditMode && id) {
          const fetchedCategories = await getCategories();
          const categoryToEdit = fetchedCategories.find(cat => cat.id === id);
          
          if (categoryToEdit) {
            setCategory(categoryToEdit);
          } else {
            toast({
              variant: "destructive",
              title: "Category not found",
              description: "The category you're trying to edit doesn't exist.",
            });
            navigate('/admin/categories');
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
    setCategory(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug when name changes
    if (name === 'name' && (!isEditMode || !category.slug)) {
      const generatedSlug = generateSlug(value);
      setCategory(prev => ({ ...prev, slug: generatedSlug }));
    }
  };
  
  const handleSave = async () => {
    try {
      if (!category.name) {
        toast({
          variant: "destructive",
          title: "Validation error",
          description: "Category name is required.",
        });
        return;
      }
      
      setIsSaving(true);
      
      let success;
      if (isEditMode && id) {
        success = await updateCategory(id, category);
      } else {
        const newCategoryId = await createCategory(category as Omit<BlogCategory, 'id' | 'created_at' | 'updated_at'>);
        success = !!newCategoryId;
      }
      
      if (success) {
        toast({
          title: isEditMode ? "Category updated" : "Category created",
          description: `The category has been ${isEditMode ? 'updated' : 'created'} successfully.`,
        });
        navigate('/admin/categories');
      } else {
        throw new Error("Operation failed");
      }
    } catch (error) {
      console.error('Save error:', error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "There was an error saving the category.",
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
          <Link to="/admin/categories" className="mr-4 text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Category' : 'Create New Category'}</h1>
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
                  value={category.name || ''}
                  onChange={handleChange}
                  placeholder="Enter category name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={category.slug || ''}
                  onChange={handleChange}
                  placeholder="category-url-slug"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={category.description || ''}
                  onChange={handleChange}
                  placeholder="Enter category description"
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CategoryEditor;
