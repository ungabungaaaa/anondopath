
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import { ArrowLeft, Calendar, Clock, User, Tag, Share2, Facebook, Twitter, Linkedin, Mail, ChevronRight, ArrowRight, MessageSquare } from 'lucide-react';
import { getPostBySlug, getRelatedPosts, getApprovedComments, submitComment } from '@/services/blogService';
import { BlogPost, BlogComment } from '@/types/blog';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

const BlogDetail = () => {
  const { id: slug } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentForm, setCommentForm] = useState({
    author_name: '',
    author_email: '',
    content: ''
  });
  
  // Query to fetch blog post by slug
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blogPost', slug],
    queryFn: () => getPostBySlug(slug || ''),
    enabled: !!slug,
  });

  // Query to fetch related posts
  const { data: relatedPosts = [] } = useQuery({
    queryKey: ['relatedPosts', post?.id, post?.category_id],
    queryFn: () => getRelatedPosts(post?.id || '', post?.category_id || '', 3),
    enabled: !!(post?.id && post?.category_id),
  });

  // Query to fetch approved comments
  const { data: comments = [], refetch: refetchComments } = useQuery({
    queryKey: ['comments', post?.id],
    queryFn: () => getApprovedComments(post?.id || ''),
    enabled: !!post?.id,
  });
  
  // Add scroll animations
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
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCommentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post?.id) return;

    setIsSubmitting(true);
    try {
      await submitComment({
        post_id: post.id,
        ...commentForm
      });
      toast({
        title: "Comment submitted!",
        description: "Your comment has been submitted and will be visible after approval.",
      });
      setCommentForm({
        author_name: '',
        author_email: '',
        content: ''
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Comment submission failed",
        description: "There was an error submitting your comment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || 'Blog Post';
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this article: ${url}`)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank');
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 md:px-8 flex justify-center items-center" style={{ minHeight: '50vh' }}>
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-anondopath-teal"></div>
              <p className="mt-4 text-gray-600">Loading article...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Handle errors or non-existent post
  if (error || !post) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 md:px-8 text-center py-16">
            <h1 className="text-3xl font-bold mb-4">Blog post not found</h1>
            <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
            <Link to="/blog">
              <Button>Return to Blog</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 md:px-8 mb-8">
          <div className="flex items-center text-sm text-gray-500 space-x-2">
            <Link to="/" className="hover:text-anondopath-blue transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/blog" className="hover:text-anondopath-blue transition-colors">Blog</Link>
            <ChevronRight className="h-4 w-4" />
            {post.category && (
              <>
                <Link 
                  to={`/blog?category=${post.category.slug}`} 
                  className="hover:text-anondopath-blue transition-colors"
                >
                  {post.category.name}
                </Link>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
            <span className="text-gray-700 truncate">{post.title}</span>
          </div>
        </div>
        
        {/* Back Button */}
        <div className="container mx-auto px-4 md:px-8 mb-6">
          <Link to="/blog" className="inline-flex items-center text-anondopath-blue hover:text-anondopath-teal transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Articles
          </Link>
        </div>
        
        {/* Header */}
        <section className="container mx-auto px-4 md:px-8 mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 mb-4 slide-up">
              {post.category && (
                <Link 
                  to={`/blog?category=${post.category.slug}`} 
                  className="px-3 py-1 bg-anondopath-blue/10 text-anondopath-blue text-xs rounded-full hover:bg-anondopath-blue/20 transition-colors"
                >
                  {post.category.name}
                </Link>
              )}
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="h-4 w-4 mr-1" />
                <span>{post.read_time || '5 min read'}</span>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 slide-up" style={{ animationDelay: '0.1s' }}>
              {post.title}
            </h1>
            
            <div className="flex items-center space-x-4 mb-8 slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium">{post.author?.full_name || post.author?.username || 'Anonymous'}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {post.published_at 
                        ? new Date(post.published_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }) 
                        : new Date(post.created_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Image */}
        <section className="container mx-auto px-4 md:px-8 mb-12">
          <div className="max-w-5xl mx-auto rounded-xl overflow-hidden shadow-lg slide-up" style={{ animationDelay: '0.3s' }}>
            <img 
              src={post.featured_image || "/placeholder.svg"} 
              alt={post.title} 
              className="w-full h-auto object-cover max-h-96"
            />
          </div>
        </section>
        
        {/* Content */}
        <section className="container mx-auto px-4 md:px-8 mb-16">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Main Content */}
            <div className="md:col-span-9 slide-up" style={{ animationDelay: '0.4s' }}>
              <article className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
              </article>
              
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center text-gray-600 mr-2">
                      <Tag className="h-4 w-4 mr-2" />
                      <span className="font-medium">Tags:</span>
                    </div>
                    {post.tags.map((tag) => (
                      <Link 
                        key={tag.id} 
                        to={`/blog?tag=${tag.slug}`}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
                      >
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Share */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center text-gray-600">
                    <Share2 className="h-4 w-4 mr-2" />
                    <span className="font-medium">Share this article:</span>
                  </div>
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleShare('facebook')} 
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-600 flex items-center justify-center transition-colors" 
                      aria-label="Share on Facebook"
                    >
                      <Facebook className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleShare('twitter')} 
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-400 hover:text-white text-gray-600 flex items-center justify-center transition-colors" 
                      aria-label="Share on Twitter"
                    >
                      <Twitter className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleShare('linkedin')} 
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-700 hover:text-white text-gray-600 flex items-center justify-center transition-colors" 
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleShare('email')} 
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-500 hover:text-white text-gray-600 flex items-center justify-center transition-colors" 
                      aria-label="Share via Email"
                    >
                      <Mail className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-bold mb-6">Comments ({comments.length})</h3>
                
                {comments.length > 0 ? (
                  <div className="space-y-6 mb-8">
                    {comments.map(comment => (
                      <Card key={comment.id} className="bg-gray-50 border-gray-200">
                        <CardContent className="pt-6">
                          <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                              <User className="h-5 w-5 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{comment.author_name}</h4>
                                <span className="text-xs text-gray-500">
                                  {new Date(comment.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                              <p className="mt-2 text-gray-700">{comment.content}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 mb-8 text-center">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h4 className="font-medium text-lg">No comments yet</h4>
                    <p className="text-gray-500">Be the first to leave a comment on this article!</p>
                  </div>
                )}
                
                {/* Comment Form */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Leave a Comment</h3>
                  <form onSubmit={handleCommentSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="author_name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                        <Input
                          id="author_name"
                          name="author_name"
                          value={commentForm.author_name}
                          onChange={handleCommentChange}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="author_email" className="block text-sm font-medium text-gray-700 mb-1">Email * (will not be published)</label>
                        <Input
                          id="author_email"
                          name="author_email"
                          type="email"
                          value={commentForm.author_email}
                          onChange={handleCommentChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Comment *</label>
                      <Textarea
                        id="content"
                        name="content"
                        rows={4}
                        value={commentForm.content}
                        onChange={handleCommentChange}
                        required
                      />
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      Your comment will be visible after approval by a moderator.
                    </div>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit Comment'}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="md:col-span-3">
              <div className="sticky top-24 space-y-8">
                {/* Author Bio */}
                <div className="bg-gray-50 rounded-xl p-6 slide-up" style={{ animationDelay: '0.5s' }}>
                  <h3 className="font-bold text-lg mb-4">About the Author</h3>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium">{post.author?.full_name || post.author?.username || 'Anonymous'}</p>
                      <p className="text-sm text-gray-500">Education Specialist</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Specializing in digital education trends and educational technology integration in K-12 classrooms.
                  </p>
                </div>
                
                {/* Popular Articles */}
                {relatedPosts.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-6 slide-up" style={{ animationDelay: '0.6s' }}>
                    <h3 className="font-bold text-lg mb-4">Popular Articles</h3>
                    <div className="space-y-4">
                      {relatedPosts.slice(0, 3).map((relatedPost) => (
                        <div key={relatedPost.id} className="flex items-start space-x-3">
                          <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-200">
                            <img 
                              src={relatedPost.featured_image || "/placeholder.svg"} 
                              alt={relatedPost.title} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div>
                            <Link 
                              to={`/blog/${relatedPost.slug}`} 
                              className="text-sm font-medium hover:text-anondopath-blue transition-colors leading-tight block"
                            >
                              {relatedPost.title}
                            </Link>
                            <p className="text-xs text-gray-500 mt-1">
                              {relatedPost.published_at 
                                ? new Date(relatedPost.published_at).toLocaleDateString() 
                                : new Date(relatedPost.created_at).toLocaleDateString()
                              }
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4 md:px-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 slide-up">Related Articles</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost, index) => (
                  <div 
                    key={relatedPost.id} 
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={relatedPost.featured_image || "/placeholder.svg"}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 bg-anondopath-blue/10 text-anondopath-blue text-xs rounded-full">
                          {relatedPost.category?.name || 'Uncategorized'}
                        </span>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{relatedPost.read_time || '5 min read'}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-3">{relatedPost.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{relatedPost.excerpt}</p>
                      
                      <Link 
                        to={`/blog/${relatedPost.slug}`} 
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
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogDetail;
