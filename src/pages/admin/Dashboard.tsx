
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilePlus, LayoutGrid, MessageSquare, ArrowUpRight, Tag, FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface DashboardMetrics {
  posts: number;
  categories: number;
  tags: number;
  comments: number;
  pendingComments: number;
  drafts: number;
}

const AdminDashboard = () => {
  const { isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    posts: 0,
    categories: 0,
    tags: 0,
    comments: 0,
    pendingComments: 0,
    drafts: 0
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    } else {
      fetchDashboardMetrics();
    }
  }, [isAuthenticated, navigate]);

  const fetchDashboardMetrics = async () => {
    try {
      setIsLoading(true);
      // Fetch counts for different entities
      const [
        postsResponse,
        categoriesResponse,
        tagsResponse,
        commentsResponse,
        pendingCommentsResponse,
        draftsResponse
      ] = await Promise.all([
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('blog_categories').select('*', { count: 'exact', head: true }),
        supabase.from('blog_tags').select('*', { count: 'exact', head: true }),
        supabase.from('blog_comments').select('*', { count: 'exact', head: true }),
        supabase.from('blog_comments').select('*', { count: 'exact', head: true }).eq('is_approved', false),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('status', 'draft')
      ]);

      setMetrics({
        posts: postsResponse.count || 0,
        categories: categoriesResponse.count || 0,
        tags: tagsResponse.count || 0,
        comments: commentsResponse.count || 0,
        pendingComments: pendingCommentsResponse.count || 0,
        drafts: draftsResponse.count || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link to="/admin/posts/new" className="flex items-center">
            <FilePlus className="mr-2 h-4 w-4" /> New Post
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array(6).fill(null).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="bg-gray-100 h-16"></CardHeader>
              <CardContent className="pt-6">
                <div className="bg-gray-100 h-8 w-20 rounded mb-2"></div>
                <div className="bg-gray-100 h-6 w-32 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="bg-blue-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-500">Published Posts</CardTitle>
                <LayoutGrid className="h-5 w-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{metrics.posts}</div>
              <p className="text-gray-500 mt-1 text-sm">Total published blog posts</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Link to="/admin/posts" className="text-blue-600 text-sm font-medium hover:underline flex items-center">
                View all posts <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="bg-amber-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-500">Drafts</CardTitle>
                <FilePlus className="h-5 w-5 text-amber-500" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{metrics.drafts}</div>
              <p className="text-gray-500 mt-1 text-sm">Posts saved as draft</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Link to="/admin/posts?status=draft" className="text-amber-600 text-sm font-medium hover:underline flex items-center">
                View drafts <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="bg-green-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-500">Comments</CardTitle>
                <MessageSquare className="h-5 w-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{metrics.comments}</div>
              <p className="text-gray-500 mt-1 text-sm">
                {metrics.pendingComments > 0 && (
                  <span className="text-amber-600 font-medium">{metrics.pendingComments} pending approval</span>
                )}
                {metrics.pendingComments === 0 && "All comments approved"}
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Link to="/admin/comments" className="text-green-600 text-sm font-medium hover:underline flex items-center">
                Moderate comments <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="bg-purple-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-500">Categories</CardTitle>
                <FolderOpen className="h-5 w-5 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{metrics.categories}</div>
              <p className="text-gray-500 mt-1 text-sm">Content categories</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Link to="/admin/categories" className="text-purple-600 text-sm font-medium hover:underline flex items-center">
                Manage categories <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="bg-indigo-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-500">Tags</CardTitle>
                <Tag className="h-5 w-5 text-indigo-500" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{metrics.tags}</div>
              <p className="text-gray-500 mt-1 text-sm">Content tags</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Link to="/admin/tags" className="text-indigo-600 text-sm font-medium hover:underline flex items-center">
                Manage tags <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="bg-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-500">Quick Actions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/admin/posts/new">
                    <FilePlus className="mr-2 h-4 w-4" /> Create new post
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/admin/categories/new">
                    <FolderOpen className="mr-2 h-4 w-4" /> Add category
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/admin/tags/new">
                    <Tag className="mr-2 h-4 w-4" /> Add tag
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
