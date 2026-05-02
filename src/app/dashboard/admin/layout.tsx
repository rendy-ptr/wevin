import { AdminSidebar } from '@/components/dashboard/admin-sidebar';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background min-h-screen">
      <AdminSidebar />
      <main className="min-h-screen pt-16 lg:ml-64 lg:pt-0">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
