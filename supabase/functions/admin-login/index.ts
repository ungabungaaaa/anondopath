
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface AdminLoginCredentials {
  username: string;
  password: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    // Parse the request body
    const credentials: AdminLoginCredentials = await req.json();
    const { username, password } = credentials;

    if (!username || !password) {
      return new Response(
        JSON.stringify({ 
          error: 'Username and password are required' 
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    console.log(`Authenticating user: ${username}`);
    
    // Query the database for the admin user
    const { data: user, error } = await supabaseClient
      .from('blog_users')
      .select('*')
      .eq('username', username)
      .eq('is_admin', true)
      .single();
    
    if (error || !user) {
      console.error('User not found or query error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid username or password' 
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // Check password (in a real app, this should use proper password hashing)
    if (user.password !== password) {
      console.error('Password mismatch');
      return new Response(
        JSON.stringify({ 
          error: 'Invalid username or password' 
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // Password is correct, return the user data (excluding sensitive fields)
    const { password: _, ...safeUser } = user;
    
    console.log('Authentication successful for user:', username);
    
    return new Response(
      JSON.stringify({ 
        user: safeUser
      }),
      {
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred' 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
});
