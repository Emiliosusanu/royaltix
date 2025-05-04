
import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import * as dataService from '@/lib/dataService'; // Assuming setupRealtimeSubscriptions is here

export function useRealtime(userId, fetchDataCallback) {
  const realtimeChannelRef = useRef(null);
  const stableFetchData = useCallback(fetchDataCallback, []); // Memoize the callback

  useEffect(() => {
    // Clean up previous channel if userId changes or component unmounts
    const cleanupChannel = () => {
      if (realtimeChannelRef.current) {
        console.log("Cleaning up realtime channel.");
        supabase.removeChannel(realtimeChannelRef.current)
          .then(status => console.log("Channel removed with status:", status))
          .catch(err => console.error("Error removing channel:", err));
        realtimeChannelRef.current = null;
      }
    };

    if (userId) {
      // If no channel exists for the current user, set it up
      if (!realtimeChannelRef.current) {
        console.log("Setting up realtime subscription for user:", userId);
        // Pass the stable callback to the setup function
        realtimeChannelRef.current = dataService.setupRealtimeSubscriptions(userId, stableFetchData);
      }
    } else {
      // If no userId (logged out), clean up any existing channel
      cleanupChannel();
    }

    // Return the cleanup function to be called on unmount or before re-running due to userId change
    return cleanupChannel;

  }, [userId, stableFetchData]); // Rerun effect if userId or the stable callback changes

  // The hook itself doesn't need to return anything, it just manages the effect
}
  