import { generateJwt } from '../../../common/helpers.js'
import { NORMAL_ROLE } from '../../roles/constants/index.js'
import { Roles } from '../../roles/model/index.js'
import { createUser } from '../../users/services/index.js'

export const authServices = {
  signup: async ({ username, password, email }) => {
    const roleId = await Roles.distinct('_id', { name: NORMAL_ROLE })

    await createUser({ username, password, email, roleId })

    const jwt = generateJwt({ data: { username, email } })

    return { jwt, username, email, role: NORMAL_ROLE }
  }
}
