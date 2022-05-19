import { seedSystemPermissions } from './modules/permissions/scripts/seed-permissions.js'
import { seedSystemRoles } from './modules/roles/scripts/seed-roles.js'
import { seedSystemAdmin } from './modules/users/scripts/seed-admin.js'

export const seedSystemSetup = async () => {
  await seedSystemPermissions().catch((err) => console.log(`There is an error with seeding system roles, error: ${err}`))
  await seedSystemRoles().catch((err) => console.log(`There is an error with seeding system roles, error: ${err}`))
  await seedSystemAdmin().catch((err) => console.log(`There is an error with seeding system admin, error: ${err}`))
}
