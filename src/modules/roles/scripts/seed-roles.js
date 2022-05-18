import { ADMIN_ROLE } from '../constants/roles.js'
import { systemInitialRoles } from '../constants/seed-roles.js'
import { Roles } from '../model/index.js'

/**
 * It inserts system initial roles if there is no admin role in the DB.
 *
 * @returns {Promise}
 */
export const seedSystemRoles = async () => {
  const isAdminRoleExist = await Roles.exists({ name: ADMIN_ROLE })

  if (isAdminRoleExist) { return }

  await Roles.insertMany(systemInitialRoles)
}
