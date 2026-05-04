'use client';

import DeleteModal from '@/components/shared/delete-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Filter, Plus, Search, SquarePen, Trash2 } from 'lucide-react';
import { useState } from 'react';

const membersData = [
  {
    id: 1,
    name: 'Budi & Ani',
    email: 'budi@email.com',
    package: 'Bahagia',
    invitations: 3,
    rsvp: 45,
    status: 'active',
  },
  {
    id: 2,
    name: 'Rina & Doni',
    email: 'rina@email.com',
    package: 'Selamanya',
    invitations: 2,
    rsvp: 32,
    status: 'active',
  },
  {
    id: 3,
    name: 'Ahmad & Siti',
    email: 'ahmad@email.com',
    package: 'Kenangan',
    invitations: 1,
    rsvp: 20,
    status: 'active',
  },
  {
    id: 4,
    name: 'Joko & Dwi',
    email: 'joko@email.com',
    package: 'Bahagia',
    invitations: 2,
    rsvp: 38,
    status: 'inactive',
  },
];

export default function MemberManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const filteredMembers = membersData.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground font-serif text-3xl font-bold">
            Member
          </h1>
          <p className="text-muted-foreground text-sm">
            Total {membersData.length} akun terdaftar
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary-dark h-11 px-6 text-white shadow-sm transition-all active:scale-95">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Member
        </Button>
      </div>

      <div className="bg-background border-border overflow-hidden rounded-xl border">
        <div className="border-border border-b p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
              <Input
                placeholder="Cari member..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-border focus:ring-primary h-10 bg-transparent pl-9 text-sm focus:ring-1"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              className="border-border text-muted-foreground hover:bg-secondary hover:text-foreground h-10 px-4 transition-all"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-secondary/30 text-muted-foreground border-border border-b text-[11px] font-bold tracking-wider uppercase">
                <th className="px-6 py-4 font-semibold">Profil Member</th>
                <th className="px-6 py-4 font-semibold">Paket</th>
                <th className="hidden px-6 py-4 font-semibold md:table-cell">
                  Aktivitas
                </th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className="even:bg-secondary/10 hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-foreground font-semibold">
                        {member.name}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {member.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-accent text-xs font-bold tracking-tight uppercase">
                      {member.package}
                    </span>
                  </td>
                  <td className="hidden px-6 py-4 md:table-cell">
                    <div className="flex flex-col text-[11px]">
                      <span className="text-foreground font-medium">
                        {member.invitations} Undangan
                      </span>
                      <span className="text-muted-foreground">
                        {member.rsvp} RSVP
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${member.status === 'active' ? 'bg-success' : 'bg-muted-foreground'}`}
                      />
                      <span
                        className={`text-xs font-medium ${member.status === 'active' ? 'text-success' : 'text-muted-foreground'}`}
                      >
                        {member.status === 'active' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-primary-dark hover:text-primary-dark hover:bg-secondary h-8 w-8 transition-colors"
                          >
                            <SquarePen className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-secondary h-8 w-8 transition-colors"
                            onClick={() => setIsDeleteModalOpen(true)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Hapus</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredMembers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-muted-foreground text-sm italic">
                Tidak ada member ditemukan
              </p>
            </div>
          )}
        </div>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          // Handle delete logic here
          setIsDeleteModalOpen(false);
        }}
      />
    </div>
  );
}
