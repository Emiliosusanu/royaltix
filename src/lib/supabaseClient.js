
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fbhhhtvksyeyaoffwwgr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiaGhodHZrc3lleWFvZmZ3d2dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxODM3NjYsImV4cCI6MjA2MTc1OTc2Nn0.3BSlYtb-dko_09fVLxuDVFtqGpB2q80xJXIfnSm4bJ8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
  