'use client';

import { useEffect, useState } from 'react';
import { getAdminDashboard } from '../../../../utlis/api';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdminDashboard()
      .then(res => setData(res))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="p-8 bg-black">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p>{data.message}</p>
      <p className="mt-2 text-gray-500">Admin ID: {data.adminId}</p>
    </div>
  );
}
