import Joi from 'joi'

export const permissionsValidation = {
  addPermission: {
    body: {
      permissionName: Joi.string().trim().required()
    }
  }
}
