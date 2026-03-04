import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project-id.supabase.co'
const supabaseKey = 'sb_publishable_your_key_here'

export const supabase = createClient(supabaseUrl, supabaseKey)