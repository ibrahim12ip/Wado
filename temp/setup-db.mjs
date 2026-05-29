import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://api.supabase.com';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxcGx3d3Z4eHh4eHh4eHh4eHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Mzg5MzQwMDAsImV4cCI6MTc5NjcwMDQwMH0.ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function signUp() {
  const { data, error } = await supabase.auth.signUp({
    email: 'wadoplatform@outlook.com',
    password: 'WadoPass123!',
  });
  console.log('Signup result:', JSON.stringify({ data, error }, null, 2));
}

signUp();
