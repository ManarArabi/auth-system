import app from './app.js'
import mongoose from 'mongoose'
import { seedSystemRoles } from './modules/roles/scripts/seed-roles.js'

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`server listening on port ${port}`)
})

mongoose.connect(process.env.MONGO_URL).then(async () => {
  console.log('Mongoose is running')

  await seedSystemRoles().catch((err) => console.log(`There is an error with seeding system roles, error: ${err}`))
}).catch(() => {
  console.log('Failed to start mongoose')
})
