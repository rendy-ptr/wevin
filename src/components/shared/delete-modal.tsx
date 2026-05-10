'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Hapus Data?',
  description = 'Data ini akan dihapus secara permanen dan tidak dapat dipulihkan.',
  isLoading = false,
}: DeleteModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-border bg-background overflow-hidden rounded-xl border p-0 shadow-2xl sm:max-w-[420px]">
        <div className="p-7">
          <DialogHeader className="p-0 text-left">
            <DialogTitle className="text-foreground font-serif text-xl font-bold tracking-tight">
              {title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-end gap-3 pt-8">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
              className="text-muted-foreground hover:bg-secondary hover:text-foreground h-10 px-5 font-medium transition-all"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={isLoading}
              className="bg-destructive hover:bg-destructive/90 shadow-destructive/20 relative h-11 px-10 text-xs font-bold tracking-wide uppercase shadow-lg transition-all active:scale-95"
            >
              {isLoading ? (
                <>
                  <span className="invisible text-transparent">Hapus</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </>
              ) : (
                'Hapus'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
