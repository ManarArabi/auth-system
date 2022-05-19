import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },

  password: {
    type: String, // hashed
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },

  role: {
    _id: {
      type: mongoose.Types.ObjectId,
      ref: 'roles'
    },

    permissions: [{
      _id: {
        type: mongoose.Types.ObjectId,
        ref: 'permissions'
      },

      type: String
    }]
  }
})

export const Users = mongoose.model('users', userSchema)
