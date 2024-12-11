import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from './database.types';

// Create a single instance of the Supabase client
const supabase = createClientComponentClient<Database>();

export { supabase };

// Export types for use in components
export type Tables = Database['public']['Tables'];
export type Wallpaper = Tables['wallpapers']['Row'];
export type Payment = Tables['payments']['Row'];
export type Profile = Tables['profiles']['Row']; 