import mongoose from 'mongoose'

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  permissions: {
    type: [String],
    required: true
  }
})

export const Roles = mongoose.model('roles', roleSchema)
