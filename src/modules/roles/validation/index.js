import Joi from 'joi'

export const rolesValidation = {
  addRole: {
    body: {
      roleName: Joi.string().trim().required(),
      permissions: Joi.array().items(Joi.string().trim()).min(1).required()
    }
  }
}
