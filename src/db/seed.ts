import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

dotenv.config({ path: '.env' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function main() {
  console.log('⏳ Seeding database...');

  try {
    const adminPassword = await bcrypt.hash('password', 10);
    const memberPassword = await bcrypt.hash('password', 10);

    console.log('Creating Admin user...');
    await db
      .insert(schema.users)
      .values({
        name: 'Wevin Admin',
        email: 'admin@admin.com',
        password: adminPassword,
        role: 'admin',
      })
      .onConflictDoNothing();

    console.log('Creating Member user...');
    await db
      .insert(schema.users)
      .values({
        name: 'Wevin Member',
        email: 'member@member.com',
        password: memberPassword,
        role: 'member',
      })
      .onConflictDoNothing();

    console.log('✅ Seeding complete!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    process.exit(0);
  }
}

main();
