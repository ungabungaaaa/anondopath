-- Create startup analytics tables

-- Metric categories for organizing different types of startup metrics
CREATE TABLE public.metric_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT DEFAULT '#3b82f6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Main metrics definition table
CREATE TABLE public.startup_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    metric_type TEXT NOT NULL CHECK (metric_type IN ('revenue', 'users', 'engagement', 'marketing', 'financial', 'operational', 'product')),
    unit TEXT NOT NULL CHECK (unit IN ('currency', 'percentage', 'count', 'days', 'hours', 'rate')),
    category_id UUID REFERENCES public.metric_categories(id),
    target_value DECIMAL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Individual metric data points
CREATE TABLE public.metric_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_id UUID NOT NULL REFERENCES public.startup_metrics(id) ON DELETE CASCADE,
    value DECIMAL NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_by TEXT, -- Can store user identifier
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(metric_id, date) -- One entry per metric per day
);

-- Enable RLS on all tables
ALTER TABLE public.metric_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startup_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metric_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public access (since this is admin functionality)
-- Note: You should implement proper authentication and restrict these to admin users
CREATE POLICY "Anyone can view metric categories" ON public.metric_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can insert metric categories" ON public.metric_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update metric categories" ON public.metric_categories FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete metric categories" ON public.metric_categories FOR DELETE USING (true);

CREATE POLICY "Anyone can view startup metrics" ON public.startup_metrics FOR SELECT USING (true);
CREATE POLICY "Anyone can insert startup metrics" ON public.startup_metrics FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update startup metrics" ON public.startup_metrics FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete startup metrics" ON public.startup_metrics FOR DELETE USING (true);

CREATE POLICY "Anyone can view metric entries" ON public.metric_entries FOR SELECT USING (true);
CREATE POLICY "Anyone can insert metric entries" ON public.metric_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update metric entries" ON public.metric_entries FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete metric entries" ON public.metric_entries FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX idx_metric_entries_metric_id ON public.metric_entries(metric_id);
CREATE INDEX idx_metric_entries_date ON public.metric_entries(date);
CREATE INDEX idx_startup_metrics_category_id ON public.startup_metrics(category_id);
CREATE INDEX idx_startup_metrics_type ON public.startup_metrics(metric_type);

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for auto-updating timestamps
CREATE TRIGGER update_metric_categories_updated_at
    BEFORE UPDATE ON public.metric_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_startup_metrics_updated_at
    BEFORE UPDATE ON public.startup_metrics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_metric_entries_updated_at
    BEFORE UPDATE ON public.metric_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default metric categories
INSERT INTO public.metric_categories (name, description, icon, color) VALUES
('Revenue', 'Revenue and financial performance metrics', 'DollarSign', '#10b981'),
('Users', 'User acquisition and retention metrics', 'Users', '#3b82f6'),
('Engagement', 'User engagement and product usage metrics', 'Activity', '#8b5cf6'),
('Marketing', 'Marketing and growth metrics', 'TrendingUp', '#f59e0b'),
('Financial', 'Financial health and funding metrics', 'PieChart', '#ef4444'),
('Operations', 'Operational efficiency metrics', 'Settings', '#6b7280');

-- Insert sample startup metrics
INSERT INTO public.startup_metrics (name, description, metric_type, unit, category_id, target_value) VALUES
-- Revenue metrics
('Monthly Recurring Revenue (MRR)', 'Monthly recurring revenue from subscriptions', 'revenue', 'currency', (SELECT id FROM public.metric_categories WHERE name = 'Revenue'), 50000),
('Annual Recurring Revenue (ARR)', 'Annual recurring revenue projection', 'revenue', 'currency', (SELECT id FROM public.metric_categories WHERE name = 'Revenue'), 600000),
('Revenue Growth Rate', 'Month-over-month revenue growth percentage', 'revenue', 'percentage', (SELECT id FROM public.metric_categories WHERE name = 'Revenue'), 20),

-- User metrics
('Monthly Active Users (MAU)', 'Number of monthly active users', 'users', 'count', (SELECT id FROM public.metric_categories WHERE name = 'Users'), 10000),
('Daily Active Users (DAU)', 'Number of daily active users', 'users', 'count', (SELECT id FROM public.metric_categories WHERE name = 'Users'), 2000),
('User Growth Rate', 'Month-over-month user growth percentage', 'users', 'percentage', (SELECT id FROM public.metric_categories WHERE name = 'Users'), 15),
('Churn Rate', 'Monthly customer churn rate', 'users', 'percentage', (SELECT id FROM public.metric_categories WHERE name = 'Users'), 5),

-- Engagement metrics
('Session Duration', 'Average session duration in minutes', 'engagement', 'hours', (SELECT id FROM public.metric_categories WHERE name = 'Engagement'), 30),
('Page Views per Session', 'Average page views per user session', 'engagement', 'count', (SELECT id FROM public.metric_categories WHERE name = 'Engagement'), 5),

-- Marketing metrics
('Customer Acquisition Cost (CAC)', 'Cost to acquire one customer', 'marketing', 'currency', (SELECT id FROM public.metric_categories WHERE name = 'Marketing'), 50),
('Lifetime Value (LTV)', 'Customer lifetime value', 'marketing', 'currency', (SELECT id FROM public.metric_categories WHERE name = 'Marketing'), 500),
('Conversion Rate', 'Website visitor to customer conversion rate', 'marketing', 'percentage', (SELECT id FROM public.metric_categories WHERE name = 'Marketing'), 3),

-- Financial metrics
('Burn Rate', 'Monthly cash burn rate', 'financial', 'currency', (SELECT id FROM public.metric_categories WHERE name = 'Financial'), 25000),
('Runway', 'Months of runway remaining', 'financial', 'days', (SELECT id FROM public.metric_categories WHERE name = 'Financial'), 18),
('Gross Margin', 'Gross profit margin percentage', 'financial', 'percentage', (SELECT id FROM public.metric_categories WHERE name = 'Financial'), 70),

-- Operational metrics
('Support Tickets', 'Number of support tickets created', 'operational', 'count', (SELECT id FROM public.metric_categories WHERE name = 'Operations'), 50),
('Response Time', 'Average support response time in hours', 'operational', 'hours', (SELECT id FROM public.metric_categories WHERE name = 'Operations'), 2);