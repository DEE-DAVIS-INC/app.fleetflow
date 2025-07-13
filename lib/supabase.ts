// Supabase Configuration
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For convenience, export commonly used methods
export const {
  auth,
  from: table,
  storage,
  rpc,
  channel,
  removeChannel,
  getChannels
} = supabase

export default supabase