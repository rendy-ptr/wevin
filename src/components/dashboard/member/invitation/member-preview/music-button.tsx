'use client';

import { motion } from 'framer-motion';
import { Music, VolumeX } from 'lucide-react';

interface MusicButtonProps {
  isMusicPlaying: boolean;
  setIsMusicPlaying: (isPlaying: boolean) => void;
}

export default function MemberPreviewMusicButton({
  isMusicPlaying,
  setIsMusicPlaying,
}: MusicButtonProps) {
  return (
    <motion.button
      initial={{ scale: 1.5, opacity: 0, filter: 'blur(20px)' }}
      animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      onClick={() => setIsMusicPlaying(!isMusicPlaying)}
      className="bg-primary-dark hover:bg-primary-dark/90 text-primary-foreground fixed right-6 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-colors"
      aria-label={isMusicPlaying ? 'Matikan musik' : 'Nyalakan musik'}
    >
      {isMusicPlaying ? (
        <Music className="h-5 w-5" />
      ) : (
        <VolumeX className="h-5 w-5" />
      )}
    </motion.button>
  );
}
