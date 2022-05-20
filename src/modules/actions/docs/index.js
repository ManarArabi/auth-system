import { actionTag } from '../../../../docs/tags.js'
import { addActionRequestBodySchema, addActionResponseBodySchema } from './schema.js'

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
  }
}
