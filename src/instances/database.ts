import { createClient } from '@supabase/supabase-js';

import { Database } from '@/type/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) throw new Error("Missing environment variable : 'NEXT_PUBLIC_SUPABASE_URL'.");

if (!supabaseAnonKey) throw new Error("Missing environment variable : 'NEXT_PUBLIC_SUPABASE_ANON_KEY'.");

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export default supabase;
