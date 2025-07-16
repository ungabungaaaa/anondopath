import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://dgxiprrcsqlybhbopcoy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRneGlwcnJjc3FseWJoYm9wY295Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NTk3ODYsImV4cCI6MjA1NjUzNTc4Nn0.jCmYXBK9q87J0fTmgmHN0_AQOcitE5GBAwnSujkX9QA';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);