
    import { useEffect, useRef } from 'react';
    import { setupRealtimeSubscriptions, removeRealtimeSubscriptions } from '@/lib/data/realtime';

    export function useRealtimeManager(callback) {
        const realtimeChannelRef = useRef(null);

        useEffect(() => {
            // Setup realtime only once per component lifecycle
            if (!realtimeChannelRef.current && callback) {
               realtimeChannelRef.current = setupRealtimeSubscriptions(() => callback(false)); // Pass false to avoid showing loading indicator on RT updates
               console.log("Realtime channel setup.");
            }

            // Cleanup function to unsubscribe on unmount
            return () => {
              if (realtimeChannelRef.current) {
                removeRealtimeSubscriptions(realtimeChannelRef.current);
                realtimeChannelRef.current = null;
                console.log("Realtime channel removed on unmount.");
              }
            };
          }, [callback]); // Only re-run if the callback function reference changes

        // No return value needed, this hook just manages the side effect
    }
  