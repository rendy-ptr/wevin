import { BENEFITS_DATA } from '@/constants/benefit.constant';
import { type BenefitKeyType } from '@/types/benefit.type';
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
      guest_limit: 50,
      photo_limit: 5,
      active_days: 30,
    },
  },
  {
    name: 'Starter',
    description:
      'Paket terjangkau untuk undangan digital yang personal dan bebas watermark.',
    price: 49000,
    isPopular: false,
    benefits: {
      removed_watermark: true,
      custom_message: true,
      rsvp_form: true,
      music_player: true,
      guest_limit: 150,
      photo_limit: 20,
      active_days: 180,
    },
  },
  {
    name: 'Premium',
    description:
      'Paket lengkap dengan fitur interaktif untuk pengalaman undangan yang berkesan.',
    price: 99000,
    isPopular: true,
    benefits: {
      removed_watermark: true,
      custom_message: true,
      rsvp_form: true,
      music_player: true,
      guestbook: true,
      digital_gift: true,
      password_protect: true,
      analytics: true,
      export_rsvp: true,
      guest_limit: 500,
      photo_limit: 50,
      active_days: 365,
    },
  },
  {
    name: 'Exclusive',
    description:
      'Paket premium tanpa batas untuk momen pernikahan yang sempurna.',
    price: 179000,
    isPopular: false,
    benefits: {
      removed_watermark: true,
      custom_message: true,
      rsvp_form: true,
      music_player: true,
      guestbook: true,
      digital_gift: true,
      password_protect: true,
      analytics: true,
      export_rsvp: true,
      live_streaming: true,
      guest_limit: -1,
      photo_limit: -1,
      active_days: 730,
    },
  },
] satisfies Array<{
  name: string;
  description: string;
  price: number;
  isPopular: boolean;
  benefits: Partial<Record<BenefitKeyType, boolean | number>>;
}>;

export async function seedPackages(db: NeonHttpDatabase<typeof schema>) {
  console.log('🌱 Seeding packages...');

  for (const packageData of PACKAGE_SEED_DATA) {
    const { benefits, ...packageInfo } = packageData;

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
    for (const [key, value] of Object.entries(benefits) as [
      BenefitKeyType,
      boolean | number,
    ][]) {
      const benefitDef = BENEFITS_DATA.find((b) => b.key === key);

      if (!benefitDef) {
        console.warn(`  ⚠ Benefit key "${key}" tidak ada di konstanta, skip.`);
        continue;
      }

      await db.insert(schema.packageBenefits).values({
        packageId: pkg.id,
        benefitKey: key,
        toggleValue: benefitDef.type === 'toggle' ? (value as boolean) : null,
        quotaValue: benefitDef.type === 'quota' ? (value as number) : null,
      });
    }

    console.log(`    └─ ${Object.keys(benefits).length} benefit seeded`);
  }

  console.log('✅ Package seeding complete!');
}
