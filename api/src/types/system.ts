export interface ControllerCreateRequest {
  id: string,
}

export interface PostgresSettingsConnection {
  host: string,
  port: string,
  user: string,
  password: string,
  database: string,
}

export interface PostgresSettingsPool {
  min: number,
  max: number,
}

export interface PostgresSettings {
  client: string,
  connection: PostgresSettingsConnection,
  pool: PostgresSettingsPool,
}

export interface ElasticSearchSettings {
  host: string,
  port: string,
}

export interface DatabaseSettings {
  postgres: PostgresSettings,
  elasticsearch: ElasticSearchSettings,
}

export interface Settings {
  [key: string]: string,
}