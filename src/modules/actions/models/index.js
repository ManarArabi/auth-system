import mongoose from 'mongoose'

const actionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    uniq: true
  },

  requiredPermissionIds: {
    type: [mongoose.Types.ObjectId],
    ref: 'permissions',
    required: true
  }
})

export const Actions = mongoose.model('actions', actionSchema)
