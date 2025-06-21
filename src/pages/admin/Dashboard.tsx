
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart } from '@/components/ui/chart';
import { FileText, FilePlus, MessageSquare, Tag, CheckCircle, XCircle, FolderOpen } from 'lucide-react';
import { getStoredPosts, getStoredCategories, getStoredTags, getStoredComments } from '@/services/localStorageService';

interface PostTimeData {
  date: string;
  published: number;
  draft: number;
}

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
  
  const [postsOverTime, setPostsOverTime] = useState<PostTimeData[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<{ name: string, value: number }[]>([]);
  const [tagDistribution, setTagDistribution] = useState<{ name: string, value: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    
    const loadDashboardData = () => {
      try {
        setIsLoading(true);
        
        const posts = getStoredPosts();
        const categories = getStoredCategories();
        const tags = getStoredTags();
        const comments = getStoredComments();
        
        const publishedPosts = posts.filter(p => p.status === 'published').length;
        const draftPosts = posts.filter(p => p.status === 'draft').length;
        const pendingComments = comments.filter(c => !c.is_approved).length;
        
        setStats({
          totalPosts: posts.length,
          publishedPosts,
          draftPosts,
          categories: categories.length,
          tags: tags.length,
          comments: comments.length,
          pendingComments
        });
        
        // Generate posts over time data
        const timeData: { [key: string]: { published: number, draft: number } } = {};
        posts.forEach(post => {
          const date = new Date(post.created_at).toISOString().split('T')[0];
          if (!timeData[date]) {
            timeData[date] = { published: 0, draft: 0 };
          }
          timeData[date][post.status]++;
        });
        
        const sortedTimeData = Object.entries(timeData)
          .sort(([a], [b]) => a.localeCompare(b))
          .slice(-7) // Last 7 days
          .map(([date, data]) => ({
            date,
            published: data.published,
            draft: data.draft
          }));
        
        setPostsOverTime(sortedTimeData);
        
        // Category distribution
        const categoryCount: { [key: string]: number } = {};
        categories.forEach(cat => {
          categoryCount[cat.name] = posts.filter(p => p.category_id === cat.id).length;
        });
        
        setCategoryDistribution(
          Object.entries(categoryCount)
            .filter(([, count]) => count > 0)
            .map(([name, value]) => ({ name, value }))
        );
        
        // Tag distribution (mock data for now since we don't have post-tag relationships)
        setTagDistribution([
          { name: 'React', value: Math.floor(posts.length * 0.4) },
          { name: 'JavaScript', value: Math.floor(posts.length * 0.3) },
          { name: 'UI/UX', value: Math.floor(posts.length * 0.2) },
          { name: 'Startup', value: Math.floor(posts.length * 0.1) }
        ]);
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
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
                colors={['#10b981', '#f59e0b']}
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
