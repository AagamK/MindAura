import React, { useEffect, useState } from 'react';
import { getMetrics } from '@/lib/realtime';

const MetricsWidget = () => {
  const [metrics, setMetrics] = useState({
    userCount: 0,
    activeSessions: 0,
    messagesSent: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      const data = await getMetrics();
      setMetrics(data);
    };

    const interval = setInterval(fetchMetrics, 5000); // Fetch metrics every 5 seconds

    fetchMetrics(); // Initial fetch

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">User Engagement Metrics</h3>
      <ul className="space-y-2">
        <li>
          <span className="font-bold">Total Users:</span> {metrics.userCount}
        </li>
        <li>
          <span className="font-bold">Active Sessions:</span> {metrics.activeSessions}
        </li>
        <li>
          <span className="font-bold">Messages Sent:</span> {metrics.messagesSent}
        </li>
      </ul>
    </div>
  );
};

export default MetricsWidget;