import { hashString } from '../../../common/helpers.js'
import { ADMIN_ROLE } from '../../roles/constants/roles.js'
import { Roles } from '../../roles/model/index.js'
import { Users } from '../model/index.js'

export const seedSystemAdmin = async () => {
  const {
    ADMIN_EMAIL,
    ADMIN_PASSWORD
  } = process.env

  const [
    hashedPassword,
    role
  ] = await Promise.all([
    hashString({ str: ADMIN_PASSWORD }),
    Roles.findOne({ name: ADMIN_ROLE }, { permissions: 1 }).lean()
  ])

  await Users.updateOne(
    { email: ADMIN_EMAIL, 'role._id': role._id },
    { username: 'admin', role, password: hashedPassword },
    { upsert: true }
  )
}
