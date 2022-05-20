export const addPermissionRequestBodySchema = {
  type: 'object',
  properties: {
    permissionName: { type: 'string' }
  }
}

export const addPermissionResponseBodySchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    _id: { type: 'string' }
  }
}
