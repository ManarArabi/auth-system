import { permissionsTag } from '../../../../docs/tags.js'
import { addPermissionRequestBodySchema, addPermissionResponseBodySchema } from './schema.js'

export const permissionEndpointsDocs = {
  '/permissions/': {
    post: {
      tags: [permissionsTag.name],
      description: 'Adds new permission',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: addPermissionRequestBodySchema
          }
        }
      },

      responses: {
        201: {
          description: 'Permission added successfully',
          content: {
            'application/json': {
              schema: addPermissionResponseBodySchema
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
          description: 'User not authorized to add new permission'
        },

        409: {
          description: 'There is an permission with the same name'
        },

        500: {
          description: 'Internal server error'
        }
      }
    }
  }
}
