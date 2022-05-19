import { authTag } from '../../../../docs/tags.js'
import { createUserResponseBodySchema, loginRequestBodySchema, loginUserResponseBodySchema, signupRequestBodySchema } from './schema.js'

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
  },

  '/login': {
    post: {
      tags: [authTag.name],
      description: 'Login user',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: loginRequestBodySchema
          }
        }
      },

      responses: {
        200: {
          description: 'Logged in successfully',
          content: {
            'application/json': {
              schema: loginUserResponseBodySchema
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
  },

  '/logout': {
    post: {
      tags: [authTag.name],
      description: 'Logout user',
      responses: {
        200: {
          description: 'Logged out successfully'
        },

        400: {
          description: 'Bad Request'
        },

        401: {
          description: 'There is no user related to the provided jwt'
        },

        500: {
          description: 'Internal server error'
        }
      }
    }
  }
}
