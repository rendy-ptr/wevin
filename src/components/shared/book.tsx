'use client';

import { TEMPLATES } from '@/constants/demo-preview';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { useState } from 'react';

interface BookProps {
  isActive: (typeof TEMPLATES)[0];
  isOpen: boolean;
  handleToggleOpen: () => void;
  groom: string;
  bride: string;
  guestName: string;
  showHint?: boolean;
}

export default function Book({
  isActive,
  isOpen,
  handleToggleOpen,
  groom,
  bride,
  guestName,
  showHint = true,
}: BookProps) {
  const [isCoverHovered, setIsCoverHovered] = useState(false);

  return (
    <>
      {showHint && !isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{
            opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            delay: 2,
          }}
          className="pointer-events-none absolute -bottom-16 left-1/2 -translate-x-1/2 py-4 whitespace-nowrap"
        >
          <p
            className={cn(
              'font-script text-3xl tracking-wide italic',
              isActive.textColor,
            )}
          >
            Tap to open the invitation
          </p>
        </motion.div>
      )}

      <div
        className="absolute inset-y-2 right-[-8px] z-0 w-4 rounded-r-lg border-y border-r border-black/10 shadow-sm transition-colors duration-700"
        style={{ backgroundColor: `${isActive.ribbonColor}33` }}
      />
      <div
        className="absolute inset-y-3 right-[-4px] z-0 w-4 rounded-r-lg border-y border-r border-black/5 shadow-sm transition-colors duration-700"
        style={{ backgroundColor: `${isActive.ribbonColor}11` }}
      />

      <div
        className={cn(
          'absolute inset-y-0 right-0 left-0 flex flex-col items-center justify-center rounded-[2rem] border border-black/5 p-8 text-center shadow-xl transition-all duration-700',
          isActive.preview,
          isActive.textColor,
          isCoverHovered && !isOpen ? 'shadow-2xl' : 'shadow-xl',
        )}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 rounded-l-[2rem] bg-gradient-to-r from-black/20 to-transparent" />

        <div
          className={cn(
            'absolute inset-0 rounded-[2rem] bg-black/10 transition-opacity duration-500',
            isCoverHovered && !isOpen ? 'opacity-20 blur-md' : 'opacity-0',
          )}
        />
        <div className="relative z-10 space-y-4 pl-12 opacity-40">
          <p className="font-script text-xl">With Love,</p>
          <h4 className="font-display text-2xl italic">
            {groom}
            <br />
            &amp;
            <br />
            {bride}
          </h4>
          <p className="mx-auto max-w-[200px] text-[10px] leading-relaxed italic">
            &quot;Two souls with but a single thought, two hearts that beat as
            one.&quot;
          </p>
        </div>
      </div>

      <div
        className={cn(
          'absolute inset-y-0 left-0 z-20 w-12 overflow-hidden rounded-l-[2rem] border-y border-l shadow-[inset_-2px_0_5px_rgba(0,0,0,0.15)] transition-all duration-700',
        )}
        style={{
          backgroundColor: isActive.ribbonColor,
          backgroundImage: `url('https://www.transparenttextures.com/patterns/linen-design.png'), linear-gradient(to right, rgba(255,255,255,0.1), transparent 40%, rgba(0,0,0,0.1))`,
        }}
      >
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[1px] bg-white/20" />

        <div className="pointer-events-none absolute inset-y-0 left-0 z-40 flex h-full w-full flex-col justify-around py-16">
          <div
            className="absolute inset-y-0 left-0 w-10 shadow-[1px_0_4_rgba(0,0,0,0.15)]"
            style={{
              backgroundImage: `url('https://www.transparenttextures.com/patterns/linen-design.png'), linear-gradient(to right, ${isActive.ribbonColor}dd, ${isActive.ribbonColor}, ${isActive.ribbonColor}aa)`,
            }}
          />
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="relative flex h-10 w-10 items-center justify-center"
            >
              <div
                className="flex h-5 w-5 items-center justify-center rounded-full border border-black/10 shadow-[0_3px_6px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.5)]"
                style={{
                  background: `radial-gradient(circle at 35% 35%, ${isActive.ribbonColor} 0%, ${isActive.ribbonColor}dd 50%, ${isActive.ribbonColor}aa 100%)`,
                }}
              >
                <div className="h-1.5 w-1.5 rounded-full bg-black/20" />
              </div>
              <div className="absolute top-3 left-3 h-1.5 w-1.5 rounded-full bg-white/40 blur-[0.5px]" />
            </div>
          ))}
        </div>
      </div>

      <motion.div
        onClick={handleToggleOpen}
        onMouseEnter={() => setIsCoverHovered(true)}
        onMouseLeave={() => setIsCoverHovered(false)}
        initial={false}
        animate={{
          rotateY: isOpen ? -115 : isCoverHovered ? -15 : 0,
          x: isOpen ? -5 : 0,
          z: isCoverHovered && !isOpen ? 20 : 0,
        }}
        style={{
          transformOrigin: 'left center',
          transformStyle: 'preserve-3d',
        }}
        transition={{ type: 'spring', stiffness: 80, damping: 20 }}
        className={cn(
          'absolute inset-y-0 right-0 left-12 z-30 cursor-pointer overflow-hidden rounded-r-[2rem] border-y border-r shadow-2xl transition-colors duration-700',
          isActive.preview,
          isActive.textColor,
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-[0.03] mix-blend-multiply" />

        <motion.div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.15) 25%, transparent 30%)',
            backgroundSize: '200% 200%',
          }}
          animate={{ backgroundPosition: ['200% 200%', '-200% -200%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />

        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-8 bg-gradient-to-r from-black/10 to-transparent" />

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 text-center">
          <p className="font-script mb-1 text-lg opacity-80 md:text-xl">
            The Wedding of
          </p>
          <h3
            className={cn(
              'font-display mb-3 text-3xl leading-tight font-semibold italic md:text-5xl',
              isActive.titleColor,
            )}
          >
            {groom}
            <br />
            &amp;
            <br />
            {bride}
          </h3>

          <div
            className={cn(
              'mx-auto mb-4 h-px w-16 opacity-30',
              isActive.titleColor.replace('text-', 'bg-'),
            )}
          />

          <div className="mb-6 space-y-1">
            <p className="text-sm font-medium tracking-wide opacity-80 md:text-base">
              Sabtu, 08 Desember 2005
            </p>
            <p className="text-[10px] opacity-60 md:text-xs">
              Hotel Grand Ballroom, Jakarta
            </p>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-[10px] tracking-widest uppercase opacity-60">
              Kepada Yth.
            </p>
            <h4 className="font-display text-lg leading-tight font-medium md:text-xl">
              {guestName || 'Bapak/Ibu/Saudara/i'}
            </h4>
          </div>
        </div>
      </motion.div>
    </>
  );
}
