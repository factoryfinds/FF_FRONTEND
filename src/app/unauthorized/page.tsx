"use client";

import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-gray-800 px-6">
      <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
      <p className="text-lg text-center mb-6">
        You do not have permission to view this page. Please login with an authorized account.
      </p>
      <Button
        onClick={() => router.push("/")}
        className="bg-black text-white px-6 py-2 hover:bg-gray-900"
      >
        Go Back Home
      </Button>
    </div>
  );
}
