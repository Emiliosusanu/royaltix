
    import { supabase } from '@/lib/supabaseClient';
    import { defaultSettings } from '@/lib/data/constants';
    import { parseDateStringUTC } from '@/lib/data/utils';

    export const fetchSettings = async (userId) => {
      let { data: settingsData, error: settingsError } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (settingsError) throw settingsError;

      // If no settings exist, create default ones
      if (!settingsData) {
        console.log("No settings found for user, creating defaults.");
        const { data: newSettings, error: insertError } = await supabase
          .from('settings')
          .insert({ user_id: userId, eur_to_usd_rate: defaultSettings.eur_to_usd_rate })
          .select()
          .single();
        if (insertError) {
            console.error("Error inserting default settings:", insertError);
            throw insertError;
        }
        console.log("Default settings created:", newSettings);
        settingsData = newSettings;
      }
      // Ensure a valid object is always returned
      return settingsData || { ...defaultSettings, user_id: userId };
    };

    export const fetchAccounts = async (userId) => {
      const { data, error } = await supabase
        .from('kdp_accounts')
        .select('*')
        .eq('user_id', userId)
        .order('name');
      if (error) throw error;
      return data || [];
    };

    export const fetchEntries = async (userId) => {
      const { data, error } = await supabase
        .from('kdp_entries')
        .select('*, kdp_accounts(id, name, color)') // Ensure account details are fetched
        .eq('user_id', userId)
        .order('date', { ascending: false });
      if (error) throw error;

      return (data || []).map(e => ({
        ...e,
        // Parse the date string into a Date object at UTC midnight
        date: parseDateStringUTC(e.date),
        // Provide default account info if relation is missing (e.g., deleted account)
        kdp_accounts: e.kdp_accounts || { id: null, name: 'Unknown', color: '#888888' }
      })).filter(e => e.date !== null); // Filter out entries with invalid dates
    };

    export const fetchOtherExpenses = async (userId) => {
      const { data, error } = await supabase
        .from('other_expenses')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });
      if (error) throw error;
      return (data || []).map(e => ({
        ...e,
        // Parse the date string into a Date object at UTC midnight
        date: parseDateStringUTC(e.date)
      })).filter(e => e.date !== null); // Filter out expenses with invalid dates
    };
  