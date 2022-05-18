
import mongoose from 'mongoose'
import { Roles } from '../../roles/model'
import { createUser } from '../services'

describe('Users Module Services Unit Tests', () => {
  beforeAll(async () => {
    const { MONGO_TEST_URL } = process.env

    await mongoose.connect(MONGO_TEST_URL)
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })

  describe('createUser service', () => {
    let role
    const userPayload = { username: 'new username', password: 'new password', email: 'new@new.com' }

    beforeAll(async () => {
      role = await Roles.create({
        name: 'custom-role',
        permissions: []
      })
    })

    test('It creates user successfully', async () => {
      const user = await createUser({ ...userPayload, roleId: role._id })

      expect(user).toBeTruthy()
      expect(user.username).toBe(userPayload.username)
      expect(user.email).toBe(userPayload.email)
      expect(String(user.role._id)).toBe(String(role._id))
    })

    test('It fails if the role is not exist', async () => {
      await expect(createUser({ ...userPayload, roleId: mongoose.Types.ObjectId() })).rejects.toThrow()
    })

    test('It fails if the email is exist', async () => {
      await expect(createUser({ ...userPayload, roleId: role._id })).rejects.toThrow()
    })
  })
})
