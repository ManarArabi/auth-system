import { actionEndpointsDocs } from '../src/modules/actions/docs/index.js'
import { authEndpointsDocs } from '../src/modules/auth/docs/index.js'

export const moduleEndpointsDocumentation = {
  ...actionEndpointsDocs,
  ...authEndpointsDocs
}
