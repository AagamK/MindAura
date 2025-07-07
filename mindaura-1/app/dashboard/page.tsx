import { useEffect, useState } from "react";
import { DashboardRealtime } from "@/components/Dashboard/DashboardRealtime";
import { MetricsWidget } from "@/components/Dashboard/MetricsWidget";
import { useAuth } from "@/lib/auth";
import { getRealtimeData } from "@/lib/realtime";

export default function DashboardPage() {
  const { user, isLoggedIn } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (isLoggedIn && user) {
      const unsubscribe = getRealtimeData(user.uid, setData);
      return () => unsubscribe();
    }
  }, [isLoggedIn, user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {data ? (
        <>
          <MetricsWidget metrics={data.metrics} />
          <DashboardRealtime data={data.realtime} />
        </>
      ) : (
        <p className="text-gray-500">Loading data...</p>
      )}
    </div>
  );
}