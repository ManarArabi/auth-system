import { BASIC_ADMIN_PERMISSIONS } from '../constants/index.js'
import { Permissions } from '../model/index.js'

/**
 * It inserts system initial permissions if there is no permissions in the DB.
 *
 * @returns {Promise}
 */
export const seedSystemPermissions = async () => {
  const isPermissionsExist = await Permissions.exists()

  if (isPermissionsExist) { return }

  await Permissions.insertMany(BASIC_ADMIN_PERMISSIONS.map(permission => ({ name: permission })))
}
