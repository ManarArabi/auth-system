export const addActionRequestBodySchema = {
  type: 'object',
  properties: {
    ActionName: { type: 'string' },
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

export const checkUserAuthorizationResponseBodySchema = {
  type: 'object',
  properties: {
    isAuthorized: { type: 'string' }
  }
}

export const updateActionPermissionsRequestBodySchema = {
  type: 'object',
  properties: {
    permissionIds: { type: 'array', items: { type: 'string' } }
  },
  required: ['permissionIds']
}
