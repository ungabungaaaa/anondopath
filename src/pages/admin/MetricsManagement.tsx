import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Target,
  Activity,
  Save,
  X
} from 'lucide-react';

import {
  getStartupMetrics,
  getMetricCategories,
  createStartupMetric,
  updateStartupMetric,
  deleteStartupMetric,
  createMetricCategory,
  updateMetricCategory,
  deleteMetricCategory,
  type StartupMetric,
  type MetricCategory
} from '@/services/analyticsService';

const MetricsManagement = () => {
  const { isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  
  const [metrics, setMetrics] = useState<StartupMetric[]>([]);
  const [categories, setCategories] = useState<MetricCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMetricForm, setShowMetricForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingMetric, setEditingMetric] = useState<StartupMetric | null>(null);
  const [editingCategory, setEditingCategory] = useState<MetricCategory | null>(null);

  const [metricForm, setMetricForm] = useState({
    name: '',
    description: '',
    metric_type: 'revenue',
    unit: 'currency',
    category_id: '',
    target_value: '',
    is_active: true
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    icon: '',
    color: '#3b82f6'
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
      const [metricsData, categoriesData] = await Promise.all([
        getStartupMetrics(),
        getMetricCategories()
      ]);
      
      setMetrics(metricsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load data. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMetric = async () => {
    if (!metricForm.name || !metricForm.metric_type || !metricForm.unit) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields.",
      });
      return;
    }

    try {
      const metricData = {
        name: metricForm.name,
        description: metricForm.description || undefined,
        metric_type: metricForm.metric_type as 'revenue' | 'users' | 'engagement' | 'marketing' | 'financial' | 'operational' | 'product',
        unit: metricForm.unit as 'currency' | 'percentage' | 'count' | 'days' | 'hours' | 'rate',
        category_id: metricForm.category_id || undefined,
        target_value: metricForm.target_value ? parseFloat(metricForm.target_value) : undefined,
        is_active: metricForm.is_active
      };

      if (editingMetric) {
        await updateStartupMetric(editingMetric.id, metricData);
        toast({
          title: "Metric Updated",
          description: "Metric has been updated successfully.",
        });
      } else {
        await createStartupMetric(metricData);
        toast({
          title: "Metric Created",
          description: "New metric has been created successfully.",
        });
      }

      // Reset form and refresh data
      resetMetricForm();
      fetchData();
    } catch (error) {
      console.error('Error saving metric:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save metric. Please try again.",
      });
    }
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.name) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Category name is required.",
      });
      return;
    }

    try {
      const categoryData = {
        name: categoryForm.name,
        description: categoryForm.description || undefined,
        icon: categoryForm.icon || undefined,
        color: categoryForm.color
      };

      if (editingCategory) {
        await updateMetricCategory(editingCategory.id, categoryData);
        toast({
          title: "Category Updated",
          description: "Category has been updated successfully.",
        });
      } else {
        await createMetricCategory(categoryData);
        toast({
          title: "Category Created",
          description: "New category has been created successfully.",
        });
      }

      // Reset form and refresh data
      resetCategoryForm();
      fetchData();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save category. Please try again.",
      });
    }
  };

  const handleDeleteMetric = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This will also delete all associated metric entries.`)) {
      return;
    }

    try {
      await deleteStartupMetric(id);
      toast({
        title: "Metric Deleted",
        description: "Metric has been deleted successfully.",
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting metric:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete metric. Please try again.",
      });
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This may affect associated metrics.`)) {
      return;
    }

    try {
      await deleteMetricCategory(id);
      toast({
        title: "Category Deleted",
        description: "Category has been deleted successfully.",
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete category. Please try again.",
      });
    }
  };

  const resetMetricForm = () => {
    setMetricForm({
      name: '',
      description: '',
      metric_type: 'revenue',
      unit: 'currency',
      category_id: '',
      target_value: '',
      is_active: true
    });
    setEditingMetric(null);
    setShowMetricForm(false);
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      description: '',
      icon: '',
      color: '#3b82f6'
    });
    setEditingCategory(null);
    setShowCategoryForm(false);
  };

  const handleEditMetric = (metric: StartupMetric) => {
    setMetricForm({
      name: metric.name,
      description: metric.description || '',
      metric_type: metric.metric_type,
      unit: metric.unit,
      category_id: metric.category_id || '',
      target_value: metric.target_value?.toString() || '',
      is_active: metric.is_active
    });
    setEditingMetric(metric);
    setShowMetricForm(true);
  };

  const handleEditCategory = (category: MetricCategory) => {
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      icon: category.icon || '',
      color: category.color || '#3b82f6'
    });
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/admin/analytics" className="mr-4 text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">Metrics Management</h1>
        </div>
      </div>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="metrics" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Startup Metrics</h2>
            <Button onClick={() => setShowMetricForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Metric
            </Button>
          </div>

          {showMetricForm && (
            <Card>
              <CardHeader>
                <CardTitle>{editingMetric ? 'Edit Metric' : 'Create New Metric'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="metric-name">Name *</Label>
                    <Input
                      id="metric-name"
                      value={metricForm.name}
                      onChange={(e) => setMetricForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Monthly Recurring Revenue"
                    />
                  </div>

                  <div>
                    <Label htmlFor="metric-type">Type *</Label>
                    <Select value={metricForm.metric_type} onValueChange={(value) => setMetricForm(prev => ({ ...prev, metric_type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="revenue">Revenue</SelectItem>
                        <SelectItem value="users">Users</SelectItem>
                        <SelectItem value="engagement">Engagement</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="financial">Financial</SelectItem>
                        <SelectItem value="operational">Operational</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="metric-unit">Unit *</Label>
                    <Select value={metricForm.unit} onValueChange={(value) => setMetricForm(prev => ({ ...prev, unit: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="currency">Currency</SelectItem>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="count">Count</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="rate">Rate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="metric-category">Category</Label>
                    <Select value={metricForm.category_id} onValueChange={(value) => setMetricForm(prev => ({ ...prev, category_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="metric-target">Target Value</Label>
                    <Input
                      id="metric-target"
                      type="number"
                      step="0.01"
                      value={metricForm.target_value}
                      onChange={(e) => setMetricForm(prev => ({ ...prev, target_value: e.target.value }))}
                      placeholder="Optional target value"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="metric-active"
                      checked={metricForm.is_active}
                      onCheckedChange={(checked) => setMetricForm(prev => ({ ...prev, is_active: checked }))}
                    />
                    <Label htmlFor="metric-active">Active</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="metric-description">Description</Label>
                  <Textarea
                    id="metric-description"
                    value={metricForm.description}
                    onChange={(e) => setMetricForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Optional description"
                    rows={3}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button onClick={handleSaveMetric}>
                    <Save className="mr-2 h-4 w-4" />
                    {editingMetric ? 'Update' : 'Create'} Metric
                  </Button>
                  <Button variant="outline" onClick={resetMetricForm}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.map((metric) => (
                  <TableRow key={metric.id}>
                    <TableCell className="font-medium">{metric.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{metric.metric_type}</Badge>
                    </TableCell>
                    <TableCell>{metric.unit}</TableCell>
                    <TableCell>{metric.category?.name || 'Uncategorized'}</TableCell>
                    <TableCell>{metric.target_value || '–'}</TableCell>
                    <TableCell>
                      <Badge variant={metric.is_active ? "default" : "outline"}>
                        {metric.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditMetric(metric)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteMetric(metric.id, metric.name)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Metric Categories</h2>
            <Button onClick={() => setShowCategoryForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>

          {showCategoryForm && (
            <Card>
              <CardHeader>
                <CardTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category-name">Name *</Label>
                    <Input
                      id="category-name"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Revenue"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category-color">Color</Label>
                    <Input
                      id="category-color"
                      type="color"
                      value={categoryForm.color}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, color: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category-icon">Icon</Label>
                    <Input
                      id="category-icon"
                      value={categoryForm.icon}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, icon: e.target.value }))}
                      placeholder="e.g., DollarSign"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category-description">Description</Label>
                  <Textarea
                    id="category-description"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Optional description"
                    rows={3}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button onClick={handleSaveCategory}>
                    <Save className="mr-2 h-4 w-4" />
                    {editingCategory ? 'Update' : 'Create'} Category
                  </Button>
                  <Button variant="outline" onClick={resetCategoryForm}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteCategory(category.id, category.name)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div 
                    className="w-4 h-4 rounded mb-2"
                    style={{ backgroundColor: category.color }}
                  />
                  <p className="text-xs text-muted-foreground">
                    {category.description || 'No description'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {metrics.filter(m => m.category_id === category.id).length} metrics
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MetricsManagement;