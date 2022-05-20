import { eventEmitter } from '../../../event-emitter.js'
import { ROLE_PERMISSIONS_UPDATED } from '../../roles/constants/events.js'
import { updateUsersPermissions } from '../services/index.js'

export const subscribeUsersEventListeners = () => {
  eventEmitter.on(ROLE_PERMISSIONS_UPDATED, updateUsersPermissions)
}
