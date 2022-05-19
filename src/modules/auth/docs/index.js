import { authTag } from '../../../../docs/tags.js'
import { createUserResponseBodySchema, signupRequestBodySchema } from './schema.js'

export const authEndpointsDocs = {
  '/signup': {
    post: {
      tags: [authTag.name],
      description: 'Register new **normal** user',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: signupRequestBodySchema
          }
        }
      },

      responses: {
        201: {
          description: 'Registered successfully',
          content: {
            'application/json': {
              schema: createUserResponseBodySchema
            }
          }
        },

        400: {
          description: 'Bad Request'
        },

        500: {
          description: 'Internal server error'
        }
      }
    }
  }
}
