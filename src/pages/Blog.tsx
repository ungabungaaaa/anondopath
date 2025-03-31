
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BlogList from '@/components/BlogList';
import { getCategories, getTags } from '@/services/blogService';
import { BlogCategory, BlogTag } from '@/types/blog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const categoryParam = searchParams.get('category');
  const tagParam = searchParams.get('tag');

  useEffect(() => {
    const fetchSidebar = async () => {
      try {
        const [fetchedCategories, fetchedTags] = await Promise.all([
          getCategories(),
          getTags()
        ]);

        setCategories(fetchedCategories);
        setTags(fetchedTags);
      } catch (error) {
        console.error('Error fetching sidebar data:', error);
      }
    };

    fetchSidebar();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery.trim() });
    } else {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('search');
      setSearchParams(newParams);
    }
  };

  const handleCategoryClick = (slug: string) => {
    setSearchParams({ category: slug });
  };

  const handleTagClick = (slug: string) => {
    setSearchParams({ tag: slug });
  };

  const handleClearFilters = () => {
    setSearchParams({});
    setSearchQuery('');
  };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Latest news, updates, and stories about AnonDoPath
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-3/4">
          {(categoryParam || tagParam || searchParams.get('search')) && (
            <div className="mb-6 flex items-center">
              <h2 className="text-lg font-medium mr-2">
                {categoryParam && 
                  `Category: ${categories.find(c => c.slug === categoryParam)?.name || categoryParam}`}
                {tagParam && 
                  `Tag: ${tags.find(t => t.slug === tagParam)?.name || tagParam}`}
                {searchParams.get('search') && 
                  `Search: "${searchParams.get('search')}"`}
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                Clear filters
              </Button>
            </div>
          )}
          
          <BlogList 
            categorySlug={categoryParam || undefined} 
            tagSlug={tagParam || undefined}
          />
        </div>

        <div className="lg:w-1/4 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Search</h3>
              <form onSubmit={handleSearch} className="flex">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts..."
                  className="rounded-r-none"
                />
                <Button type="submit" variant="default" className="rounded-l-none px-3">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.length > 0 ? (
                  <div className="flex flex-col space-y-1">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.slug)}
                        className={`text-left px-2 py-1 rounded hover:bg-gray-100 ${
                          categoryParam === category.slug ? 'bg-gray-100 font-medium' : ''
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No categories available</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.length > 0 ? (
                  tags.map(tag => (
                    <Badge
                      key={tag.id}
                      variant={tagParam === tag.slug ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleTagClick(tag.slug)}
                    >
                      {tag.name}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No tags available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Blog;
