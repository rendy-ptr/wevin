'use client';

import DeleteModal from '@/components/shared/delete-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Filter, Package, Plus, Search, SquarePen, Trash2 } from 'lucide-react';
import { useState } from 'react';

const packagesData = [
  {
    id: 1,
    name: 'Bahagia',
    price: 150000,
    description: 'Paket dasar untuk undangan digital standar.',
    features: ['500 Tamu', '5 Tema', 'RSVP Digital'],
  },
  {
    id: 2,
    name: 'Selamanya',
    price: 350000,
    description: 'Paket populer dengan fitur kustomisasi lengkap.',
    features: [
      'Unlimited Tamu',
      'Semua Tema',
      'Music Background',
      'Gallery Foto',
    ],
  },
  {
    id: 3,
    name: 'Kenangan',
    price: 750000,
    description: 'Paket eksklusif dengan domain kustom dan video.',
    features: [
      'Custom Domain',
      'Live Streaming',
      'Video Invitation',
      'Prioritas Support',
    ],
  },
];

export default function PackageManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const filteredPackages = packagesData.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground font-serif text-3xl font-bold">
            Paket Undangan
          </h1>
          <p className="text-muted-foreground text-sm">
            Kelola pilihan paket dan harga layanan Wevin
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary-dark h-11 px-6 text-white shadow-sm transition-all active:scale-95">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Paket
        </Button>
      </div>

      {/* Main Content */}
      <div className="bg-background border-border overflow-hidden rounded-xl border">
        {/* Toolbar */}
        <div className="border-border border-b p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
              <Input
                placeholder="Cari nama paket..."
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-secondary/30 text-muted-foreground border-border border-b text-[11px] font-bold tracking-wider uppercase">
                <th className="px-6 py-4 font-semibold">Nama Paket</th>
                <th className="px-6 py-4 font-semibold">Harga</th>
                <th className="hidden px-6 py-4 font-semibold md:table-cell">
                  Deskripsi
                </th>
                <th className="px-6 py-4 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {filteredPackages.map((pkg) => (
                <tr
                  key={pkg.id}
                  className="even:bg-secondary/10 hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-6 py-5">
                    <span className="text-foreground font-bold">
                      {pkg.name}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-primary-dark font-sans font-bold">
                      {pkg.price}
                    </span>
                  </td>
                  <td className="hidden px-6 py-5 md:table-cell">
                    <p className="text-muted-foreground max-w-xs text-xs leading-relaxed">
                      {pkg.description}
                    </p>
                  </td>
                  <td className="px-6 py-5 text-right">
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
                          <p>Edit Paket</p>
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
                          <p>Hapus Paket</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPackages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Package className="text-muted-foreground/20 mb-3 h-12 w-12" />
              <p className="text-muted-foreground text-sm italic">
                Tidak ada paket ditemukan
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
