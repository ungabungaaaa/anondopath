
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, Clock, ArrowRight, Tag, User } from 'lucide-react';
import Button from '@/components/Button';
import { getPosts, getCategories, getTags } from '@/services/blogService';
import { BlogPost, BlogCategory, BlogTag } from '@/types/blog';
import { Link } from 'react-router-dom';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useQuery } from '@tanstack/react-query';

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const searchQuery = searchParams.get('search') || '';
  const activeCategory = searchParams.get('category') || 'All';
  const activeTag = searchParams.get('tag') || '';
  const postsPerPage = 9;

  // Set up states for UI elements
  const [searchInput, setSearchInput] = useState(searchQuery);
  
  // Add intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.slide-up');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Query for posts
  const { data: postsData, isLoading: isLoadingPosts } = useQuery({
    queryKey: ['posts', currentPage, activeCategory, activeTag, searchQuery],
    queryFn: () => getPosts(currentPage, postsPerPage, 
      activeCategory !== 'All' ? activeCategory : undefined, 
      activeTag || undefined,
      searchQuery || undefined
    ),
  });

  // Query for categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query for tags
  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update URL params
    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); // Reset to first page on new search
    params.set('search', searchInput);
    setSearchParams(params);
  };

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); // Reset to first page on category change
    if (category === 'All') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    setSearchParams(params);
  };

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); // Reset to first page on tag change
    params.set('tag', tag);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchInput('');
    const params = new URLSearchParams();
    params.set('page', '1');
    setSearchParams(params);
  };

  // Get the featured and regular posts
  const featuredPosts = postsData?.posts.slice(0, 3) || [];
  const regularPosts = postsData?.posts.slice(3) || [];

  // Calculate total pages
  const totalPages = postsData?.count ? Math.ceil(postsData.count / postsPerPage) : 0;

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);
      
      // Add middle pages
      const leftBound = Math.max(2, currentPage - 1);
      const rightBound = Math.min(totalPages - 1, currentPage + 1);
      
      // Add ellipsis for left side if needed
      if (leftBound > 2) {
        pages.push(-1); // -1 will render as ellipsis
      }
      
      // Add visible numbered pages
      for (let i = leftBound; i <= rightBound; i++) {
        pages.push(i);
      }
      
      // Add ellipsis for right side if needed
      if (rightBound < totalPages - 1) {
        pages.push(-2); // -2 will render as ellipsis
      }
      
      // Always include last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center max-w-4xl mx-auto slide-up">
              <span className="bg-anondopath-teal/10 text-anondopath-teal px-4 py-1 rounded-full text-sm font-medium">
                Our Blog
              </span>
              <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="blue-gradient-text">Insights & Resources</span> for
                <br className="hidden md:block" /> Modern Educators
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                Discover the latest trends, tips, and stories from the world of digital education and interactive learning.
              </p>
              
              <div className="mt-8 max-w-xl mx-auto">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Search articles..."
                      className="w-full px-5 py-3 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-anondopath-teal/50 focus:border-anondopath-teal"
                    />
                    <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Search className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-8 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => handleCategoryChange('All')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === 'All'
                    ? 'bg-anondopath-teal text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category.slug
                      ? 'bg-anondopath-teal text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            {/* Active filters display */}
            {(searchQuery || activeTag) && (
              <div className="flex flex-wrap items-center justify-center mt-4 gap-2">
                <span className="text-sm text-gray-500">Active filters:</span>
                {searchQuery && (
                  <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs flex items-center">
                    Search: {searchQuery}
                  </div>
                )}
                {activeTag && (
                  <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs flex items-center">
                    Tag: {activeTag}
                  </div>
                )}
                <button 
                  onClick={clearFilters}
                  className="text-xs text-red-600 hover:text-red-800 ml-2"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Loading State */}
        {isLoadingPosts && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 md:px-8 text-center">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-anondopath-teal"></div>
              </div>
              <p className="mt-4 text-gray-600">Loading posts...</p>
            </div>
          </section>
        )}

        {/* Featured Posts */}
        {!isLoadingPosts && featuredPosts.length > 0 && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 md:px-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 slide-up">Featured Articles</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {featuredPosts.map((post, index) => (
                  <div 
                    key={post.id} 
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={post.featured_image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 bg-anondopath-blue/10 text-anondopath-blue text-xs rounded-full">
                          {post.category?.name || 'Uncategorized'}
                        </span>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{post.read_time || '5 min read'}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-3">{post.title}</h3>
                      <p className="text-gray-600 mb-4">{post.excerpt}</p>
                      
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-500" />
                          </div>
                          <span className="text-sm text-gray-600">{post.author?.full_name || post.author?.username || 'Anonymous'}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {post.published_at ? new Date(post.published_at).toLocaleDateString() : new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <Link 
                        to={`/blog/${post.slug}`} 
                        className="mt-4 text-anondopath-teal hover:text-anondopath-blue inline-flex items-center font-medium transition-colors"
                      >
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Recent Posts */}
        {!isLoadingPosts && regularPosts.length > 0 && (
          <section className="py-16 bg-gradient-to-r from-anondopath-blue/5 to-anondopath-teal/5">
            <div className="container mx-auto px-4 md:px-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 slide-up">Recent Articles</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post, index) => (
                  <div 
                    key={post.id} 
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={post.featured_image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 bg-anondopath-blue/10 text-anondopath-blue text-xs rounded-full">
                          {post.category?.name || 'Uncategorized'}
                        </span>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{post.read_time || '5 min read'}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-3">{post.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                      
                      <Link 
                        to={`/blog/${post.slug}`} 
                        className="mt-4 text-anondopath-teal hover:text-anondopath-blue inline-flex items-center font-medium transition-colors"
                      >
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => {
                            if (currentPage > 1) {
                              const params = new URLSearchParams(searchParams);
                              params.set('page', (currentPage - 1).toString());
                              setSearchParams(params);
                            }
                          }}
                          className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {getPageNumbers().map((page, i) => (
                        <PaginationItem key={i}>
                          {page < 0 ? (
                            <span className="px-4 py-2">...</span>
                          ) : (
                            <PaginationLink
                              onClick={() => {
                                const params = new URLSearchParams(searchParams);
                                params.set('page', page.toString());
                                setSearchParams(params);
                              }}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => {
                            if (currentPage < totalPages) {
                              const params = new URLSearchParams(searchParams);
                              params.set('page', (currentPage + 1).toString());
                              setSearchParams(params);
                            }
                          }}
                          className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Empty State (No results) */}
        {!isLoadingPosts && postsData?.posts.length === 0 && (
          <section className="py-24 bg-white">
            <div className="container mx-auto px-4 md:px-8 text-center">
              <div className="max-w-md mx-auto">
                <Search className="mx-auto h-16 w-16 text-gray-300 mb-6" />
                <h2 className="text-2xl font-bold mb-4">No articles found</h2>
                <p className="text-gray-600 mb-8">
                  We couldn't find any articles matching your search criteria. Try adjusting your search terms or browse all categories.
                </p>
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                >
                  View All Articles
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Tags Section */}
        <section className="py-12 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 md:px-8">
            <h2 className="text-xl font-bold mb-6">Popular Tags</h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleTagClick(tag.slug)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    activeTag === tag.slug
                      ? 'bg-anondopath-blue text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 md:py-24 bg-anondopath-blue">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 md:p-12 slide-up">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
                  <p className="text-gray-600 mb-6">
                    Stay up-to-date with the latest educational insights, teaching resources, and product updates.
                  </p>
                  
                  <form className="space-y-4">
                    <div>
                      <input 
                        type="text" 
                        placeholder="Your Name" 
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-anondopath-teal/50 focus:border-anondopath-teal"
                        required
                      />
                    </div>
                    <div>
                      <input 
                        type="email" 
                        placeholder="Your Email" 
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-anondopath-teal/50 focus:border-anondopath-teal"
                        required
                      />
                    </div>
                    <div>
                      <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-anondopath-teal/50 focus:border-anondopath-teal bg-white">
                        <option value="">Preferred Content Topics</option>
                        <option value="teaching-tips">Teaching Tips</option>
                        <option value="edtech-trends">EdTech Trends</option>
                        <option value="product-updates">Product Updates</option>
                        <option value="all">All Topics</option>
                      </select>
                    </div>
                    <Button variant="primary" className="w-full" animate>
                      Subscribe
                    </Button>
                  </form>
                  
                  <p className="text-xs text-gray-500 mt-4">
                    By subscribing, you agree to our privacy policy and consent to receive updates from our company.
                  </p>
                </div>
                
                <div className="hidden md:block bg-gradient-to-br from-anondopath-blue to-anondopath-teal relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 pattern-dots pattern-white pattern-size-4 pattern-diagonal-lines"></div>
                  <div className="relative p-12 text-white flex items-center h-full">
                    <div className="slide-up">
                      <h3 className="text-xl font-bold mb-4">Why Subscribe?</h3>
                      <ul className="space-y-4">
                        {[
                          "Weekly teaching tips and lesson ideas",
                          "Early access to new features",
                          "Exclusive educational resources",
                          "Stories from successful classrooms",
                          "Industry insights and trends"
                        ].map((benefit, i) => (
                          <li key={i} className="flex items-start">
                            <Tag className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
