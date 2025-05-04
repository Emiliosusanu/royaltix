
    import { useEffect, useRef } from 'react';
    import { setupRealtimeSubscriptions, removeRealtimeSubscriptions } from '@/lib/data/realtime';

    export function useRealtimeUpdates(callback) {
      const realtimeChannelRef = useRef(null);

      useEffect(() => {
        // Setup realtime only once
        if (!realtimeChannelRef.current && callback) {
           realtimeChannelRef.current = setupRealtimeSubscriptions(callback);
           console.log("Realtime channel established.");
        }

        // Cleanup function to unsubscribe
        return () => {
          if (realtimeChannelRef.current) {
            removeRealtimeSubscriptions(realtimeChannelRef.current);
            realtimeChannelRef.current = null; // Clear ref on unmount
            console.log("Realtime channel removed on unmount.");
          }
        };
      }, [callback]); // Re-run if the callback reference changes
    }
  