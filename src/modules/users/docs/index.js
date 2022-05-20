import { usersTag } from '../../../../docs/tags.js'
import { roleIdParameter, userIdParameter } from './parameters.js'

export const userEndpointsDocs = {
  '/users/:id/roles/roleId/': {
    post: {
      tags: [usersTag.name],
      description: 'Assigns a role to the provided user',
      parameters: [userIdParameter, roleIdParameter],
      responses: {
        204: {
          description: 'Role assigned successfully'
        },

        400: {
          description: 'Bad Request'
        },

        401: {
          description: 'Invalid jwt'
        },

        403: {
          description: 'User not authorized to assign role to another user'
        },

        404: {
          description: 'Role not found'
        },

        500: {
          description: 'Internal server error'
        }
      }
    }
  }
}
