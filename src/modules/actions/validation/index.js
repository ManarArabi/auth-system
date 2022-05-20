import Joi from 'joi'

export const actionValidation = {
  addAction: {
    body: {
      actionName: Joi.string().trim().required(),
      requiredPermissionIds: Joi.array().items(
        Joi.string().trim()
      ).min(1).single().required()
    }
  },

  checkUserAuthorization: {
    params: {
      id: Joi.string().trim().required(),
      userId: Joi.string().trim().required()
    }
  }
}
