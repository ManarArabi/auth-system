import { actionTag } from '../../../../docs/tags.js'
import { actionIdParameter, userIdParameter } from './parameters.js'
import { addActionRequestBodySchema, addActionResponseBodySchema, checkUserAuthorizationResponseBodySchema, updateActionPermissionsRequestBodySchema } from './schema.js'

export const actionEndpointsDocs = {
  '/actions/': {
    post: {
      tags: [actionTag.name],
      description: 'Adds new action with its permissions',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: addActionRequestBodySchema
          }
        }
      },

      responses: {
        201: {
          description: 'Action added successfully',
          content: {
            'application/json': {
              schema: addActionResponseBodySchema
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
          description: 'User not authorized to add new action'
        },

        404: {
          description: 'There is one permission or more are not exist'
        },

        409: {
          description: 'There is an action with the same name'
        },

        500: {
          description: 'Internal server error'
        }
      }
    }
  },

  '/actions/:id/users/:userId/authorization': {
    get: {
      tags: [actionTag.name],
      description: 'Checks whether a user can do certain action',
      parameters: [userIdParameter, actionIdParameter],
      responses: {
        200: {
          description: 'Action added successfully',
          content: {
            'application/json': {
              schema: checkUserAuthorizationResponseBodySchema
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
          description: 'User not authorized to check user action authorization'
        },

        404: {
          description: `
- User not found
- Action not found
`
        },

        500: {
          description: 'Internal server error'
        }
      }
    }
  },

  '/actions/:id/permissions': {
    put: {
      tags: [actionTag.name],
      description: 'Updates action permissions - it will overwrites the action permissions with the provided permissions',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: updateActionPermissionsRequestBodySchema
          }
        }
      },

      responses: {
        204: {
          description: 'Action Updated successfully'
        },

        400: {
          description: 'Bad Request'
        },

        401: {
          description: 'Invalid jwt'
        },

        403: {
          description: 'User not authorized to update action permissions'
        },

        404: {
          description: `
- Action is not found
- There is one permission or more are not exist
`
        },

        500: {
          description: 'Internal server error'
        }
      }
    }
  }
}
