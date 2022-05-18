import randtoken from 'rand-token'
import mongoose from 'mongoose'
import { seedSystemRoles } from '../src/modules/roles/scripts/seed-roles.js'
import { config } from 'dotenv'

config()

const globalConfig = async () => {
  process.env.MONGO_TEST_URL = `${process.env.MONGO_TEST_URL}-${randtoken.generate(16)}`

  await mongoose.connect(process.env.MONGO_TEST_URL)

  await seedSystemRoles().catch((err) => {
    console.log(`There is an error with seeding system roles, error: ${err}`)
    process.exit(-1)
  })
}

export default globalConfig
