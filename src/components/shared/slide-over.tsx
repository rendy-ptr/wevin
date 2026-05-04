'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ReactNode } from 'react';

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  icon?: ReactNode;
  width?: string;
}

export default function SlideOver({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  icon,
  width = 'w-80',
}: SlideOverProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`bg-background border-border fixed top-0 right-0 z-50 h-full border-l shadow-2xl ${width}`}
          >
            <div className="flex h-full flex-col">
              <div className="border-border flex items-center justify-between border-b p-6">
                <div className="flex items-center gap-2">
                  {icon && (
                    <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                      {icon}
                    </div>
                  )}
                  <div>
                    <h2 className="text-foreground font-serif text-lg font-bold">
                      {title}
                    </h2>
                    {description && (
                      <p className="text-muted-foreground text-xs">
                        {description}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground hover:bg-secondary h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">{children}</div>

              {footer && (
                <div className="border-border border-t p-6">{footer}</div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
