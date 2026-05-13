'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { USER_STATUS } from '@/constants/user.constant';
import { UserMember } from '@/types/member.type';
import { Loader2 } from 'lucide-react';

interface DeactiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  member: UserMember | null;
}

export default function DeactiveModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  member,
}: DeactiveModalProps) {
  const isEnabling = member?.status !== USER_STATUS.ACTIVE;
  const label = isEnabling ? 'Aktifkan' : 'Non-aktifkan';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-border bg-background overflow-hidden rounded-xl border p-0 shadow-2xl sm:max-w-[420px]">
        <div className="p-7">
          <DialogHeader className="text-left">
            <DialogTitle className="text-foreground font-serif text-xl font-bold">
              {label} Member?
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
              {isEnabling
                ? `Aktifkan kembali akun ${member?.name} agar dapat mengakses seluruh fitur.`
                : `Apakah Anda yakin ingin menonaktifkan akun ${member?.name}? Member tidak akan bisa mengakses beberapa fitur sampai diaktifkan kembali.`}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-end gap-3 pt-8">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
              className="text-muted-foreground h-10 px-5"
            >
              Batal
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="bg-destructive hover:bg-destructive/90 shadow-destructive/20 relative h-11 px-8 text-xs font-bold tracking-wide uppercase transition-all active:scale-95"
            >
              {isLoading ? (
                <>
                  <span className="invisible text-transparent">{label}</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </>
              ) : (
                label
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
