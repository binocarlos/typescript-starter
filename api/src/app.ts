import Pino from 'pino'
import express from 'express'
import bodyParser from 'body-parser'
import ApiRoutes from './routes'

import settings from './settings'

import {
  RouteCreateRequest,
} from './types/route'

const pino = Pino({
  name: 'app',
})

const App = ({
  controllers,
}: RouteCreateRequest) => {

  const app = express()

  app.get('/k8s-probe', (req, res, next) => {
    res.json({ok: true})
  })

  const apiHandler = ApiRoutes({
    controllers,
  })

  app.use(settings.base, apiHandler)

  app.use((req, res, next) => {
    res.status(404)
    res.json({ error: `url ${req.url} not found` })
  })

  app.use((err, req, res, next) => {
    pino.error({
      action: 'error',
      error: err.toString(),
      code: 500,
      stack: err.stack,
    })
    res.status(500)
    res.json({ error: err.toString() })
  })

  return app
}

export default App