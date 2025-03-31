
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPostBySlug, getRelatedPosts } from '@/services/blogService';
import { BlogPost } from '@/types/blog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';

const BlogDetail = () => {
  const { id: slug } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      try {
        const fetchedPost = await getPostBySlug(slug);
        
        if (fetchedPost) {
          setPost(fetchedPost);
          
          // Fetch related posts if we have a category
          if (fetchedPost.category_id) {
            const related = await getRelatedPosts(fetchedPost.id, fetchedPost.category_id);
            setRelatedPosts(related);
          }
        } else {
          // Post not found, redirect to blog listing
          navigate('/blog');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [slug, navigate]);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 animate-pulse">
        <div className="max-w-3xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
        <p className="text-gray-600 mb-8">The post you're looking for doesn't exist or has been removed.</p>
        <Link to="/blog" className="text-primary hover:underline flex items-center justify-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/blog" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all posts
        </Link>
        
        <article>
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
              {post.category && (
                <Badge variant="secondary">
                  {post.category.name}
                </Badge>
              )}
              
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-sm">{formatDate(post.published_at)}</span>
              </div>
              
              {post.read_time && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">{post.read_time}</span>
                </div>
              )}
            </div>
            
            {post.featured_image && (
              <div className="mb-8">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full rounded-lg object-cover max-h-[500px]"
                />
              </div>
            )}
            
            {post.excerpt && (
              <div className="text-xl text-gray-600 mb-6">
                {post.excerpt}
              </div>
            )}
          </header>
          
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />
          
          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center flex-wrap gap-2">
                <Tag className="h-5 w-5 text-gray-500" />
                {post.tags.map(tag => (
                  <Link key={tag.id} to={`/blog?tag=${tag.slug}`}>
                    <Badge variant="outline" className="hover:bg-secondary">
                      {tag.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
        
        {relatedPosts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map(relatedPost => (
                <Card key={relatedPost.id}>
                  {relatedPost.featured_image && (
                    <Link to={`/blog/${relatedPost.slug}`}>
                      <img
                        src={relatedPost.featured_image}
                        alt={relatedPost.title}
                        className="w-full h-40 object-cover rounded-t-lg"
                      />
                    </Link>
                  )}
                  <CardContent className="pt-4">
                    <Link to={`/blog/${relatedPost.slug}`}>
                      <h3 className="font-bold hover:text-primary transition-colors">
                        {relatedPost.title}
                      </h3>
                    </Link>
                    <div className="text-sm text-gray-500 mt-1">
                      {formatDate(relatedPost.published_at)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;
