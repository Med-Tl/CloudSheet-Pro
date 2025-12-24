

import { createClient } from '@supabase/supabase-js';

// Fix: Use process.env instead of import.meta.env to resolve TypeScript errors and follow project standards
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://puyntxsuqakytkwsjivr.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_H2vQxpm-Eaan1e4_oXAPKQ_C6VHP7TY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
