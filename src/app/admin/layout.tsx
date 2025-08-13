// app/admin/layout.tsx
import AdminSidebar from "@/components/AdminSlidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <AdminSidebar />
      <main className="ml-0 lg:ml-64 p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
        {children}
      </main>
    </div>
  );
}