import express from 'express'
import bodyParser from 'body-parser'
import JWTAuthentication from '../authentication/jwt'

import AuthAccess from './authAccess'
import UserRoutes from './user'
import ItemRoutes from './item'
import StorageRoutes from './storage'

import {
  RouteCreateRequest,
} from '../types/route'

const Routes = ({
  controllers,
}: RouteCreateRequest) => {

  const app = express()

  const authAccess = AuthAccess({
    controllers,
  })

  const user = UserRoutes({
    controllers,
  })

  const item = ItemRoutes({
    controllers,
  })

  const storage = StorageRoutes({
    controllers,
  })

  app.use(bodyParser.json({limit: '50mb'}))
  app.use(JWTAuthentication({
    controllers,
  }))

  app.get('/auth/status', user.status)
  app.post('/auth/register', user.register)
  app.post('/auth/login', user.login)
  app.post('/auth/token', authAccess.loggedIn, user.getToken)
  app.put('/auth/settings', authAccess.loggedIn, user.updateSettings)
  app.put('/auth/password', authAccess.loggedIn, user.updatePassword)

  app.get('/items', authAccess.loggedIn, item.list)
  app.get('/items/:id', authAccess.loggedIn, item.get)
  app.post('/items', authAccess.loggedIn, item.create)
  app.put('/items/:id', authAccess.loggedIn, item.update)
  app.delete('/items/:id', authAccess.loggedIn, item.delete)
  app.put('/items/:id/meta', authAccess.loggedIn, item.updateMeta)

  app.get('/storage/download', storage.download)
  app.post('/storage/upload', authAccess.loggedIn, storage.upload)

  return app
}

export default Routes