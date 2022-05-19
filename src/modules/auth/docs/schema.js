export const signupRequestBodySchema = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' },
    email: { type: 'string' }
  },
  required: ['username', 'password', 'email']
}

export const createUserResponseBodySchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    username: { type: 'string' },
    jwt: { type: 'string' },
    email: { type: 'string' },
    role: { type: 'string' }
  }
}

export const loginRequestBodySchema = {
  type: 'object',
  properties: {
    password: { type: 'string' },
    email: { type: 'string' }
  },
  required: ['password', 'email']
}

export const loginUserResponseBodySchema = {
  type: 'object',
  properties: {
    jwt: { type: 'string' }
  }
}
