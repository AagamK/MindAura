import React, { useEffect, useState } from 'react';
import { getRealtimeData } from '@/lib/realtime';
import MetricsWidget from './MetricsWidget';

const DashboardRealtime = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const realtimeData = await getRealtimeData();
        setData(realtimeData);
      } catch (error) {
        console.error('Error fetching real-time data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data && data.metrics.map((metric) => (
        <MetricsWidget key={metric.id} title={metric.title} value={metric.value} />
      ))}
    </div>
  );
};

export default DashboardRealtime;