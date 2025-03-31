
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart } from '@/components/ui/chart';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost, BlogCategory, BlogTag, BlogComment } from '@/types/blog';
import { FileText, FilePlus, MessageSquare, Tag, CheckCircle, XCircle, FolderOpen } from 'lucide-react';

const Dashboard = () => {
  const { isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    categories: 0,
    tags: 0,
    comments: 0,
    pendingComments: 0
  });
  
  const [postsOverTime, setPostsOverTime] = useState<{ date: string, count: number }[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<{ name: string, value: number }[]>([]);
  const [tagDistribution, setTagDistribution] = useState<{ name: string, value: number }[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Get posts stats
        const { count: totalPosts } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact' });
        
        const { count: publishedPosts } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact' })
          .eq('status', 'published');
          
        const { count: draftPosts } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact' })
          .eq('status', 'draft');
        
        // Get categories stats
        const { count: categories } = await supabase
          .from('blog_categories')
          .select('*', { count: 'exact' });
        
        // Get tags stats
        const { count: tags } = await supabase
          .from('blog_tags')
          .select('*', { count: 'exact' });
        
        // Get comments stats
        const { count: comments } = await supabase
          .from('blog_comments')
          .select('*', { count: 'exact' });
          
        const { count: pendingComments } = await supabase
          .from('blog_comments')
          .select('*', { count: 'exact' })
          .eq('is_approved', false);
        
        // Fetch posts over time data (last 10 weeks)
        const now = new Date();
        const tenWeeksAgo = new Date();
        tenWeeksAgo.setDate(now.getDate() - 70); // 10 weeks = 70 days
        
        const { data: postsByDate } = await supabase
          .from('blog_posts')
          .select('created_at, status')
          .gte('created_at', tenWeeksAgo.toISOString());
        
        const dateMap = new Map();
        
        if (postsByDate) {
          postsByDate.forEach(post => {
            const date = post.created_at.split('T')[0]; // Extract YYYY-MM-DD
            const status = post.status;
            
            if (!dateMap.has(date)) {
              dateMap.set(date, { published: 0, draft: 0 });
            }
            
            if (status === 'published') {
              dateMap.get(date).published += 1;
            } else {
              dateMap.get(date).draft += 1;
            }
          });
        }
        
        const postsTimeData: { date: string, published: number, draft: number }[] = 
          Array.from(dateMap.entries())
            .map(([date, counts]: [string, any]) => ({ 
              date, 
              published: counts.published, 
              draft: counts.draft 
            }))
            .sort((a, b) => a.date.localeCompare(b.date));

        // Fetch category distribution
        const { data: categoriesData } = await supabase
          .from('blog_categories')
          .select(`
            id,
            name,
            blog_posts(count)
          `);
        
        const categoryData = categoriesData?.map(category => ({
          name: category.name,
          value: (category.blog_posts as any)?.length || 0
        })) || [];
        
        // Fetch tag distribution (top 10)
        const { data: postsTagsData } = await supabase
          .from('blog_posts_tags')
          .select('tag_id');
        
        const tagCount = new Map();
        
        if (postsTagsData) {
          postsTagsData.forEach(item => {
            const count = tagCount.get(item.tag_id) || 0;
            tagCount.set(item.tag_id, count + 1);
          });
        }
        
        const { data: tagsData } = await supabase
          .from('blog_tags')
          .select('id, name');
        
        const tagData = tagsData?.map(tag => ({
          name: tag.name,
          value: tagCount.get(tag.id) || 0
        }))
        .filter(tag => tag.value > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, 10) || [];
        
        setStats({
          totalPosts: totalPosts || 0,
          publishedPosts: publishedPosts || 0,
          draftPosts: draftPosts || 0,
          categories: categories || 0,
          tags: tags || 0,
          comments: comments || 0,
          pendingComments: pendingComments || 0
        });
        
        setPostsOverTime(postsTimeData);
        setCategoryDistribution(categoryData);
        setTagDistribution(tagData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard 
          title="Total Posts" 
          value={stats.totalPosts}
          description="All blog posts" 
          icon={<FileText />}
          trend={stats.totalPosts > 0 ? `${Math.round((stats.publishedPosts / stats.totalPosts) * 100)}% published` : "No posts yet"}
          positive={stats.totalPosts > 0}
        />
        <DashboardCard 
          title="Published" 
          value={stats.publishedPosts}
          description="Live posts" 
          icon={<CheckCircle />}
          trend={stats.totalPosts > 0 ? `${Math.round((stats.publishedPosts / stats.totalPosts) * 100)}% of total` : "No posts published"}
          positive={true}
        />
        <DashboardCard 
          title="Drafts" 
          value={stats.draftPosts}
          description="Unpublished posts" 
          icon={<FilePlus />}
          trend={stats.totalPosts > 0 ? `${Math.round((stats.draftPosts / stats.totalPosts) * 100)}% of total` : "No drafts"}
          positive={false}
        />
        <DashboardCard 
          title="Comments" 
          value={stats.comments}
          description="Total comments" 
          icon={<MessageSquare />}
          trend={stats.pendingComments > 0 ? `${stats.pendingComments} pending approval` : "No pending comments"}
          positive={stats.pendingComments === 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Posts Activity</CardTitle>
            <CardDescription>Post creation over time</CardDescription>
          </CardHeader>
          <CardContent>
            {postsOverTime.length > 0 ? (
              <LineChart 
                height={300}
                data={postsOverTime}
                categories={['published', 'draft']}
                index="date"
                colors={['green', 'amber']}
                valueFormatter={(value) => `${value} posts`}
              />
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-400">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Content Overview</CardTitle>
            <CardDescription>Blog content distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="categories">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="tags">Tags</TabsTrigger>
                <TabsTrigger value="status">Status</TabsTrigger>
              </TabsList>
              <TabsContent value="categories">
                {categoryDistribution.length > 0 ? (
                  <PieChart 
                    height={240}
                    data={categoryDistribution}
                    category="value"
                    index="name"
                    valueFormatter={(value) => `${value} posts`}
                  />
                ) : (
                  <div className="flex items-center justify-center h-[240px] text-gray-400">
                    No categories with posts
                  </div>
                )}
              </TabsContent>
              <TabsContent value="tags">
                {tagDistribution.length > 0 ? (
                  <BarChart 
                    height={240}
                    data={tagDistribution}
                    categories={['value']}
                    index="name"
                    layout="vertical"
                    valueFormatter={(value) => `${value} posts`}
                  />
                ) : (
                  <div className="flex items-center justify-center h-[240px] text-gray-400">
                    No tags with posts
                  </div>
                )}
              </TabsContent>
              <TabsContent value="status">
                <PieChart 
                  height={240}
                  data={[
                    { name: 'Published', value: stats.publishedPosts },
                    { name: 'Draft', value: stats.draftPosts }
                  ]}
                  category="value"
                  index="name"
                  valueFormatter={(value) => `${value} posts`}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Categories</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.categories}</div>
            <p className="text-sm text-muted-foreground">Content organization</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Tags</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.tags}</div>
            <p className="text-sm text-muted-foreground">Post classification</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Comments</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="text-3xl font-bold">{stats.comments - stats.pendingComments}</div>
                <CheckCircle className="h-5 w-5 ml-2 text-green-500" />
              </div>
              <span className="text-muted-foreground">/</span>
              <div className="flex items-center">
                <div className="text-3xl font-bold">{stats.pendingComments}</div>
                <XCircle className="h-5 w-5 ml-2 text-amber-500" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Approved / Pending</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const DashboardCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  positive = true 
}: { 
  title: string, 
  value: number, 
  description: string, 
  icon: React.ReactNode,
  trend: string,
  positive?: boolean
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-5 w-5 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <p className={`text-xs mt-2 ${positive ? 'text-green-600' : 'text-amber-600'}`}>
          {trend}
        </p>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
