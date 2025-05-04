
import { supabase } from './supabaseClient';

// Sets up realtime subscriptions
export const setupRealtimeSubscriptions = (fetchDataCallback) => {
  const handlePayload = (payload, type) => {
    console.log(`${type} change received!`, payload);
    // Consider adding more specific logic based on payload if needed
    fetchDataCallback(); // Refetch all data on any change for simplicity
  };

  const channel = supabase.channel('kdp-data-changes');

  const subscriptions = [
    { table: 'kdp_entries', type: 'Entry' },
    { table: 'kdp_accounts', type: 'Account' },
    { table: 'settings', type: 'Settings' },
  ];

  subscriptions.forEach(({ table, type }) => {
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: table },
      (payload) => handlePayload(payload, type)
    );
  });

  channel.subscribe((status, err) => {
    if (status === 'SUBSCRIBED') console.log('Realtime channel connected!');
    if (status === 'CHANNEL_ERROR') console.error('Realtime channel error:', err);
    if (status === 'TIMED_OUT') console.warn('Realtime connection timed out.');
    // Consider adding logic here to attempt reconnection or notify user if needed
     if (status === 'CLOSED') console.log('Realtime channel closed.');
  });

  return channel; // Return channel for cleanup
};
   