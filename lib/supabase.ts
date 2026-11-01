import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xffuugjororthwqvplo.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmZnV1Z2pvcm9ydGh3cXZwbG8iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc0MDU3ODU0OSwiZXhwIjoyMDU2MTU0NTQ5fQ.CjPYXQiOjE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);