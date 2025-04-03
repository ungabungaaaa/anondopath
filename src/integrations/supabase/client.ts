
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/blog';

const SUPABASE_URL = "https://dgxiprrcsqlybhbopcoy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRneGlwcnJjc3FseWJoYm9wY295Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NTk3ODYsImV4cCI6MjA1NjUzNTc4Nn0.jCmYXBK9q87J0fTmgmHN0_AQOcitE5GBAwnSujkX9QA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  },
  global: {
    headers: {
      'x-application-name': 'anondopath-blog'
    }
  }
});

// Helper function to get auth headers for admin operations
export const getAuthHeaders = () => {
  const admin = JSON.parse(localStorage.getItem('blogAdminUser') || '{}');
  return admin?.id ? {
    headers: {
      'Authorization': `Bearer ${admin.id}`,
      'x-admin-access': 'true'
    }
  } : {};
};
