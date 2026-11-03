import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xffuugjororthwqvcplo.supabase.co'
const supabaseAnonKey = 'sb_publishable_WF1mBKCg_-pNSSM7oMYusw_5_y5NAip'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)