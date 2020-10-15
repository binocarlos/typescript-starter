import fs from 'fs'
import path from 'path'
import tape, {
  Test,
} from 'tape'
import Knex from 'knex'
import axios, {
  AxiosResponse,
  Method,
} from 'axios'
import getPort from 'get-port'
import randomstring from 'randomstring'

import {
  Server,
} from 'http'

import StoreFactory from '../src/store'
import ControllerFactory from '../src/controllers'
import App from '../src/app'

import {
  Store,
} from '../src/types/store'

import {
  Controller,
} from '../src/types/controller'

import {
  Settings,
  PostgresSettings,
} from '../src/types/system'

import settings from '../src/settings'

interface HTTPRequestHandler {
  (url: string, data?: any): Promise<AxiosResponse>,
}

interface HTTPRequestCollection {
  get: HTTPRequestHandler,
  post: HTTPRequestHandler,
  put: HTTPRequestHandler,
  delete: HTTPRequestHandler,
}

interface HTTPClientFactory {
  (query: {
    base?: string,
    token?: string
  }): HTTPRequestCollection
}

interface HarnessOptions {
  database?: boolean,
  web?: boolean,
  config?: {
    [name: string]: string,
  },
}

interface HarnessContext {
  settings?: Settings,
  databaseName?: string,
  knex?: Knex,
  store?: Store,
  controllers?: Controller,
  server?: Server,
  port?: number,
  url?: string,
  getClient?: HTTPClientFactory,
  config?: {
    [name: string]: string,
  },
}


const MIGRATIONS_FOLDER = path.join(__dirname, '..', 'migrations')

if(!fs.existsSync(MIGRATIONS_FOLDER)) {
  console.error(`the migrations folder was not found: ${MIGRATIONS_FOLDER}`)
  process.exit(1)
}

const getConnectionSettings = (databaseName: string): PostgresSettings => {
  return {
    client: 'pg',
    connection: {
      host: process.env.POSTGRES_SERVICE_HOST || 'postgres',
      port: "5432",
      user: 'postgres',
      password: 'postgres',
      database: databaseName,
    },
    pool: {
      min: 0,
      max: 10,
    }
  }
}

const setupDatabase = async (options: HarnessOptions, context: HarnessContext) => {
  if(!options.database) return
  const randomChars = randomstring.generate({
    length: 16,
    charset: 'alphabetic',
    capitalization: 'lowercase',
  })
  const databaseName = `testdb${randomChars}`
  const masterKnex = Knex(getConnectionSettings('postgres'))
  await masterKnex.raw(`create database ${databaseName}`)
  const testKnex = Knex(getConnectionSettings(databaseName))
  await testKnex.migrate.latest({
    directory: MIGRATIONS_FOLDER,
  })
  await masterKnex.destroy()
  context.databaseName = databaseName
  context.knex = testKnex
  context.store = StoreFactory({
    knex: testKnex,
  })
  context.controllers = ControllerFactory({
    store: context.store,
    settings: context.settings,
  })
}

const destroyDatabase = async (options: HarnessOptions, context: HarnessContext) => {
  if(!options.database) return
  if(!context.knex) return
  await context.knex.destroy()
  if(process.env.KEEP_DATABASE) return
  const masterKnex = Knex(getConnectionSettings('postgres'))
  await masterKnex.raw(`drop database ${context.databaseName}`)
  await masterKnex.destroy()
}

const setupWebserver = async (options: HarnessOptions, context: HarnessContext) => {
  if(!options.web) return
  const port = await getPort()
  const app = App({
    controllers: context.controllers,
  })
  context.server = app.listen(port)
  context.port = port
  context.url = `http://localhost:${port}`
  context.getClient = ({
    base = '/api/v1',
    token,
  }: {
    base?: string,
    token?: string,
  }): HTTPRequestCollection => {
    const factory = (method: Method): HTTPRequestHandler => async (url: string, data: any): Promise<AxiosResponse> => {
      const useUrl = `${context.url}${base}${url}`
      try {
        if(process.env.DEBUG_HTTP) {
          console.log(`${method} ${useUrl}`)
          if(data) console.log(JSON.stringify(data, null, 4))
        }
        const headers: {
          [name: string]: string,
        } = {}
        if(token) headers.Authorization = `Bearer ${token}`
        const res = await axios({
          method,
          url: useUrl,
          data,
          headers,
        })
        if(process.env.DEBUG_HTTP) {
          console.log(`${res.status}`)
          if(res.data) console.log(JSON.stringify(res.data, null, 4))
        }
        return res
      } catch(err) {
        if(process.env.DEBUG_HTTP) {
          console.log(`${err.response.status}`)
          if(err.response.data) console.log(JSON.stringify(err.response.data, null, 4))
        }
        return err.response
      }
    }
      
    return {
      get: factory('get'),
      post: factory('post'),
      put: factory('put'),
      delete: factory('delete'),
    }
  }
}

const destroyWebserver = async (options: HarnessOptions, context: HarnessContext) => {
  if(!options.web) return
  if(!context.server) return
  context.server.close()
}

const testHarness = (name: string, handler: (t: Test, context: HarnessContext) => Promise<void>, options: HarnessOptions = {
  database: true,
  web: false,
  config: {},
}) => {
  if(options.web) options.database = true
  // inject useful test based config
  const context: HarnessContext = {
    settings,
    config: Object.assign({}, options.config, {
      knowledgebaseElasticIndex: `knowledgebase-${new Date().getTime()}`,
    })
  }
  tape(name, async (t) => {
    try {
      await setupDatabase(options, context)
      await setupWebserver(options, context)
      await handler(t, context)
    } catch(err) {
      t.fail(err)
      console.log(err.stack)
    }
    await destroyWebserver(options, context)
    await destroyDatabase(options, context)
    t.end()
  })
}

export default testHarness