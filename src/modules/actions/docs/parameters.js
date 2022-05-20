export const userIdParameter = {
  in: 'url',
  name: 'userId',
  required: true,
  schema: { type: 'string' },
  description: 'The user id'
}

export const actionIdParameter = {
  in: 'url',
  name: 'is',
  required: true,
  schema: { type: 'string' },
  description: 'The action id'
}
