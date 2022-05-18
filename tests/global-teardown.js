import { config } from 'dotenv'
import mongoose from 'mongoose'

config()

const globalTeardown = async () => {
  const { MONGO_TEST_URL } = process.env

  await mongoose.connect(MONGO_TEST_URL)
  await mongoose.connection.dropDatabase()

  // Close mongoose connection
  await mongoose.connection.close()
}

export default globalTeardown
