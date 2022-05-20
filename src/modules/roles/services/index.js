import { ADMIN_ROLE } from '../constants/index.js'
import { Roles } from '../model/index.js'
import promiseMemoize from 'promise-memoize'
import { Users } from '../../users/model/index.js'

export const getAdminRoleId = promiseMemoize(async () => Roles.distinct('_id', { name: ADMIN_ROLE }))

export const getAdminRole = promiseMemoize(async () => Roles.findOne({ name: ADMIN_ROLE }).lean())

export const getAdminUser = promiseMemoize(async () => {
  const adminRoleId = await getAdminRoleId()
  const user = await Users.findOne({ 'role._id': adminRoleId }).lean()

  return user
})
