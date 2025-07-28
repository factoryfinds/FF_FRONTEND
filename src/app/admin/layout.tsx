// app/admin/layout.tsx
import AdminSidebar from "@/components/AdminSlidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-gray-50 min-h-screen">{children}</main>
    </div>
  );
}
