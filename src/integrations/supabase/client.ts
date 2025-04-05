
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
  try {
    const admin = JSON.parse(localStorage.getItem('blogAdminUser') || '{}');
    return admin?.id ? {
      headers: {
        'Authorization': `Bearer ${admin.id}`,
        'x-admin-access': 'true'
      }
    } : {};
  } catch (error) {
    console.error('Error getting auth headers:', error);
    return {};
  }
};

// Function to properly call edge functions
export const callEdgeFunction = async (functionName: string, options: any = {}) => {
  try {
    console.log(`Calling edge function: ${functionName}`, options);
    
    // Use the Netlify proxy which will route to the Supabase edge function
    const url = `/functions/${functionName}`;
    
    const adminHeaders = getAuthHeaders().headers || {};
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_PUBLISHABLE_KEY,
        ...adminHeaders,
        ...options.headers
      },
      body: JSON.stringify(options.body || {})
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Edge function error (${functionName}):`, errorText);
      throw new Error(errorText || `HTTP error ${response.status}`);
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error: any) {
    console.error(`Failed to call edge function (${functionName}):`, error);
    return { 
      data: null, 
      error: error.message || 'Failed to call edge function'
    };
  }
};
