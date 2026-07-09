import { InvitationStatusEnum } from '@/enums/invitation.enum';
import { CreateUpdateInvitationFormValues } from '@/validations/member/create-update-invitation';

export const DRAFT = 'draft';
export const PUBLISHED = 'published';
export const EXPIRED = 'expired';

export const RSVP_HADIR = 'hadir';
export const RSVP_TIDAK_HADIR = 'tidak_hadir';

export const DEFAULT_INVITATION_VALUES: CreateUpdateInvitationFormValues = {
  // Step 1: Template
  templateId: 1,

  // Step 2: Data Identitas Mempelai
  groomName: '',
  groomFullName: '',
  groomParents: '',
  brideName: '',
  brideFullName: '',
  brideParents: '',

  // Step 3: Kata & Pesan Sambutan
  prefixTitle: 'The Wedding of',
  coverGreeting: 'With Love,',
  coverQuote:
    '"Two souls with but a single thought, two hearts that beat as one."',
  heroTitle: 'We Are Getting Married',
  openingGreeting: 'Bismillahirrahmanirrahim',
  openingMessage:
    'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami:',
  closingMessage:
    'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.',
  closingGreeting:
    'Atas kehadiran dan doa restunya, kami ucapkan terima kasih.',

  // Step 4: Jadwal & Lokasi Acara
  events: [],

  // Step 5: Galeri Foto
  gallery: [],

  // Step 6: Fitur & Media Tambahan
  musicUrl: '',
  liveStreamUrl: '',
  enabledFeatures: {},

  // Step 7: Review & Publish
  status: InvitationStatusEnum.Draft,
  recipientName: '',
};

// src/components/dashboard/member/invitation/create/
// ├── steps/
// │   ├── step-1-template.tsx    (Pilih Template)
// │   ├── step-2-cover.tsx       (Detail Sampul/Buku Depan)
// │   ├── step-3-profiles.tsx    (Salam Pembuka & Data Mempelai)
// │   ├── step-4-events.tsx      (Jadwal & Titik Lokasi Acara)
// │   ├── step-5-closing.tsx     (Pesan Penutup & Ucapan Terima Kasih)
// │   └── step-6-features.tsx    (Galeri, Musik, Live Stream, & Toggle Benefit)
// └── preview/
//     └── book-preview.tsx       (Live Preview Sampul)
