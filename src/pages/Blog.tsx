
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import { ArrowRight, Clock, Calendar, Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { getPosts, getCategories, getTags } from '@/services/blogService';
import { BlogPost, BlogCategory, BlogTag } from '@/types/blog';

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  
  // Get filters from URL
  const categoryFilter = searchParams.get('category') || '';
  const tagFilter = searchParams.get('tag') || '';
  
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [fetchedCategories, fetchedTags] = await Promise.all([
          getCategories(),
          getTags()
        ]);
        
        setCategories(fetchedCategories);
        setTags(fetchedTags);
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };
    
    fetchMetadata();
  }, []);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        const searchFromUrl = searchParams.get('search') || undefined;
        
        const { posts: fetchedPosts, count } = await getPosts(
          1, 
          6, 
          categoryFilter || undefined, 
          tagFilter || undefined, 
          searchFromUrl
        );
        
        setPosts(fetchedPosts);
        setHasMore(fetchedPosts.length < count);
        setPage(1);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
    // Reset search input when URL changes
    setSearchQuery(searchParams.get('search') || '');
    
  }, [searchParams]);
  
  const loadMorePosts = async () => {
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      
      const { posts: morePosts, count } = await getPosts(
        nextPage,
        6,
        categoryFilter || undefined,
        tagFilter || undefined,
        searchParams.get('search') || undefined
      );
      
      setPosts(prevPosts => [...prevPosts, ...morePosts]);
      setHasMore(posts.length + morePosts.length < count);
      setPage(nextPage);
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoadingMore(false);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery) {
      searchParams.set('search', searchQuery);
    } else {
      searchParams.delete('search');
    }
    
    // Reset other filters when searching
    searchParams.delete('category');
    searchParams.delete('tag');
    
    setSearchParams(searchParams);
  };
  
  const handleClearFilters = () => {
    setSearchParams({});
  };
  
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const getCategoryName = (categoryId?: string | null) => {
    if (!categoryId) return 'Uncategorized';
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Uncategorized';
  };
  
  const activeFilters = searchParams.get('search') || categoryFilter || tagFilter;
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-anondopath-blue/20 to-anondopath-teal/20 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">Blog & Resources</h1>
              <p className="text-lg text-gray-600 mb-8">
                Stay up-to-date with the latest in digital education and language learning tools.
              </p>
              
              {/* Search Form */}
              <form onSubmit={handleSearch} className="flex w-full max-w-lg mx-auto">
                <Input
                  type="text"
                  placeholder="Search articles..."
                  className="rounded-r-none border-r-0 focus:ring-anondopath-teal"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" className="rounded-l-none">
                  <Search className="h-4 w-4 mr-2" /> Search
                </Button>
              </form>
            </div>
          </div>
        </section>
        
        {/* Filters */}
        <section className="py-8 border-b border-gray-200">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <h2 className="font-medium">Filters:</h2>
              </div>
              
              <div className="flex flex-wrap gap-2 items-center">
                {categories.map(category => (
                  <Link
                    key={category.id}
                    to={`/blog?category=${category.slug}`}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      categoryFilter === category.slug
                        ? 'bg-anondopath-blue text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              
              {activeFilters && (
                <Button 
                  onClick={handleClearFilters} 
                  variant="ghost" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-2" /> Clear filters
                </Button>
              )}
            </div>
            
            {tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-500">Popular tags:</span>
                {tags.slice(0, 10).map(tag => (
                  <Link
                    key={tag.id}
                    to={`/blog?tag=${tag.slug}`}
                    className={`px-2 py-0.5 rounded-full text-xs transition-colors ${
                      tagFilter === tag.slug
                        ? 'bg-anondopath-teal text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* Active Filters Display */}
        {activeFilters && (
          <section className="py-4 border-b border-gray-200">
            <div className="container mx-auto px-4 md:px-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-gray-500">Currently viewing:</span>
                {searchParams.get('search') && (
                  <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    Search: "{searchParams.get('search')}"
                  </div>
                )}
                {categoryFilter && (
                  <div className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                    Category: {
                      categories.find(c => c.slug === categoryFilter)?.name || 
                      categoryFilter
                    }
                  </div>
                )}
                {tagFilter && (
                  <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    Tag: {
                      tags.find(t => t.slug === tagFilter)?.name || 
                      tagFilter
                    }
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
        
        {/* Blog Posts */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-8">
            {error && (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            )}
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array(6).fill(null).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-200">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-6">
                      <Skeleton className="h-4 w-24 mb-3" />
                      <Skeleton className="h-6 w-full mb-2" />
                      <Skeleton className="h-6 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3 mb-4" />
                      <Skeleton className="h-10 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {posts.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-2xl font-bold mb-4">No posts found</h3>
                    <p className="text-gray-600 mb-8">
                      {activeFilters 
                        ? "Try changing your search criteria or removing filters."
                        : "Check back soon for new content."}
                    </p>
                    {activeFilters && (
                      <Button onClick={handleClearFilters}>
                        Clear All Filters
                      </Button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {posts.map((post, index) => (
                        <div 
                          key={post.id} 
                          className="bg-white rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-md slide-up"
                          data-aos="fade-up"
                          data-aos-delay={index * 100}
                          data-aos-offset="200"
                        >
                          <Link to={`/blog/${post.slug}`} className="block h-48 overflow-hidden">
                            <img 
                              src={post.featured_image || "/placeholder.svg"}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                          </Link>
                          
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-3">
                              <Link 
                                to={post.category?.slug ? `/blog?category=${post.category.slug}` : '#'}
                                className="px-3 py-1 bg-anondopath-blue/10 text-anondopath-blue text-xs rounded-full hover:bg-anondopath-blue/20 transition-colors"
                              >
                                {getCategoryName(post.category_id)}
                              </Link>
                              <div className="flex items-center text-gray-500 text-sm">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{post.read_time || '5 min read'}</span>
                              </div>
                            </div>
                            
                            <Link to={`/blog/${post.slug}`}>
                              <h3 className="text-xl font-bold mb-3 hover:text-anondopath-blue transition-colors">
                                {post.title}
                              </h3>
                            </Link>
                            
                            <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                            
                            <div className="flex items-center justify-between mt-6">
                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>{formatDate(post.published_at || post.created_at)}</span>
                              </div>
                              
                              <Link 
                                to={`/blog/${post.slug}`} 
                                className="text-anondopath-teal hover:text-anondopath-blue inline-flex items-center font-medium transition-colors"
                              >
                                Read More <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {hasMore && (
                      <div className="mt-12 text-center">
                        <Button 
                          onClick={loadMorePosts} 
                          disabled={loadingMore}
                          variant="outline"
                          size="lg"
                        >
                          {loadingMore ? 'Loading...' : 'Load More Posts'}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
