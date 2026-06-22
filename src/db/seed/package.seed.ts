import { BENEFITS_DATA } from '@/constants/benefit.constant';
import {
  type BenefitKeyType,
  type QuotaBenefitKeyType,
  type ToggleBenefitKeyType,
} from '@/types/benefit.type';
import { eq } from 'drizzle-orm';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../schema';

const PACKAGE_SEED_DATA = [
  {
    name: 'Free',
    description: 'Cocok untuk mencoba layanan Wevin secara gratis.',
    price: 0,
    isPopular: false,
    benefits: {
      photo_limit: 5,
      active_days: 30,
    },
    templateIds: [1, 2],
  },
  {
    name: 'Starter',
    description:
      'Paket terjangkau untuk undangan digital yang personal dan bebas watermark.',
    price: 49000,
    isPopular: false,
    benefits: {
      rsvp_form: true,
      music_player: true,
      photo_limit: 10,
      active_days: 180,
    },
    templateIds: [1, 2, 3, 4, 5],
  },
  {
    name: 'Premium',
    description:
      'Paket lengkap dengan fitur interaktif untuk pengalaman undangan yang berkesan.',
    price: 99000,
    isPopular: true,
    benefits: {
      rsvp_form: true,
      music_player: true,
      guestbook: true,

      analytics: true,
      export_rsvp: true,
      photo_limit: 15,
      active_days: 365,
    },
    templateIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  {
    name: 'Exclusive',
    description:
      'Paket premium tanpa batas untuk momen pernikahan yang sempurna.',
    price: 179000,
    isPopular: false,
    benefits: {
      rsvp_form: true,
      music_player: true,
      guestbook: true,

      analytics: true,
      export_rsvp: true,
      live_streaming: true,
      photo_limit: 20,
      active_days: 730,
    },
    templateIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  },
] satisfies Array<{
  name: string;
  description: string;
  price: number;
  isPopular: boolean;
  benefits: Partial<Record<BenefitKeyType, boolean | number>>;
  templateIds: number[];
}>;

export async function seedPackages(db: NeonHttpDatabase<typeof schema>) {
  console.log('🌱 Seeding packages...');

  for (const packageData of PACKAGE_SEED_DATA) {
    const { benefits, templateIds, ...packageInfo } = packageData;

    const [pkg] = await db
      .insert(schema.packages)
      .values(packageInfo)
      .onConflictDoUpdate({
        target: schema.packages.name,
        set: {
          name: packageInfo.name,
          description: packageInfo.description,
          price: packageInfo.price,
          isPopular: packageInfo.isPopular,
        },
      })
      .returning();

    console.log(`  ✓ Package "${pkg.name}" (id: ${pkg.id})`);

    await db
      .delete(schema.packageBenefits)
      .where(eq(schema.packageBenefits.packageId, pkg.id));
    await db
      .delete(schema.packageQuotas)
      .where(eq(schema.packageQuotas.packageId, pkg.id));

    await db
      .delete(schema.packageTemplates)
      .where(eq(schema.packageTemplates.packageId, pkg.id));

    for (const [key, value] of Object.entries(benefits) as [
      BenefitKeyType,
      boolean | number,
    ][]) {
      const benefitDef = BENEFITS_DATA.find((b) => b.key === key);

      if (!benefitDef) {
        console.warn(`  ⚠ Benefit key "${key}" tidak ada di konstanta, skip.`);
        continue;
      }

      if (benefitDef.type === 'toggle') {
        await db.insert(schema.packageBenefits).values({
          packageId: pkg.id,
          benefitKey: key as ToggleBenefitKeyType,
          value: value as boolean,
        });
      } else if (benefitDef.type === 'quota') {
        await db.insert(schema.packageQuotas).values({
          packageId: pkg.id,
          quotaKey: key as QuotaBenefitKeyType,
          value: value as number,
        });
      }
    }

    for (const templateId of templateIds) {
      await db.insert(schema.packageTemplates).values({
        packageId: pkg.id,
        templateId,
      });
    }

    console.log(
      `    └─ ${Object.keys(benefits).length} benefit & ${templateIds.length} template seeded`,
    );
  }

  console.log('✅ Package seeding complete!');
}
