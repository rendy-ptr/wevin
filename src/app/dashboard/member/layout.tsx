import { MemberSidebar } from '@/components/dashboard/member-sidebar';

export default function MemberDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background min-h-screen">
      <MemberSidebar />
      <main className="min-h-screen pt-16 lg:ml-64 lg:pt-0">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
