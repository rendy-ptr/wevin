import { InvitationStatusEnum, TimezoneEnum } from '@/enums/invitation.enum';
import { z } from 'zod';

export const createInvitationSchema = z.object({
  templateId: z.number().min(1, 'Minimal harus memilih 1 desain template'),

  // Step 2: Data Identitas Mempelai
  groomName: z.string().min(1, 'Nama panggilan mempelai pria wajib diisi'),
  groomFullName: z.string().min(1, 'Nama lengkap mempelai pria wajib diisi'),
  groomParents: z.string().min(1, 'Nama orang tua mempelai pria wajib diisi'),
  brideName: z.string().min(1, 'Nama panggilan mempelai wanita wajib diisi'),
  brideFullName: z.string().min(1, 'Nama lengkap mempelai wanita wajib diisi'),
  brideParents: z.string().min(1, 'Nama orang tua mempelai wanita wajib diisi'),

  // Step 3: Kata & Pesan Sambutan
  prefixTitle: z.string().min(1, 'Judul awalan wajib diisi'),
  coverGreeting: z.string().min(1, 'Salam pada sampul wajib diisi'),
  coverQuote: z.string().min(1, 'Kutipan pada sampul wajib diisi'),
  heroTitle: z.string().min(1, 'Judul utama wajib diisi'),
  openingGreeting: z.string().min(1, 'Teks salam pembuka wajib diisi'),
  openingMessage: z.string().min(1, 'Teks pesan pembuka wajib diisi'),
  closingMessage: z.string().min(1, 'Pesan penutup wajib diisi'),
  closingGreeting: z.string().min(1, 'Salam penutup wajib diisi'),

  // Step 4: Jadwal & Lokasi Acara
  events: z
    .array(
      z.object({
        title: z.string().min(1, 'Judul acara wajib diisi'),
        date: z.string().min(1, 'Tanggal acara wajib diisi'),
        time: z.string().min(1, 'Waktu acara wajib diisi'),
        timezone: z.enum(TimezoneEnum).optional().default(TimezoneEnum.WIB),
        location: z.string().min(1, 'Nama lokasi wajib diisi'),
        address: z.string().min(1, 'Alamat wajib diisi'),
        mapsUrl: z.string().optional(),
      }),
    )
    .min(1, 'Minimal harus ada 1 acara (misal: Akad/Pemberkatan)')
    .max(3, 'Maksimal 3 acara diperbolehkan'),

  // Step 5: Galeri Foto
  gallery: z
    .array(
      z.object({
        imageUrl: z.url('URL gambar tidak valid'),
      }),
    )
    .min(1, 'Minimal harus mengunggah 1 foto galeri'),

  // Step 6: Fitur & Media Tambahan
  musicUrl: z.url('URL musik tidak valid').optional().or(z.literal('')),
  liveStreamUrl: z
    .url('URL live stream tidak valid')
    .optional()
    .or(z.literal('')),
  enabledFeatures: z
    .record(z.string(), z.boolean().optional().catch(false))
    .optional(),

  // Step 7: Review & Publish
  status: z.enum(InvitationStatusEnum).default(InvitationStatusEnum.Draft),
  recipientName: z.string().optional(),
});

export type CreateUpdateInvitationFormValues = z.infer<
  typeof createInvitationSchema
>;
