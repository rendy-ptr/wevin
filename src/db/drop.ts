import { sql } from 'drizzle-orm';
import { db } from './index';

async function dropAll() {
  console.log('🚨 WARNING: Dropping ALL tables and schema in Postgres...');
  try {
    await db.execute(sql`DROP SCHEMA public CASCADE;`);
    await db.execute(sql`CREATE SCHEMA public;`);
    await db.execute(sql`GRANT ALL ON SCHEMA public TO public;`);
    console.log('✅ Database dropped and schema reset successfully!');
  } catch (error) {
    console.error('❌ Failed to drop database schema:', error);
  }
}

dropAll().then(() => process.exit(0));
