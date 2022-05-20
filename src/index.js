import app from './app.js'
import mongoose from 'mongoose'
import { config } from 'dotenv'
import { seedSystemSetup } from './seeding.js'
import { subscribeUsersEventListeners } from './modules/users/scripts/event-subscribing.js'

const port = process.env.PORT || 3000

config()

app.listen(port, () => {
  console.log(`server listening on port ${port}`)
})

mongoose.connect(process.env.MONGO_URL).then(async () => {
  console.log('Mongoose is running')

  await seedSystemSetup().catch((err) => console.log(err))
  subscribeUsersEventListeners()
}).catch(() => {
  console.log('Failed to start mongoose')
})
