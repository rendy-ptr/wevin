import { AdminSidebar } from '@/components/dashboard/admin/admin-sidebar';
import { USER_ROLE_VALUES } from '@/constants/user.constant';
import { requireAuth } from '@/lib/auth';
import React from 'react';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth(USER_ROLE_VALUES.ADMIN);

  return (
    <div className="bg-background min-h-screen">
      <AdminSidebar user={session.user} />
      <main className="min-h-screen pt-16 lg:ml-64 lg:pt-0">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
