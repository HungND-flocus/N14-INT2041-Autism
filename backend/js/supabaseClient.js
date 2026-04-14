// SpeechSpark - Supabase Client (Real)
// Requires: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script> loaded first

const SUPABASE_URL = 'https://dxggsiadfkwminvcgwqz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4Z2dzaWFkZmt3bWludmNnd3F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MzExNzUsImV4cCI6MjA5MTQwNzE3NX0.v-rIPrndmKkUUeYsGPYRMSa2Kr5t0xxAZNbzeF0AcP8';

// Initialize Supabase client
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('✅ Supabase Client Initialized');
