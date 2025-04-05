
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-access',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400'
};

serve(async (req) => {
  console.log("Admin login function called");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request");
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Get environment variables
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing required environment variables");
      throw new Error('Server configuration error');
    }

    // Create a Supabase client with the service role key for admin operations
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Parse request body
    let username, password;
    try {
      const body = await req.json();
      username = body.username;
      password = body.password;
      console.log("Received login request for username:", username);
    } catch (error) {
      console.error("Error parsing request body:", error);
      throw new Error('Invalid request format');
    }

    if (!username || !password) {
      console.error("Missing username or password");
      throw new Error('Username and password are required');
    }

    // Fetch user from the database
    console.log("Fetching user from database");
    const { data: user, error: userError } = await supabaseAdmin
      .from('blog_users')
      .select('*')
      .eq('username', username)
      .eq('is_admin', true)
      .single();

    if (userError) {
      console.error("Database error:", userError);
      throw new Error('Invalid username or password');
    }

    if (!user) {
      console.error("User not found");
      throw new Error('Invalid username or password');
    }

    // Verify password
    console.log("Verifying password");
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.error("Password mismatch");
      throw new Error('Invalid username or password');
    }

    console.log("Authentication successful for user:", user.username);

    // Return user info without password
    const { password: _, ...userWithoutPassword } = user;
    
    return new Response(
      JSON.stringify({ 
        user: userWithoutPassword,
        message: 'Login successful' 
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Authentication error:", error.message || error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred during authentication'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      }
    );
  }
});
