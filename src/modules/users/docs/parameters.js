export const userIdParameter = {
  in: 'url',
  name: 'id',
  required: true,
  schema: { type: 'string' },
  description: 'The user id'
}

export const roleIdParameter = {
  in: 'url',
  name: 'roleId',
  required: true,
  schema: { type: 'string' },
  description: 'The role id'
}
