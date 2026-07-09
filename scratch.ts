import { db } from './src/db';
import { invitations } from './src/db/table/invitation/invitations.table';
import { memberProfiles } from './src/db/table/member-profiles.table';

async function main() {
  const members = await db.select().from(memberProfiles);
  console.log('Member profiles:', members.map(m => ({ id: m.id, userId: m.userId })));
  const invs = await db.select().from(invitations);
  console.log('Invitations:', invs.map(i => ({ id: i.id, memberId: i.memberId })));
}
main().catch(console.error);
