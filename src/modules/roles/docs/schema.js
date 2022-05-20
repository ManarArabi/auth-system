export const addRoleRequestBodySchema = {
  type: 'object',
  properties: {
    roleName: { type: 'string' },
    permissions: { type: 'array', items: { type: 'string' } }
  },
  required: ['name', 'permissions']
}

export const addRoleResponseBodySchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    permissions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' }
        }
      }
    },
    _id: { type: 'string' }
  },

  required: ['name', 'requiredPermissionIds']
}
