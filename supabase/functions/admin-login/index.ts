
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AdminLoginRequest {
  username: string;
  password: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Create Supabase client with admin privileges
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    const { username, password }: AdminLoginRequest = await req.json();
    
    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: 'Username and password are required' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }
    
    // Check credentials against blog_users table
    const { data: user, error } = await supabaseAdmin
      .from('blog_users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error || !user) {
      console.log('User not found:', error);
      return new Response(
        JSON.stringify({ error: 'Invalid username or password' }),
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }
    
    console.log("Found user:", user);
    
    // For our demo, we'll just check if the username and password matches our demo user
    // In a real app, we would compare hashed passwords
    if (username === 'Ungabunga' && password === 'anondopath.2121') {
      return new Response(
        JSON.stringify({ user }),
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Invalid username or password' }),
      { 
        status: 401, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
    
  } catch (error) {
    console.error('Error in admin-login function:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
});
