import _ from 'lodash'
import { getAdminRole, getAdminRoleId } from '../src/modules/roles/services/index.js'
import { generateJwt, hashString } from '../src/common/helpers.js'
import { Users } from '../src/modules/users/model/index.js'

export const getTestAdminUser = async ({ email }) => {
  let jwt = null

  const [adminRoleId] = await getAdminRoleId()
  const adminUser = await Users.findOne({ 'role._id': adminRoleId }).lean()

  if (_.isNil(adminUser)) {
    const adminRole = await getAdminRole()

    const userPayload = {
      email,
      username: 'testing',
      role: adminRole
    }

    const hashedPassword = await hashString({ str: '1234' })

    jwt = generateJwt({ data: userPayload })

    await Users.create({
      ...userPayload,
      password: hashedPassword,
      jwt,
      role: adminRole
    })
  } else {
    jwt = generateJwt({ data: adminUser })

    await Users.updateOne({ _id: adminUser._id }, { jwt })
  }

  return { user: adminUser, jwt }
}
