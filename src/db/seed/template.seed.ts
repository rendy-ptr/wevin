import { TEMPLATES } from '@/constants/template.constant';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../schema';

const TEMPLATE_SEED_DATA = TEMPLATES;

export async function seedTemplates(db: NeonHttpDatabase<typeof schema>) {
  console.log('🌱 Seeding Templates...');

  for (const templateData of TEMPLATE_SEED_DATA) {
    const slug = templateData.name.toLowerCase().replace(/ /g, '-');
    await db
      .insert(schema.templates)
      .values({
        key: slug,
        name: templateData.name,
        thumbnail: templateData.bookPreview,
      })
      .onConflictDoUpdate({
        target: schema.templates.key,
        set: {
          name: templateData.name,
          thumbnail: templateData.bookPreview,
        },
      });

    console.log(`  ✓ Template "${templateData.name}"`);
  }

  console.log('✅ Template seeding complete!');
}
