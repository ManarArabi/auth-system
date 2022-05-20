import Joi from 'joi'

export const usersValidation = {
  assignRoleToUser: {
    params: {
      id: Joi.string().trim().required(),
      roleId: Joi.string().trim().required()
    }
  }
}
