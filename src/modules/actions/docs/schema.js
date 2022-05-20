export const addActionRequestBodySchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    requiredPermissionIds: { type: 'array', items: { type: 'string' } }
  },
  required: ['name', 'requiredPermissionIds']
}

export const addActionResponseBodySchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    requiredPermissionIds: { type: 'array', items: { type: 'string' } },
    _id: { type: 'string' }
  },

  required: ['name', 'requiredPermissionIds']
}