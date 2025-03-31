
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  FolderOpen, 
  Tag, 
  MessageSquare, 
  ArrowRight,
  PlusCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { getAdminPosts } from '@/services/blogService';

const StatCard = ({ title, value, icon, linkTo, color }: { 
  title: string; 
  value: number; 
  icon: React.ReactNode; 
  linkTo: string; 
  color: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className={`rounded-md p-2 ${color}`}>
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
    <CardFooter>
      <Link to={linkTo} className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
        View all
        <ArrowRight className="ml-1 h-4 w-4" />
      </Link>
    </CardFooter>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    posts: 0,
    categories: 0,
    tags: 0,
    comments: 0,
    pendingComments: 0,
  });

  // Query for recent posts
  const { data: recentPostsData } = useQuery({
    queryKey: ['recentPosts'],
    queryFn: () => getAdminPosts(1, 5),
  });

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          { count: postsCount },
          { count: categoriesCount },
          { count: tagsCount },
          { count: commentsCount },
          { count: pendingCommentsCount },
        ] = await Promise.all([
          supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
          supabase.from('blog_categories').select('*', { count: 'exact', head: true }),
          supabase.from('blog_tags').select('*', { count: 'exact', head: true }),
          supabase.from('blog_comments').select('*', { count: 'exact', head: true }),
          supabase.from('blog_comments').select('*', { count: 'exact', head: true }).eq('is_approved', false),
        ]);

        setStats({
          posts: postsCount || 0,
          categories: categoriesCount || 0,
          tags: tagsCount || 0,
          comments: commentsCount || 0,
          pendingComments: pendingCommentsCount || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link to="/admin/posts/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Posts"
          value={stats.posts}
          icon={<FileText className="h-5 w-5 text-white" />}
          linkTo="/admin/posts"
          color="bg-blue-500"
        />
        <StatCard
          title="Categories"
          value={stats.categories}
          icon={<FolderOpen className="h-5 w-5 text-white" />}
          linkTo="/admin/categories"
          color="bg-green-500"
        />
        <StatCard
          title="Tags"
          value={stats.tags}
          icon={<Tag className="h-5 w-5 text-white" />}
          linkTo="/admin/tags"
          color="bg-purple-500"
        />
        <StatCard
          title="Comments"
          value={stats.comments}
          icon={<MessageSquare className="h-5 w-5 text-white" />}
          linkTo="/admin/comments"
          color="bg-orange-500"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Posts */}
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Posts</CardTitle>
              <Link to="/admin/posts" className="text-sm text-blue-600 hover:text-blue-800">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentPostsData?.posts && recentPostsData.posts.length > 0 ? (
              <div className="space-y-4">
                {recentPostsData.posts.map(post => (
                  <div key={post.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <Link to={`/admin/posts/edit/${post.id}`} className="font-medium hover:text-blue-600">
                        {post.title}
                      </Link>
                      <div className="text-sm text-gray-500">
                        {post.status === 'published' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            Draft
                          </span>
                        )}
                        <span className="ml-2">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Link to={`/admin/posts/edit/${post.id}`} className="text-blue-600 hover:text-blue-800">
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">No posts yet</div>
            )}
          </CardContent>
        </Card>

        {/* Pending Comments */}
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pending Comments ({stats.pendingComments})</CardTitle>
              <Link to="/admin/comments" className="text-sm text-blue-600 hover:text-blue-800">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {stats.pendingComments > 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-800">
                <p>You have {stats.pendingComments} pending comments that need approval.</p>
                <Button variant="outline" className="mt-3" asChild>
                  <Link to="/admin/comments">
                    Review Comments
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">No pending comments</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Quick Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" asChild className="h-auto py-4 flex flex-col items-center justify-center">
            <Link to="/admin/posts/new">
              <FileText className="h-6 w-6 mb-2" />
              <span>New Post</span>
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-auto py-4 flex flex-col items-center justify-center">
            <Link to="/admin/categories/new">
              <FolderOpen className="h-6 w-6 mb-2" />
              <span>New Category</span>
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-auto py-4 flex flex-col items-center justify-center">
            <Link to="/admin/tags/new">
              <Tag className="h-6 w-6 mb-2" />
              <span>New Tag</span>
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-auto py-4 flex flex-col items-center justify-center">
            <Link to="/admin/comments">
              <MessageSquare className="h-6 w-6 mb-2" />
              <span>Manage Comments</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
