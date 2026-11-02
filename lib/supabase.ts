import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xfluugjororthwqvcplo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmZnV1Z2pvcm9ydGh3cXZjcGxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxMDc0MjEsImV4cCI6MjEwODY4MzQyMX0.epwfH0OK_uXuRc0OR9uTQMT9yyJU8_BsWV1vNX8RNIE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)