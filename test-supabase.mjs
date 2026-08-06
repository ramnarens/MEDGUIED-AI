import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://npmdcuuhjzjjkcsfeady.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wbWRjdXVoanpqamtjc2ZlYWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMDA2NDksImV4cCI6MjEwMTU3NjY0OX0.yZ5TmBJkuma-mgsuTs6neTzgy9h_6_SJOTuX-NaAXpU";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Connection failed:", error.message);
  } else {
    console.log("Supabase connection successful!");
  }
}
run();
