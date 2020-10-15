import fs from 'fs'
import tape from 'tape'
import path from 'path'
import Knex from 'knex'
import randomstring from 'randomstring'

const MIGRATIONS_FOLDER = path.join(__dirname, '..', 'migrations')

if(!fs.existsSync(MIGRATIONS_FOLDER)) {
  console.error(`the migrations folder was not found: ${MIGRATIONS_FOLDER}`)
  process.exit(1)
}

export const getConnectionSettings = (databaseName: string) => {
  return {
    client: 'pg',
    connection: {
      host: process.env.POSTGRES_SERVICE_HOST || 'postgres',
      port: 5432,
      user: 'postgres',
      password: 'postgres',
      database: databaseName || 'postgres',
    },
    pool: {
      min: 0,
      max: 10,
    }
  }
}

// get a fresh knex connection that is pointing to a new database
// that has it's schema initialised
export const createTestKnex = async (databaseName: string) => {
  const masterKnex = Knex(getConnectionSettings(''))
  await masterKnex.raw(`create database ${databaseName}`)
  const testKnex = Knex(getConnectionSettings(databaseName))
  await testKnex.migrate.latest({
    directory: MIGRATIONS_FOLDER,
  })
  await masterKnex.destroy()
  return testKnex
}

export const destroyTestKnex = async (databaseName, done) => {
  const masterKnex = Knex(getConnectionSettings(''))
  await masterKnex.raw(`drop database ${databaseName}`)
  await masterKnex.destroy()
}

// wrap a handler function with a test before that creates a database connection
// pass the connection into the handler so it's tests can use it
// destroy the database as the last test
export const testSuiteWithDatabase = (name, handler) => {
  let databaseConnection = null
  const getDatabaseConnection = () => databaseConnection

  const randomDatabaseName = randomstring.generate({
    length: 16,
    charset: 'alphabetic',
    capitalization: 'lowercase',
  })

  const databaseName = `testdb${randomDatabaseName}`
  tape(`${name} setup database`, (t) => {
    createTestKnex(databaseName)
  })

  handler(getDatabaseConnection, getConnectionSettings(databaseName))

  tape(`${name}: teardown database`, (t) => {
    databaseConnection
      .destroy()
      .then(() => {

        if(process.env.KEEP_DATABASE) {
          t.end()
        }
        else {
          destroyTestKnex(databaseName, (err, knex) => {
            t.notok(err, `there was no error`)
            t.end()
          })
        }

        return null
        
      })
      .catch(err => {
        t.error(err)
        t.end()
      })
  })
}

export default {
  getConnectionSettings,
  createTestKnex,
  destroyTestKnex,
  testSuiteWithDatabase,
}