import { ADMIN, MEMBER } from '@/constants/role';
import bcrypt from 'bcryptjs';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../schema';

const USER_SEED_DATA = [
  {
    name: 'Wevin Admin',
    email: 'admin@admin.com',
    password: 'password',
    role: ADMIN,
  },
  {
    name: 'Wevin Member',
    email: 'member@member.com',
    password: 'password',
    role: MEMBER,
  },
];

export async function seedUsers(db: NeonHttpDatabase<typeof schema>) {
  console.log('🌱 Seeding Users...');

  for (const userData of USER_SEED_DATA) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const [user] = await db
      .insert(schema.users)
      .values({
        ...userData,
        password: hashedPassword,
      })
      .onConflictDoUpdate({
        target: schema.users.email,
        set: {
          name: userData.name,
          password: hashedPassword,
          role: userData.role,
        },
      })
      .returning();

    console.log(`  ✓ User "${user.name}" (${user.role})`);
  }

  console.log('✅ User seeding complete!');
}
