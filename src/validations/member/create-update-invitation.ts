import { z } from 'zod';

export const createUpdateInvitationSchema = z.object({
  templateId: z.coerce
    .number()
    .min(1, 'Minimal harus memilih 1 desain template'),
});

export const createUpdateInvitationBookSchema = z.object({
  prefixTitle: z.string().min(1, 'Title prefix is required'),
  coverGreeting: z.string().min(1, 'Cover greeting is required'),
  coverQuote: z.string().min(1, 'Cover quote is required'),
  groomName: z.string().min(1, 'Groom name is required'),
  brideName: z.string().min(1, 'Bride name is required'),
  eventDate: z.string().min(1, 'Event date is required'),
  placement: z.string().min(1, 'Placement is required'),
});

export const createUpdateInvitationFeatureSchema = z.object({
  // Section Pembuka
  openingGreeting: z.string().min(1, 'Teks salam pembuka wajib diisi'),
  openingMessage: z.string().min(1, 'Teks pesan pembuka wajib diisi'),
  groomFullName: z.string().min(1, 'Nama lengkap mempelai pria wajib diisi'),
  groomParents: z.string().min(1, 'Nama orang tua mempelai pria wajib diisi'),
  brideFullName: z.string().min(1, 'Nama lengkap mempelai wanita wajib diisi'),
  brideParents: z.string().min(1, 'Nama orang tua mempelai wanita wajib diisi'),

  // Section Event (Akad)
  akadDate: z.string().min(1, 'Tanggal Akad wajib diisi'),
  akadTime: z.string().min(1, 'Jam Akad wajib diisi'),
  akadLocation: z.string().min(1, 'Lokasi Akad wajib diisi'),
  akadAddress: z.string().min(1, 'Alamat Akad wajib diisi'),
  akadMapsUrl: z.string().min(1, 'Link Maps Akad wajib diisi'),

  // Section Event (Resepsi)
  resepsiDate: z.string().min(1, 'Tanggal Resepsi wajib diisi'),
  resepsiTime: z.string().min(1, 'Jam Resepsi wajib diisi'),
  resepsiLocation: z.string().min(1, 'Lokasi Resepsi wajib diisi'),
  resepsiAddress: z.string().min(1, 'Alamat Resepsi wajib diisi'),
  resepsiMapsUrl: z.string().min(1, 'Link Maps Resepsi wajib diisi'),

  // Section Penutup
  closingMessage: z.string().min(1, 'Pesan penutup wajib diisi'),
  closingGreeting: z.string().min(1, 'Salam penutup wajib diisi'),

  // Benefit / Features
  enabledFeatures: z.record(z.string(), z.boolean()).optional(),
  gallery: z
    .array(
      z.object({
        imageUrl: z.url('URL gambar tidak valid'),
      }),
    )
    .optional(),
  musicUrl: z
    .string()
    .url('URL musik tidak valid')
    .optional()
    .or(z.literal('')),
  liveStreamUrl: z
    .string()
    .url('URL live stream tidak valid')
    .optional()
    .or(z.literal('')),
});
