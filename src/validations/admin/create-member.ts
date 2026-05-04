// import { z } from 'zod';

// export const createMemberSchema = z.object({
//   name: z
//     .string()
//     .min(3, 'Nama minimal 3 karakter')
//     .regex(
//       /^[a-zA-Z0-9\s]+$/,
//       'Nama hanya boleh mengandung huruf, angka, dan spasi',
//     ),
//   email: z.email('Format email tidak valid'),
//   package,
// });

// export type CreateMemberFormValues = z.infer<typeof createMemberSchema>;
