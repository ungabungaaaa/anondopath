
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '@/services/blogService';
import { BlogPost } from '@/types/blog';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface BlogListProps {
  limit?: number;
  showPagination?: boolean;
  categorySlug?: string;
  tagSlug?: string;
  featured?: boolean;
}

const BlogList: React.FC<BlogListProps> = ({
  limit = 6,
  showPagination = true,
  categorySlug,
  tagSlug,
  featured = false
}) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const { posts: fetchedPosts, count } = await getPosts(
          currentPage,
          limit,
          categorySlug,
          tagSlug
        );
        
        setPosts(fetchedPosts);
        setTotalPosts(count);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, [currentPage, limit, categorySlug, tagSlug]);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalPages = Math.ceil(totalPosts / limit);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (isLoading) {
    return (
      <div className="w-full py-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: limit }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-600">No posts found</h3>
        <p className="text-gray-500 mt-2">Check back later for new content</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden flex flex-col">
            {post.featured_image && (
              <Link to={`/blog/${post.slug}`}>
                <img 
                  src={post.featured_image} 
                  alt={post.title} 
                  className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                />
              </Link>
            )}
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2 mb-2">
                {post.category && (
                  <Badge variant="secondary" className="font-normal">
                    {post.category.name}
                  </Badge>
                )}
                <span className="text-xs text-gray-500">
                  {formatDate(post.published_at)}
                </span>
              </div>
              <Link to={`/blog/${post.slug}`} className="hover:underline">
                <h3 className="font-bold text-xl leading-tight mb-1">{post.title}</h3>
              </Link>
              {post.read_time && (
                <span className="text-xs text-gray-500">{post.read_time}</span>
              )}
            </CardHeader>
            <CardContent className="pb-4 flex-grow">
              {post.excerpt && (
                <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt}</p>
              )}
            </CardContent>
            <CardFooter className="pt-0 flex justify-between items-center">
              <div className="flex flex-wrap gap-1 text-xs">
                {post.tags && post.tags.slice(0, 3).map(tag => (
                  <Badge key={tag.id} variant="outline" className="text-xs">
                    {tag.name}
                  </Badge>
                ))}
                {post.tags && post.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{post.tags.length - 3}
                  </Badge>
                )}
              </div>
              <Link 
                to={`/blog/${post.slug}`} 
                className="text-sm font-medium text-primary hover:underline"
              >
                Read more
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {showPagination && totalPages > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    className="cursor-pointer" 
                  />
                </PaginationItem>
              )}
              
              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                // Show first page, last page, and pages around current page
                if (
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-md flex items-center justify-center text-sm
                          ${currentPage === page 
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-muted'
                          }`}
                      >
                        {page}
                      </button>
                    </PaginationItem>
                  );
                } else if (
                  (page === currentPage - 2 && currentPage > 3) || 
                  (page === currentPage + 2 && currentPage < totalPages - 2)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <span className="flex items-center justify-center w-10 h-10">...</span>
                    </PaginationItem>
                  );
                }
                return null;
              })}
              
              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    className="cursor-pointer"
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default BlogList;
