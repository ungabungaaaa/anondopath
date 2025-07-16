import { supabase } from "@/integrations/supabase/client";

export interface MetricCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface StartupMetric {
  id: string;
  name: string;
  description?: string;
  metric_type: 'revenue' | 'users' | 'engagement' | 'marketing' | 'financial' | 'operational' | 'product';
  unit: 'currency' | 'percentage' | 'count' | 'days' | 'hours' | 'rate';
  category_id?: string;
  target_value?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: MetricCategory;
}

export interface MetricEntry {
  id: string;
  metric_id: string;
  value: number;
  date: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  metric?: StartupMetric;
}

// Metric Categories API
export const getMetricCategories = async (): Promise<MetricCategory[]> => {
  console.log('Fetching metric categories from Supabase');
  const { data, error } = await supabase
    .from('metric_categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching metric categories:', error);
    throw error;
  }

  return data || [];
};

export const createMetricCategory = async (category: Omit<MetricCategory, 'id' | 'created_at' | 'updated_at'>): Promise<string> => {
  console.log('Creating metric category:', category);
  const { data, error } = await supabase
    .from('metric_categories')
    .insert([category])
    .select()
    .single();

  if (error) {
    console.error('Error creating metric category:', error);
    throw error;
  }

  return data.id;
};

export const updateMetricCategory = async (id: string, updates: Partial<MetricCategory>): Promise<boolean> => {
  console.log('Updating metric category:', { id, updates });
  const { error } = await supabase
    .from('metric_categories')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating metric category:', error);
    throw error;
  }

  return true;
};

export const deleteMetricCategory = async (id: string): Promise<boolean> => {
  console.log('Deleting metric category:', id);
  const { error } = await supabase
    .from('metric_categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting metric category:', error);
    throw error;
  }

  return true;
};

// Startup Metrics API
export const getStartupMetrics = async (): Promise<StartupMetric[]> => {
  console.log('Fetching startup metrics from Supabase');
  const { data, error } = await supabase
    .from('startup_metrics')
    .select(`
      *,
      category:metric_categories(*)
    `)
    .order('name');

  if (error) {
    console.error('Error fetching startup metrics:', error);
    throw error;
  }

  return (data || []).map(item => ({
    ...item,
    metric_type: item.metric_type as 'revenue' | 'users' | 'engagement' | 'marketing' | 'financial' | 'operational' | 'product',
    unit: item.unit as 'currency' | 'percentage' | 'count' | 'days' | 'hours' | 'rate'
  }));
};

export const getStartupMetricById = async (id: string): Promise<StartupMetric | null> => {
  console.log('Fetching startup metric by ID:', id);
  const { data, error } = await supabase
    .from('startup_metrics')
    .select(`
      *,
      category:metric_categories(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching startup metric by ID:', error);
    if (error.code === 'PGRST116') return null; // No rows returned
    throw error;
  }

  if (!data) return null;

  return {
    ...data,
    metric_type: data.metric_type as 'revenue' | 'users' | 'engagement' | 'marketing' | 'financial' | 'operational' | 'product',
    unit: data.unit as 'currency' | 'percentage' | 'count' | 'days' | 'hours' | 'rate'
  };
};

export const createStartupMetric = async (metric: Omit<StartupMetric, 'id' | 'created_at' | 'updated_at' | 'category'>): Promise<string> => {
  console.log('Creating startup metric:', metric);
  const { data, error } = await supabase
    .from('startup_metrics')
    .insert([metric])
    .select()
    .single();

  if (error) {
    console.error('Error creating startup metric:', error);
    throw error;
  }

  return data.id;
};

export const updateStartupMetric = async (id: string, updates: Partial<StartupMetric>): Promise<boolean> => {
  console.log('Updating startup metric:', { id, updates });
  const { error } = await supabase
    .from('startup_metrics')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating startup metric:', error);
    throw error;
  }

  return true;
};

export const deleteStartupMetric = async (id: string): Promise<boolean> => {
  console.log('Deleting startup metric:', id);
  const { error } = await supabase
    .from('startup_metrics')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting startup metric:', error);
    throw error;
  }

  return true;
};

// Metric Entries API
export const getMetricEntries = async (
  metricId?: string,
  startDate?: string,
  endDate?: string,
  limit?: number
): Promise<MetricEntry[]> => {
  console.log('Fetching metric entries from Supabase:', { metricId, startDate, endDate, limit });
  
  let query = supabase
    .from('metric_entries')
    .select(`
      *,
      metric:startup_metrics(
        *,
        category:metric_categories(*)
      )
    `);

  if (metricId) {
    query = query.eq('metric_id', metricId);
  }

  if (startDate) {
    query = query.gte('date', startDate);
  }

  if (endDate) {
    query = query.lte('date', endDate);
  }

  query = query.order('date', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching metric entries:', error);
    throw error;
  }

  return (data || []).map(item => ({
    ...item,
    metric: item.metric ? {
      ...item.metric,
      metric_type: item.metric.metric_type as 'revenue' | 'users' | 'engagement' | 'marketing' | 'financial' | 'operational' | 'product',
      unit: item.metric.unit as 'currency' | 'percentage' | 'count' | 'days' | 'hours' | 'rate'
    } : undefined
  }));
};

export const createMetricEntry = async (entry: Omit<MetricEntry, 'id' | 'created_at' | 'updated_at' | 'metric'>): Promise<string> => {
  console.log('Creating metric entry:', entry);
  const { data, error } = await supabase
    .from('metric_entries')
    .insert([entry])
    .select()
    .single();

  if (error) {
    console.error('Error creating metric entry:', error);
    throw error;
  }

  return data.id;
};

export const updateMetricEntry = async (id: string, updates: Partial<MetricEntry>): Promise<boolean> => {
  console.log('Updating metric entry:', { id, updates });
  const { error } = await supabase
    .from('metric_entries')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating metric entry:', error);
    throw error;
  }

  return true;
};

export const deleteMetricEntry = async (id: string): Promise<boolean> => {
  console.log('Deleting metric entry:', id);
  const { error } = await supabase
    .from('metric_entries')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting metric entry:', error);
    throw error;
  }

  return true;
};

// Analytics helpers
export const getMetricsByCategory = async (): Promise<{ [key: string]: StartupMetric[] }> => {
  console.log('Grouping metrics by category');
  const metrics = await getStartupMetrics();
  
  const grouped: { [key: string]: StartupMetric[] } = {};
  
  metrics.forEach(metric => {
    const categoryName = metric.category?.name || 'Uncategorized';
    if (!grouped[categoryName]) {
      grouped[categoryName] = [];
    }
    grouped[categoryName].push(metric);
  });

  return grouped;
};

export const getLatestMetricValues = async (metricIds: string[]): Promise<{ [key: string]: number }> => {
  console.log('Fetching latest metric values for:', metricIds);
  
  const values: { [key: string]: number } = {};
  
  await Promise.all(
    metricIds.map(async (metricId) => {
      const entries = await getMetricEntries(metricId, undefined, undefined, 1);
      if (entries.length > 0) {
        values[metricId] = entries[0].value;
      }
    })
  );

  return values;
};

export const getMetricTrends = async (metricId: string, days: number = 30): Promise<MetricEntry[]> => {
  console.log('Fetching metric trends for:', { metricId, days });
  
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  return getMetricEntries(metricId, startDate, endDate);
};

// Format value based on unit type
export const formatMetricValue = (value: number, unit: string): string => {
  switch (unit) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'count':
      return new Intl.NumberFormat('en-US').format(value);
    case 'days':
      return `${value} days`;
    case 'hours':
      return `${value} hours`;
    case 'rate':
      return value.toFixed(2);
    default:
      return value.toString();
  }
};