import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  LineChart, 
  BarChart, 
  PieChart 
} from '@/components/ui/chart';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus,
  Target,
  Activity,
  DollarSign,
  Users,
  PieChart as PieChartIcon,
  Settings,
  Calendar,
  Edit,
  Trash2,
  RefreshCw
} from 'lucide-react';

import {
  getStartupMetrics,
  getMetricCategories,
  getMetricEntries,
  createMetricEntry,
  updateMetricEntry,
  deleteMetricEntry,
  getMetricsByCategory,
  getLatestMetricValues,
  getMetricTrends,
  formatMetricValue,
  type StartupMetric,
  type MetricCategory,
  type MetricEntry
} from '@/services/analyticsService';

interface MetricCardProps {
  metric: StartupMetric;
  currentValue?: number;
  trend?: 'up' | 'down' | 'stable';
  onEdit: (metric: StartupMetric) => void;
  onAddEntry: (metricId: string) => void;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric, currentValue, trend, onEdit, onAddEntry }) => {
  const getCategoryIcon = (categoryName?: string) => {
    switch (categoryName) {
      case 'Revenue': return <DollarSign className="h-4 w-4" />;
      case 'Users': return <Users className="h-4 w-4" />;
      case 'Marketing': return <TrendingUp className="h-4 w-4" />;
      case 'Financial': return <PieChartIcon className="h-4 w-4" />;
      case 'Operations': return <Settings className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          {getCategoryIcon(metric.category?.name)}
          <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
        </div>
        <div className="flex items-center space-x-1">
          {getTrendIcon()}
          <Button variant="ghost" size="sm" onClick={() => onEdit(metric)}>
            <Edit className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {currentValue !== undefined ? formatMetricValue(currentValue, metric.unit) : '–'}
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="text-xs text-muted-foreground">
            Target: {metric.target_value ? formatMetricValue(metric.target_value, metric.unit) : 'None'}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onAddEntry(metric.id)}
            className="h-6 px-2 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Analytics = () => {
  const { isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  
  const [metrics, setMetrics] = useState<StartupMetric[]>([]);
  const [categories, setCategories] = useState<MetricCategory[]>([]);
  const [metricsByCategory, setMetricsByCategory] = useState<{ [key: string]: StartupMetric[] }>({});
  const [latestValues, setLatestValues] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<StartupMetric | null>(null);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [selectedMetricId, setSelectedMetricId] = useState<string>('');

  // Entry form state
  const [entryForm, setEntryForm] = useState({
    value: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    
    fetchData();
  }, [isAuthenticated, navigate]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      const [metricsData, categoriesData, groupedMetrics] = await Promise.all([
        getStartupMetrics(),
        getMetricCategories(),
        getMetricsByCategory()
      ]);
      
      setMetrics(metricsData);
      setCategories(categoriesData);
      setMetricsByCategory(groupedMetrics);
      
      // Fetch latest values for all metrics
      const metricIds = metricsData.map(m => m.id);
      const values = await getLatestMetricValues(metricIds);
      setLatestValues(values);
      
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load analytics data. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEntry = async (metricId: string) => {
    setSelectedMetricId(metricId);
    setShowAddEntry(true);
  };

  const handleSubmitEntry = async () => {
    if (!selectedMetricId || !entryForm.value) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields.",
      });
      return;
    }

    try {
      await createMetricEntry({
        metric_id: selectedMetricId,
        value: parseFloat(entryForm.value),
        date: entryForm.date,
        notes: entryForm.notes || undefined,
        created_by: 'admin'
      });

      toast({
        title: "Entry Added",
        description: "Metric entry has been added successfully.",
      });

      // Reset form and refresh data
      setEntryForm({
        value: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setShowAddEntry(false);
      setSelectedMetricId('');
      fetchData();

    } catch (error) {
      console.error('Error creating metric entry:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add metric entry. Please try again.",
      });
    }
  };

  const renderOverviewCards = () => {
    const totalMetrics = metrics.length;
    const activeMetrics = metrics.filter(m => m.is_active).length;
    const totalCategories = categories.length;
    const entriesCount = Object.keys(latestValues).length;

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Metrics</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMetrics}</div>
            <p className="text-xs text-muted-foreground">{activeMetrics} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
            <p className="text-xs text-muted-foreground">Metric groups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Points</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entriesCount}</div>
            <p className="text-xs text-muted-foreground">With current values</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Today</div>
            <p className="text-xs text-muted-foreground">Data freshness</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderMetricsByCategory = () => {
    return Object.entries(metricsByCategory).map(([categoryName, categoryMetrics]) => (
      <div key={categoryName} className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{categoryName}</h3>
          <Badge variant="outline">{categoryMetrics.length} metrics</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryMetrics.map(metric => (
            <MetricCard
              key={metric.id}
              metric={metric}
              currentValue={latestValues[metric.id]}
              onEdit={setSelectedMetric}
              onAddEntry={handleAddEntry}
            />
          ))}
        </div>
      </div>
    ));
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Startup Analytics</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => navigate('/admin/analytics/metrics')}>
            <Plus className="mr-2 h-4 w-4" />
            Manage Metrics
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          {renderOverviewCards()}

          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-6">
              {renderMetricsByCategory()}
            </TabsContent>
            
            <TabsContent value="trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Metric Trends (Coming Soon)</CardTitle>
                  <CardDescription>
                    Time series visualization of your key metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Trend charts will be available once you have more historical data points.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="goals" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Goal Tracking</CardTitle>
                  <CardDescription>
                    Monitor progress against your target values
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics.filter(m => m.target_value).map(metric => {
                      const currentValue = latestValues[metric.id];
                      const progress = currentValue && metric.target_value 
                        ? (currentValue / metric.target_value) * 100 
                        : 0;
                      
                      return (
                        <div key={metric.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <div className="font-medium">{metric.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {currentValue ? formatMetricValue(currentValue, metric.unit) : '–'} / {formatMetricValue(metric.target_value!, metric.unit)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{progress.toFixed(1)}%</div>
                            <div className={`text-xs ${progress >= 100 ? 'text-green-600' : progress >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {progress >= 100 ? 'Target Met' : progress >= 75 ? 'On Track' : 'Below Target'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Add Entry Modal */}
      {showAddEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add Metric Entry</CardTitle>
              <CardDescription>
                Add a new data point for {metrics.find(m => m.id === selectedMetricId)?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="value">Value *</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  value={entryForm.value}
                  onChange={(e) => setEntryForm(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="Enter value"
                />
              </div>
              
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={entryForm.date}
                  onChange={(e) => setEntryForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={entryForm.notes}
                  onChange={(e) => setEntryForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Optional notes"
                />
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button onClick={handleSubmitEntry} className="flex-1">
                  Add Entry
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddEntry(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Analytics;