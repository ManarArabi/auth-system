import { Permissions } from '../../permissions/model/index.js'
import { ADMIN_ROLE, NORMAL_ROLE } from '../constants/index.js'
import { Roles } from '../model/index.js'

/**
 * It inserts system initial roles if there is no admin role in the DB.
 *
 * @returns {Promise}
 */
export const seedSystemRoles = async () => {
  const isAdminRoleExist = await Roles.exists({ name: ADMIN_ROLE })

  if (isAdminRoleExist) { return }

  const systemPermissions = await Permissions.find().lean()

  await Roles.insertMany([
    {
      name: ADMIN_ROLE,
      permissions: systemPermissions
    },
    {
      name: NORMAL_ROLE,
      permissions: []
    }
  ])
}
