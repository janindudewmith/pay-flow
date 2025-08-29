import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';

const StatusUpdates = () => {
  const { user } = useUser();
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    // Set up SSE connection
    const eventSource = new EventSource('/api/websocket/connect');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.userId === user.id) {
        setUpdates(prev => [...prev, data.update]);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [user.id]);

  return (
    <div className="status-updates">
      {updates.map((update, index) => (
        <div key={index} className="update-item">
          <p>{update.message}</p>
          <small>{new Date(update.timestamp).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};

export default StatusUpdates; 