import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  console.error('REACT_APP_SUPABASE_URL is missing from environment variables')
  console.error('Available env vars:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP')))
}

if (!supabaseAnonKey) {
  console.error('REACT_APP_SUPABASE_ANON_KEY is missing from environment variables')
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are required. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 