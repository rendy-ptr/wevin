import { MemberSidebar } from '@/components/dashboard/member-sidebar';
import { requireAuth, USER_ROLES } from '@/lib/auth';
import React from 'react';

export default async function MemberDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth(USER_ROLES.MEMBER);

  return (
    <div className="bg-background min-h-screen">
      <MemberSidebar user={session.user} />
      <main className="min-h-screen pt-16 lg:ml-64 lg:pt-0">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
