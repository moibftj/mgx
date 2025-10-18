import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

const supabaseUrl = 'https://lqxahtqjrhqmftscdlcz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeGFodHFqcmhxbWZ0c2NkbGN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MTM4NTcsImV4cCI6MjA3NjA4OTg1N30.WGa7-wtjoXcPVMDef5kgb3MvU510x7zbEmzyM69dIQ4'

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)