
    import { supabase } from '@/lib/supabaseClient';

    export const setupRealtimeSubscriptions = (fetchData) => {
      const channel = supabase.channel('kdp-data-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'kdp_entries' }, payload => { console.log('Entry change received!', payload); fetchData(); })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'kdp_accounts' }, payload => { console.log('Account change received!', payload); fetchData(); })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, payload => { console.log('Settings change received!', payload); fetchData(); })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'other_expenses' }, payload => { console.log('Other Expense change received!', payload); fetchData(); })
        .subscribe((status, err) => {
          if (status === 'SUBSCRIBED') console.log('Realtime channel connected!');
          if (status === 'CHANNEL_ERROR') console.error('Realtime channel error:', err);
          if (status === 'TIMED_OUT') console.warn('Realtime connection timed out.');
        });

      return channel; // Return the channel so it can be removed on cleanup
    };

    export const removeRealtimeSubscriptions = (channel) => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  