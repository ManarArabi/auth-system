import { rolesTag } from '../../../../docs/tags.js'
import { addRoleRequestBodySchema, addRoleResponseBodySchema } from './schema.js'

export const rolesEndpointsDocs = {
  '/roles/': {
    post: {
      tags: [rolesTag.name],
      description: 'Adds new role with its permissions',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: addRoleRequestBodySchema
          }
        }
      },

      responses: {
        201: {
          description: 'Role added successfully',
          content: {
            'application/json': {
              schema: addRoleResponseBodySchema
            }
          }
        },

        400: {
          description: 'Bad Request'
        },

        401: {
          description: 'Invalid jwt'
        },

        403: {
          description: 'User not authorized to add new role'
        },

        409: {
          description: 'There is a role with the same name'
        },

        500: {
          description: 'Internal server error'
        }
      }
    }
  },

  '/roles/:id/permissions': {
    put: {
      tags: [rolesTag.name],
      description: 'Updates a role permissions - it will overwrite role permissions with the provided array',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: addRoleRequestBodySchema
          }
        }
      },

      responses: {
        204: {
          description: 'Role updated successfully'
        },

        400: {
          description: 'Bad Request'
        },

        401: {
          description: 'Invalid jwt'
        },

        404: {
          description: 'Role not exist'
        },

        403: {
          description: 'User not authorized to update role permissions'
        },

        500: {
          description: 'Internal server error'
        }
      }
    }
  }
}
