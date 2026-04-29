import { ChartColumnIncreasingIcon } from '@/components/ui/chart-column-increasing';
import { ImageIcon } from '@/components/ui/image';
import { LinkIcon } from '@/components/ui/link';
import { UsersIcon } from '@/components/ui/users';

export const FEATURES = [
  {
    icon: LinkIcon,
    title: 'Link Personal',
    description:
      'Setiap tamu mendapat link unik dengan nama mereka yang akan tampil di halaman undangan.',
  },
  {
    icon: UsersIcon,
    title: 'RSVP Digital',
    description:
      'Tamu dapat konfirmasi kehadiran langsung dari undangan. Data masuk otomatis ke dashboard Anda.',
  },
  {
    icon: ImageIcon,
    title: 'Galeri Foto',
    description:
      'Tampilkan foto pre-wedding dalam galeri yang indah dengan musik latar yang romantis.',
  },
  {
    icon: ChartColumnIncreasingIcon,
    title: 'Analytics Lengkap',
    description:
      'Pantau siapa saja yang membuka undangan, kapan, dan dari perangkat apa.',
  },
];
