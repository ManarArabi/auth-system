import mongoose from 'mongoose'

const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    uniq: true
  }
})

export const Permissions = mongoose.model('permissions', permissionSchema)
