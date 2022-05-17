import { moduleEndpointsDocumentation } from '../docs/index.js'
import { tags } from '../docs/tags.js'

export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'User Authentication System Endpoints Documentation'
  },
  host: 'localhost:3000',
  basePath: '/',
  tags,
  paths: moduleEndpointsDocumentation,
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json']
}
