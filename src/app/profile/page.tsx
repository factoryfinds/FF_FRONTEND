// app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/");
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl text-black font-bold">My details</h2>

      <div className="grid grid-cols-2 gap-4">
        <input placeholder="Phone" value={user.phone || ""} className="border p-2 rounded" />
      </div>

      <button className="bg-black text-white px-4 py-2 rounded">Save my details</button>
    </div>
  );
}
