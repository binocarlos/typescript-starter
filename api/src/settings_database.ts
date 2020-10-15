import {
  Settings,
  DatabaseSettings,
} from './types/system'

const getDatabaseSettings = (settings: Settings): DatabaseSettings => {
  return {
    postgres: {
      client: 'pg',
      connection: {
        host: settings.postgreshost,
        port: settings.postgresport,
        user: settings.postgresuser,
        password: settings.postgrespassword,
        database: settings.postgresdatabase
      },
      pool: {
        min: 2,
        max: 10
      }
    },
    elasticsearch: {
      host: settings.elasticsearchhost,
      port: settings.elasticsearchport,
    }
  }
}

export default getDatabaseSettings