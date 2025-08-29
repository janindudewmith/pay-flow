import { useEffect, useCallback } from 'react';
import { useClerk } from '@clerk/clerk-react';

const useRealTimeUpdates = (onUpdate) => {
  const { session } = useClerk();

  const handleUpdate = useCallback((event) => {
    try {
      const data = JSON.parse(event.data);
      onUpdate(data);
    } catch (error) {
      console.error('Error parsing real-time update:', error);
    }
  }, [onUpdate]);

  useEffect(() => {
    if (!session) return;

    const eventSource = new EventSource('/api/websocket/updates', {
      headers: {
        Authorization: `Bearer ${session.id}`,
      },
    });

    eventSource.onmessage = handleUpdate;
    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [session, handleUpdate]);
};

export default useRealTimeUpdates; 