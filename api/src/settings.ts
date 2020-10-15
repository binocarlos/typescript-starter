const fs = require('fs')

import {
  Settings,
} from './types/system'

const required_env: string[] = [
  'POSTGRES_USER',
  'POSTGRES_DB',
  'POSTGRES_PASSWORD',
  'JWT_SECRET_KEY',
  'GOOGLE_CLOUD_SERVICE_ACCOUNT',
  'GOOGLE_STORAGE_BUCKET_NAME',
  'GOOGLE_STORAGE_BUCKET_PREFIX',
]

const decodeBase64_env: string[] = [
  'google_cloud_service_account',
]

const decodeJSON_env: string[] = [
  'google_cloud_service_account',
]

const missing_env: string[] = required_env.filter(name => process.env[name] ? false : true)

if(missing_env.length>0) {
  console.error(`The following variables are required:

${missing_env.join("\n")}
`)

  process.exit(1)
}

const args: Settings = require('minimist')(process.argv, {
  default:{

    // web server config
    port: process.env.PORT || "80",
    base: process.env.BASE || '/api/v1',

    // databases
    postgreshost: process.env.POSTGRES_SERVICE_HOST || 'postgres',
    postgresport: process.env.POSTGRES_SERVICE_PORT || "5432",
    postgresuser: process.env.POSTGRES_USER,
    postgrespassword: process.env.POSTGRES_PASSWORD,
    postgresdatabase: process.env.POSTGRES_DB,
    
    // security
    jwt_secret_key: process.env.JWT_SECRET_KEY,
    jwt_expiry: process.env.JWT_EXPIRY || '1h',
    salt_rounds: process.env.SALT_ROUNDS || "10",

    google_cloud_service_account: process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT,
    google_cloud_credentials_file: '/google_cloud.json',
    google_storage_bucket_name: process.env.GOOGLE_STORAGE_BUCKET_NAME,
    google_storage_bucket_prefix: process.env.GOOGLE_STORAGE_BUCKET_PREFIX,

  }
})

decodeBase64_env.forEach(name => {
  args[name] = Buffer.from(args[name], 'base64').toString()
})

decodeJSON_env.forEach(name => {
  args[name] = JSON.parse(args[name])
})

if(args.google_cloud_service_account) {
  fs.writeFileSync(args.google_cloud_credentials_file, JSON.stringify(args.google_cloud_service_account, null, 4))
}

export default args