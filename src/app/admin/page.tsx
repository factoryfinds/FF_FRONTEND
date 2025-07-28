// app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getAdminDashboard } from '../../../utlis/api'; // fix path if needed

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdminDashboard()
      .then((res) => setData(res))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome Admin</h1>
      <p>{data.message}</p>
      <p className="mt-2 text-gray-500">Admin ID: {data.adminId}</p>
    </div>
  );
}
