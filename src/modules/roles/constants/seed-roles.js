import { BASIC_ADMIN_PERMISSIONS } from './permissions.js'
import { ADMIN_ROLE, NORMAL_ROLE } from './roles.js'

export const systemInitialRoles = [
  {
    name: ADMIN_ROLE,
    permissions: BASIC_ADMIN_PERMISSIONS
  },
  {
    name: NORMAL_ROLE,
    permissions: []
  }
]
