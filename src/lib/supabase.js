import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eyowshvsmfgtiscvtupn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5b3dzaHZzbWZndGlzY3Z0dXBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NjYzOTgsImV4cCI6MjA2NjM0MjM5OH0.mrZYjQzhZQrF7ZOc_SRivvU-ZnZUULfMJkvw9U5OswQ';

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;