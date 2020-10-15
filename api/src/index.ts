import Pino from 'pino'

import settings from './settings'
import settingsDatabase from './settings_database'
import App from './app'
import Controllers from './controllers'
import Knex from './database/knex'
import StoreFactory from './store'
import {
  Store,
} from './types/store'

const pino = Pino({
  name: 'index',
})

const knex = Knex(settingsDatabase(settings).postgres)

const store: Store = StoreFactory({
  knex,
})

const controllers = Controllers({
  store,
  settings,
})

const app = App({
  controllers,
})

app.listen(settings.port, () => {
  pino.info({
    action: 'webserver.start',
    message: `webserver started on port ${settings.port}`,
  })
})